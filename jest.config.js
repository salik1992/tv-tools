export default {
	testEnvironment: 'jsdom',
	transform: {
		'^.+.[tj]sx?$': [
			'ts-jest',
			{
				tsconfig: './tsconfig.jest.json',
			},
		],
	},
};
