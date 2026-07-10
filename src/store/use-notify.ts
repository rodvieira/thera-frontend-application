import { useMemo } from 'react';
import { useAppDispatch } from './hooks';
import { notify, type NotificationType } from './slices/notifications';

/**
 * Atalho tipado para disparar notificações (toasts) a partir de qualquer
 * componente. Mantém o slice de UI como fonte única de feedback.
 */
export function useNotify() {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    const push = (type: NotificationType) => (message: string) =>
      dispatch(notify({ type, message }));

    return {
      success: push('success'),
      error: push('error'),
      info: push('info'),
    };
  }, [dispatch]);
}
