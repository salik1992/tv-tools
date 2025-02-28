import styled from 'styled-components';
import { Asset } from '../data/types';
import { H2, nLineEllipsis, oneLineEllipsis, P } from './Typography';

const Wrap = styled.div.attrs<{ $visible: boolean }>(({ $visible }) => ({
	style: { height: $visible ? '200px' : '0px' },
}))`
	overflow: hidden;
	transition: height 300ms;
`;

const Title = styled(H2)`
	${oneLineEllipsis}
`;

const Description = styled(P)`
	line-height: 35px;
	max-width: 1000px;
	max-height: 105px;
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
			{asset.description ?? 'No description provided.'}
		</Description>
	</Wrap>
);
