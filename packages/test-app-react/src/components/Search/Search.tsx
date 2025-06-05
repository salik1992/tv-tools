import { type ChangeEvent, useCallback, useState } from 'react';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { useDebouncedCallback } from '@salik1992/tv-tools-react/utils/useDebouncedCallback';
import { AssetsRow } from '../AssetsRow';
import { Input } from '../Input';
import { Screen } from '../Screen';
import { H3 } from '../Typography';
import { GenericKeyboard } from '../VirtualKeyboard';
import * as css from './Search.module.scss';

const SEARCH_DEBOUNCE_MS = 2000;

export const Search = () => {
	const [searchValue, setSearchValue] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const deferredSetSearchQuery = useDebouncedCallback(
		setSearchQuery,
		[setSearchQuery],
		{ limitMs: SEARCH_DEBOUNCE_MS },
	);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value);
			deferredSetSearchQuery(e.target.value);
		},
		[setSearchValue],
	);

	return (
		<Screen>
			<VerticalFocus>
				<Input
					className={css.input}
					type="text"
					placeholder="Search..."
					value={searchValue}
					onChange={onChange}
					VirtualKeyboard={GenericKeyboard}
					focusOnMount
				/>
				{searchValue === '' && searchQuery === '' && (
					<H3 className={css.hint}>
						Tell us, what you want to find.
					</H3>
				)}
				{searchValue !== searchQuery && (
					<H3 className={css.hint}>Searching...</H3>
				)}{' '}
				{searchQuery === searchValue && searchQuery !== '' && (
					<>
						<AssetsRow
							listData={{
								filterBy: 'search',
								type: 'movie',
								title: `Movies matching "${searchQuery}"`,
								query: searchQuery,
							}}
							showDetail={false}
						/>
						<AssetsRow
							listData={{
								filterBy: 'search',
								type: 'series',
								title: `TV matching "${searchQuery}"`,
								query: searchQuery,
							}}
							showDetail={false}
						/>
						<AssetsRow
							listData={{
								filterBy: 'search',
								type: 'person',
								title: `People matching "${searchQuery}"`,
								query: searchQuery,
							}}
							showDetail={false}
						/>
					</>
				)}
			</VerticalFocus>
		</Screen>
	);
};
