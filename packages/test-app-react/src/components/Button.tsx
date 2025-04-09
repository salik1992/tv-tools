import styled from 'styled-components';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { Border, Colors } from './Theme';
import { Typography } from './Typography';

const COLORS = {
	primary: Colors.bg.action,
	secondary: Colors.bg.focus,
	danger: Colors.bg.danger,
} as const;

const InteractableButton = styled(Interactable)<
	Required<Pick<Parameters<typeof Button>[0], 'type'>>
>`
	display: inline-block;
	padding: ${Typography.column}px ${Typography.column}px;
	${Border}
	background-color: ${({ type }) => COLORS[type]};
	cursor: pointer;
`;

export const Button = ({
	type = 'primary',
	...props
}: Parameters<typeof Interactable>[0] & {
	type?: 'primary' | 'secondary' | 'danger';
}) => <InteractableButton {...props} type={type} />;
