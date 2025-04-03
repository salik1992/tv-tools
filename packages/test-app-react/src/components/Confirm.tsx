import { useCallback } from 'react';
import styled from 'styled-components';
import { runAsync } from '@salik1992/tv-tools/utils/runAsync';
import { HorizontalFocus } from '@salik1992/tv-tools-react/focus';
import { Button } from './Button';
import { useModal } from './Modal';
import { P, Typography } from './Typography';

const Wrap = styled.div`
	position: relative;
	overflow: hidden;
	height: ${5 * Typography.row}px;
	margin-bottom: ${Typography.row}px;
`;

const Centered = styled.div`
	text-align: center;
`;

const Confirm = ({
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
		<Centered>
			<Wrap>
				<P>{question}</P>
			</Wrap>
			<HorizontalFocus>
				<Button type="primary" onPress={onYes} focusOnMount>
					{yes}
				</Button>{' '}
				<Button type="primary" onPress={onNo}>
					{no}
				</Button>
			</HorizontalFocus>
		</Centered>
	);
};

export const useConfirm = () => {
	const { open, close } = useModal();

	const confirm = useCallback(
		(question: string, yes?: string, no?: string) =>
			new Promise<boolean>((resolve) => {
				const onYes = () => {
					close();
					runAsync(() => resolve(true));
					return true;
				};
				const onNo = () => {
					close();
					runAsync(() => resolve(false));
					return true;
				};
				open(
					<Confirm
						question={question}
						yes={yes}
						no={no}
						onYes={onYes}
						onNo={onNo}
					/>,
					'small',
				);
			}),
		[open, close],
	);

	return confirm;
};
