import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify: {
      reducer(state, action: PayloadAction<Notification>) {
        state.items.push(action.payload);
      },
      prepare(input: { type: NotificationType; message: string }) {
        return { payload: { id: nanoid(), ...input } };
      },
    },
    dismiss(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { notify, dismiss } = notificationsSlice.actions;
export const selectNotifications = (state: RootState) =>
  state.notifications.items;

export default notificationsSlice.reducer;
