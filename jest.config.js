export default {
	collectCoverageFrom: [
		'packages/tv-tools/src/**/*.ts',
		'packages/tv-tools-react/src/**/*.{ts,tsx}',
		'!**/*.mock.*',
		'!**/mocks.*',
		'!**/index.ts',
		'!**/types.ts',
	],
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
