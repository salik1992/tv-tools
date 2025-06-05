import { useCallback } from 'react';
import { runAsync } from '@salik1992/tv-tools/utils/runAsync';
import { Confirm } from '../components/Confirm';
import { useModal } from './useModal';

export const useConfirm = () => {
	const { open, close } = useModal();

	const confirm = useCallback(
		(question: string, yes?: string, no?: string) =>
			new Promise<boolean>((resolve) => {
				const onButtonPress = (result: boolean) => () => {
					close();
					runAsync(() => resolve(result));
					return true;
				};
				open(
					<Confirm
						question={question}
						yes={yes}
						no={no}
						onYes={onButtonPress(true)}
						onNo={onButtonPress(false)}
					/>,
					'small',
				);
			}),
		[open, close],
	);

	return confirm;
};
