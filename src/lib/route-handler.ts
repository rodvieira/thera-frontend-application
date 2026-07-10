import { NextResponse } from 'next/server';
import { HttpError } from '@/mocks/data/repository';

/**
 * Executa a lógica de um Route Handler e traduz `HttpError` em respostas HTTP,
 * evitando repetir try/catch em cada rota.
 */
export async function handleRoute<T>(
  fn: () => T | Promise<T>,
  successStatus = 200,
): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data, { status: successStatus });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}
