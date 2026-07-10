import { all } from 'redux-saga/effects';
import { ordersSaga } from '@/features/orders/store/orders-saga';

/**
 * Root saga da aplicação. Combina as sagas de cada feature.
 */
export function* rootSaga() {
  yield all([ordersSaga()]);
}
