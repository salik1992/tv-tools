import { Asset } from '@salik1992/test-app-data/types';
import { DetailLabel } from './DetailLabel';
import { P } from './Typography';

export const DetailRating = ({ asset }: { asset: Asset }) =>
	asset.rating && (
		<P>
			<DetailLabel>Rating: </DetailLabel>
			{asset.rating.value}
			{asset.rating.unit}
			{asset.rating.votes && (
				<DetailLabel> ({asset.rating.votes} votes)</DetailLabel>
			)}
		</P>
	);
