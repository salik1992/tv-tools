import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';

const COLORS = {
	primary: '#ffffff',
	secondary: '#666666',
	danger: '#ff9900',
} as const;

const BG_COLORS = {
	primary: '#666699',
	secondary: '#ccccff',
	danger: '#666699',
} as const;

const InteractableButton = styled(Interactable)<
	Pick<Parameters<typeof Button>[0], 'type'>
>`
	display: inline-block;
	padding: 10px 20px;
	box-sizing: border-box;
	border-radius: 5px;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	background-color: ${({ type }) => BG_COLORS[type]};
	outline: none;
	transition:
		border-color 300ms,
		transform 300ms;

	&:focus {
		border-color: ${({ type }) => COLORS[type]};
		transform: scale(1.1);
	}
`;

export const Button = ({
	type = 'primary',
	...props
}: Parameters<typeof Interactable>[0] & {
	type?: 'primary' | 'secondary' | 'danger';
}) => <InteractableButton {...props} type={type} />;
