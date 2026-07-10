'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  dismiss,
  selectNotifications,
  type Notification,
} from '@/store/slices/notifications';

const TONE: Record<Notification['type'], string> = {
  success: 'border-status-entregue/40',
  error: 'border-destructive/50',
  info: 'border-border',
};

function ToastItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-md border bg-card px-4 py-3 text-sm shadow-md',
        TONE[notification.type],
      )}
    >
      <span className="flex-1">{notification.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** Renderiza as notificações ativas do store como toasts, com auto-dismiss. */
export function Toaster() {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dispatch(dismiss(notification.id))}
        />
      ))}
    </div>
  );
}
