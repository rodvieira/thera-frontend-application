import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus } from '@/domain/types';
import type { RootState } from '@/store';

export interface MonitoringFilters {
  status: OrderStatus | '';
  clientId: string;
  transportTypeId: string;
  date: string;
}

const initialState: MonitoringFilters = {
  status: '',
  clientId: '',
  transportTypeId: '',
  date: '',
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<MonitoringFilters>>) {
      return { ...state, ...action.payload };
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const { setFilter, clearFilters } = monitoringSlice.actions;
export const selectMonitoringFilters = (state: RootState) => state.monitoring;
export default monitoringSlice.reducer;
