import { useParams } from 'react-router-dom';

export const useAssertedParams = <
	Checks extends Record<string, (paramValue: unknown) => unknown>,
>(
	checks: Checks,
) => {
	const params = useParams();
	for (const paramName in checks) {
		const paramValue = params[paramName];
		const validate = checks[paramName];
		validate(paramValue);
	}
	return params as { [K in keyof Checks]: ReturnType<Checks[K]> };
};
