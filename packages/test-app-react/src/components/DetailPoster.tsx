import styled from 'styled-components';
import { Typography } from './Typography';

export const DetailPoster = styled.div.attrs<{ $src: string | null }>(
	({ $src }) => ({
		style: { backgroundImage: `url(${$src})` },
	}),
)`
	position: absolute;
	top: ${Typography.row}px;
	right: ${Typography.row}px;
	width: ${13 * Typography.column}px;
	height: ${9 * Typography.row}px;
	background-size: cover;
	background-position: center center;
`;
