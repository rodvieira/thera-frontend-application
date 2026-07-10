import { all } from 'redux-saga/effects';

/**
 * Root saga da aplicação. As sagas de cada feature (ex.: transição de status da
 * OV, agendamento) serão registradas aqui conforme forem implementadas.
 */
export function* rootSaga() {
  yield all([]);
}
