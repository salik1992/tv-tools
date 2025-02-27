import styled, { css } from 'styled-components';

export const H1 = styled.h1`
	font-size: 40px;
`;

export const H2 = styled.h2`
	font-size: 32px;
`;

export const H3 = styled.h3`
	font-size: 27px;
`;

export const H4 = styled.h4`
	font-size: 23px;
`;

export const H5 = styled.h5`
	font-size: 20px;
`;

export const H6 = styled.h6`
	font-size: 18px;
`;

export const P = styled.p`
	font-size: 18px;
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
