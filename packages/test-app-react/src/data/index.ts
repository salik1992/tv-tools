import { TmdbApi } from './tmdb';
import { ACCESS_TOKEN } from './token';

export const tmdb = new TmdbApi(ACCESS_TOKEN);
