import { type ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { useDebouncedCallback } from '@salik1992/tv-tools-react/utils/useDebouncedCallback';
import { AssetsRow } from './AssetsRow';
import { Input } from './Input';
import { Screen } from './Screen';
import { H3, Typography } from './Typography';

const SEARCH_DEBOUNCE_MS = 2000;

const SearchInput = styled(Input)`
	width: 1590px;
	margin-top: ${2 * Typography.row}px;
`;

const Hint = styled(H3)`
	text-align: center;
	margin-top: ${2 * Typography.row}px;
`;

export const Search = () => {
	const [searchValue, setSearchValue] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const defferedSetSearchQuery = useDebouncedCallback(
		setSearchQuery,
		[setSearchQuery],
		{ limitMs: SEARCH_DEBOUNCE_MS },
	);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value);
			defferedSetSearchQuery(e.target.value);
		},
		[setSearchValue],
	);

	return (
		<Screen>
			<VerticalFocus>
				<SearchInput
					type="text"
					placeholder="Search..."
					value={searchValue}
					onChange={onChange}
					focusOnMount
				/>
				{searchValue === '' && searchQuery === '' && (
					<Hint>Tell us, what you want to find.</Hint>
				)}
				{searchValue !== searchQuery && <Hint>Searching...</Hint>}{' '}
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
					</>
				)}
			</VerticalFocus>
		</Screen>
	);
};
