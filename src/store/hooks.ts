import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

/** Hooks tipados para uso em toda a aplicação (evitam anotar tipos manualmente). */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
