import styled, { css } from 'styled-components';

export const Typography = {
	row: 30,
	column: 15,
	font: 25,
} as const;

export const Base = css`
	margin: 0;
	line-height: ${Typography.row}px;
	font-size: ${Typography.font}px;
`;

export const H1 = styled.h1`
	${Base}
	font-weight: 900;
`;

export const H2 = styled.h2`
	${Base}
	font-weight: 800;
`;

export const H3 = styled.h3`
	${Base}
	font-weight: 700;
`;

export const H4 = styled.h4`
	${Base}
	font-weight: 600;
`;

export const H5 = styled.h5`
	${Base}
	font-weight: 500;
`;

export const H6 = styled.h6`
	${Base}
	font-weight: 400;
	text-decoration: underline;
`;

export const P = styled.p`
	${Base}
	font-weight: 400;
	margin: 0;
`;

export const oneLineEllipsis = css`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

export const nLineEllipsis = (n: number) => css`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: ${n};
	overflow: hidden;
`;

export const NBSP = '\u00A0';
