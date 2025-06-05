import { P } from '../Typography';
import * as css from './Disclaimer.module.scss';

export const Disclaimer = () => (
	<div className={css.wrap}>
		<P className={css.text}>The data for the application are provided by</P>
		<P className={css.text}>The Movie Database (https://themoviedb.org)</P>
	</div>
);
