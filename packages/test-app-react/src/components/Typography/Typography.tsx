import { type ForwardedRef, type HTMLProps, forwardRef } from 'react';
import * as css from './Typography.module.scss';

export const ROW = 30;
export const COLUMN = 15;
export const FONT = 25;

export const H1 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h1 ref={ref} className={`${css.h1} ${className || ''}`} {...props} />,
);
H1.displayName = 'H1';

export const H2 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h2 ref={ref} className={`${css.h2} ${className || ''}`} {...props} />,
);
H2.displayName = 'H2';

export const H3 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h3 ref={ref} className={`${css.h3} ${className || ''}`} {...props} />,
);
H3.displayName = 'H3';

export const H4 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h4 ref={ref} className={`${css.h4} ${className || ''}`} {...props} />,
);
H4.displayName = 'H4';

export const H5 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h5 ref={ref} className={`${css.h5} ${className || ''}`} {...props} />,
);
H5.displayName = 'H5';

export const H6 = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLHeadingElement>,
		ref: ForwardedRef<HTMLHeadingElement>,
	) => <h6 ref={ref} className={`${css.h6} ${className || ''}`} {...props} />,
);
H6.displayName = 'H6';

export const P = forwardRef(
	(
		{ className = '', ...props }: HTMLProps<HTMLParagraphElement>,
		ref: ForwardedRef<HTMLParagraphElement>,
	) => <p ref={ref} className={`${css.p} ${className || ''}`} {...props} />,
);
P.displayName = 'P';

export const NBSP = '\u00A0';
