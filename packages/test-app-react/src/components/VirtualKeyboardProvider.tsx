import styled from 'styled-components';
import { VirtualKeyboardProvider as VirtualKeyboardProviderBase } from '@salik1992/tv-tools-react/input-with-virtual-keyboard';
import { Colors } from './Theme';

export const VirtualKeyboardProvider = styled(VirtualKeyboardProviderBase)`
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: ${Colors.bg.opaque};
	z-index: 10;
`;
