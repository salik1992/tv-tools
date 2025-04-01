// Please, set up your tmdb.org access token using this guide:
// https://developer.themoviedb.org/docs/getting-started
// Then save it to your .env file
export const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN ?? '';

if (ACCESS_TOKEN === '') {
	console.error(
		'For this application to work you need to set the TMDB_ACCESS_TOKEN variablie in your .env file (packages/test-app-react/.env)',
	);
}
