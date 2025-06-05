import { HorizontalFocus } from '@salik1992/tv-tools-react/focus';
import { Button } from '../Button';
import { P } from '../Typography';
import * as css from './Confirm.module.scss';

export const Confirm = ({
	question,
	yes = 'Yes',
	no = 'No',
	onYes,
	onNo,
}: {
	question: string;
	yes?: string;
	no?: string;
	onYes: () => boolean;
	onNo: () => boolean;
}) => {
	return (
		<div className={css.centered}>
			<div className={css.wrap}>
				<P>{question}</P>
			</div>
			<HorizontalFocus>
				<Button type="primary" onPress={onYes} focusOnMount>
					{yes}
				</Button>{' '}
				<Button type="primary" onPress={onNo}>
					{no}
				</Button>
			</HorizontalFocus>
		</div>
	);
};
