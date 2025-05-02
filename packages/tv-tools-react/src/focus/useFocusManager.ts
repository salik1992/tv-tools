import { useFocusContext } from './useFocusContext';

export function useFocusManager() {
	return useFocusContext().focusManager;
}
