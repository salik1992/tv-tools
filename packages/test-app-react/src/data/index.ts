import { createContext, useContext } from 'react';
import { DataProvider } from '@salik1992/test-app-data/DataProvider';
import {
	type TmdbConfiguration,
	TmdbDataProvider,
} from '@salik1992/test-app-data-tmdb';
import { ACCESS_TOKEN } from './token';

const tmdb = new TmdbDataProvider(ACCESS_TOKEN);

const DataProviderContext =
	createContext<DataProvider<TmdbConfiguration>>(tmdb);

export type ListDataConfiguration = TmdbConfiguration['filter'];
export const useDataProvider = () => useContext(DataProviderContext);
