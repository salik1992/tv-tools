import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { Screen } from './Screen';
import { Typography } from './Typography';

const SearchInput = styled(Input)`
	width: 1590px;
	margin-top: ${2 * Typography.row}px;
`;

export const Search = () => {
	const [searchValue, setSearchValue] = useState('');

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value);
		},
		[setSearchValue],
	);

	return (
		<Screen>
			<SearchInput
				type="text"
				placeholder="Search..."
				value={searchValue}
				onChange={onChange}
				focusOnMount
			/>
		</Screen>
	);
};
