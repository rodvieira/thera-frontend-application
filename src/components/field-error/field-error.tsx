/** Mensagem de erro de um campo de formulário. Não renderiza nada se vazio. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
