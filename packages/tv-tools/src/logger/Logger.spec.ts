import { logger, ns } from './Logger';

const adapter = {
	assert: jest.fn(),
	clear: jest.fn(),
	count: jest.fn(),
	countReset: jest.fn(),
	debug: jest.fn(),
	error: jest.fn(),
	info: jest.fn(),
	log: jest.fn(),
	time: jest.fn(),
	timeEnd: jest.fn(),
	timeLog: jest.fn(),
	warn: jest.fn(),
};

describe('Logger', () => {
	beforeAll(() => {
		logger.use(adapter);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each(['debug', 'error', 'info', 'log', 'warn'] as const)(
		'should call %s',
		(method) => {
			logger[method]('param1', 'param2');
			expect(adapter[method]).toHaveBeenCalledWith('param1', 'param2');
		},
	);

	it('should call assert', () => {
		logger.assert(false, 'param1', 'param2');
		expect(adapter.assert).toHaveBeenCalledWith(false, 'param1', 'param2');
	});

	it('should call clear', () => {
		logger.clear();
		expect(adapter.clear).toHaveBeenCalled();
	});

	it('should call count', () => {
		logger.count('label');
		expect(adapter.count).toHaveBeenCalledWith('label');
	});

	it('should call countReset', () => {
		logger.countReset('label');
		expect(adapter.countReset).toHaveBeenCalledWith('label');
	});

	it('should call time', () => {
		logger.time('label');
		expect(adapter.time).toHaveBeenCalledWith('label');
	});

	it('should call timeEnd', () => {
		logger.timeEnd('label');
		expect(adapter.timeEnd).toHaveBeenCalledWith('label');
	});

	it('should call timeLog', () => {
		logger.timeLog('label');
		expect(adapter.timeLog).toHaveBeenCalledWith('label');
	});

	describe('ns', () => {
		const namespacedLogger = ns('namespace');

		it.each(['debug', 'error', 'info', 'log', 'warn'] as const)(
			'should call namespaced %s',
			(method) => {
				namespacedLogger[method]('param1', 'param2');
				expect(adapter[method]).toHaveBeenCalledWith(
					'namespace',
					'param1',
					'param2',
				);
			},
		);

		it('should call namespaced assert', () => {
			namespacedLogger.assert(false, 'param1', 'param2');
			expect(adapter.assert).toHaveBeenCalledWith(
				false,
				'namespace',
				'param1',
				'param2',
			);
		});

		it('should call namespaced clear', () => {
			namespacedLogger.clear();
			expect(adapter.clear).toHaveBeenCalled();
		});

		it('should call namespaced count', () => {
			namespacedLogger.count('label');
			expect(adapter.count).toHaveBeenCalledWith('namespace label');
		});

		it('should call namespaced countReset', () => {
			namespacedLogger.countReset('label');
			expect(adapter.countReset).toHaveBeenCalledWith('namespace label');
		});

		it('should call namespaced time', () => {
			namespacedLogger.time('label');
			expect(adapter.time).toHaveBeenCalledWith('namespace label');
		});

		it('should call namespaced timeEnd', () => {
			namespacedLogger.timeEnd('label');
			expect(adapter.timeEnd).toHaveBeenCalledWith('namespace label');
		});

		it('should call namespaced timeLog', () => {
			namespacedLogger.timeLog('label');
			expect(adapter.timeLog).toHaveBeenCalledWith('namespace label');
		});
	});
});
