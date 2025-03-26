import { useParams } from 'react-router-dom';

export const useAssertedParams = <
	Checks extends Record<string, (paramValue: unknown) => unknown>,
>(
	checks: Checks,
) => {
	const params = useParams();
	const validatedParams = {} as {
		[K in keyof Checks]: ReturnType<Checks[K]>;
	};
	for (const paramName in checks) {
		const paramValue = params[paramName];
		const validate = checks[paramName];
		validatedParams[paramName] = validate(paramValue) as ReturnType<
			Checks[typeof paramName]
		>;
	}
	return validatedParams;
};
