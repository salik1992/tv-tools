import { type ComponentType, type PropsWithChildren, useMemo } from 'react';

export const Providers = ({
	providers,
	children,
}: PropsWithChildren<{ providers: ComponentType<PropsWithChildren>[] }>) => {
	const OrderedProviders = useMemo(() => {
		return [...providers].reverse().reduce(
			/* eslint-disable react/display-name */
			(acc, Provider) =>
				({ children }: PropsWithChildren) => (
					<Provider>{acc({ children })}</Provider>
				),
			/* eslint-enable react/display-name */
			({ children }: PropsWithChildren) => <>{children}</>,
		);
	}, [providers]);

	return <OrderedProviders>{children}</OrderedProviders>;
};
