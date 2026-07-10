import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus } from '@/domain/types';
import type { RootState } from '@/store';

export interface StatusTransitionRequest {
  id: string;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
}

interface OrdersState {
  /** Id da OV cuja transição está em andamento (para desabilitar UI). */
  transitioningId: string | null;
}

const initialState: OrdersState = { transitioningId: null };

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    statusTransitionRequested(
      state,
      action: PayloadAction<StatusTransitionRequest>,
    ) {
      state.transitioningId = action.payload.id;
    },
    statusTransitionSettled(state) {
      state.transitioningId = null;
    },
  },
});

export const { statusTransitionRequested, statusTransitionSettled } =
  ordersSlice.actions;

export const selectTransitioningId = (state: RootState) =>
  state.orders.transitioningId;

export default ordersSlice.reducer;
