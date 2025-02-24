import { createContext } from 'react';
import { noop } from '@salik1992/tv-tools/utils/noop';
import type { Focus } from './types';

export const FocusContext = createContext<Focus>({
	addChild: noop,
});
