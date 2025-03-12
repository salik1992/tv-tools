import styled from 'styled-components';
import type { Asset } from '@salik1992/test-app-data/types';
import { H4, nLineEllipsis, oneLineEllipsis, P } from './Typography';

const Wrap = styled.div.attrs<{ $visible: boolean }>(({ $visible }) => ({
	style: { height: $visible ? '250px' : '0px' },
}))`
	overflow: hidden;
	transition: height 300ms;
`;

const Title = styled(H4)`
	${oneLineEllipsis}
`;

const Description = styled(P)`
	line-height: 35px;
	max-width: 1000px;
	height: 110px;
	${nLineEllipsis(3)}
`;

export const AssetsRowDetail = ({
	visible,
	asset,
}: {
	visible: boolean;
	asset: Asset;
}) => (
	<Wrap $visible={visible}>
		<Title>{asset.title}</Title>
		<Description>
			{asset.description || 'No description provided.'}
		</Description>
	</Wrap>
);
