import { createContext, useContext } from 'react';
import type { DataProvider } from '@salik1992/test-app-data/DataProvider';
import {
	type TmdbConfiguration,
	type TmdbConfigurationFilters,
	TmdbDataProvider,
} from '@salik1992/test-app-data-tmdb';
import { ACCESS_TOKEN } from './token';

const tmdb = new TmdbDataProvider(ACCESS_TOKEN);

const DataProviderContext =
	createContext<DataProvider<TmdbConfiguration>>(tmdb);

export type ListDataConfiguration = TmdbConfigurationFilters;
export const useDataProvider = () => useContext(DataProviderContext);
