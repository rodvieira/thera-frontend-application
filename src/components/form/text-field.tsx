'use client';

import { forwardRef, useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/field-error';

interface TextFieldProps extends React.ComponentProps<'input'> {
  label: string;
  error?: string;
}

/**
 * Campo de texto com rótulo e mensagem de erro. Compatível com `register` do
 * React Hook Form (encaminha o `ref`). Evita repetir Label + Input + erro.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, ...props }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input id={fieldId} ref={ref} aria-invalid={!!error} {...props} />
        <FieldError message={error} />
      </div>
    );
  },
);
