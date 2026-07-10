import { call, getContext, put, takeEvery } from 'redux-saga/effects';
import type { QueryClient } from '@tanstack/react-query';
import { canTransition, ORDER_STATUS_LABELS } from '@/domain/order-status';
import { ApiError } from '@/lib/api-client';
import { notify } from '@/store/slices/notifications';
import { ordersApi } from '../api';
import { orderKeys } from '../hooks';
import {
  statusTransitionRequested,
  statusTransitionSettled,
} from './orders-slice';

/**
 * Orquestra a transição de status da OV (efeito multi-etapa):
 * valida (domínio) → chama a API → invalida as queries de OV → notifica.
 */
function* handleStatusTransition(
  action: ReturnType<typeof statusTransitionRequested>,
) {
  const { id, currentStatus, nextStatus } = action.payload;

  if (!canTransition(currentStatus, nextStatus)) {
    yield put(
      notify({ type: 'error', message: 'Transição de status inválida' }),
    );
    yield put(statusTransitionSettled());
    return;
  }

  try {
    yield call(ordersApi.updateStatus, id, nextStatus);

    const queryClient: QueryClient = yield getContext('queryClient');
    yield call([queryClient, queryClient.invalidateQueries], {
      queryKey: orderKeys.all,
    });

    yield put(
      notify({
        type: 'success',
        message: `OV avançada para ${ORDER_STATUS_LABELS[nextStatus]}`,
      }),
    );
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : 'Erro ao atualizar status';
    yield put(notify({ type: 'error', message }));
  } finally {
    yield put(statusTransitionSettled());
  }
}

export function* ordersSaga() {
  yield takeEvery(statusTransitionRequested.type, handleStatusTransition);
}
