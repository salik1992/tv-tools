import { LogLevel, type ConsoleAdapter } from './types';

class Logger implements ConsoleAdapter {
	private adapters = new Set<Console>();

	private level = LogLevel.DEBUG;

	use(adapter: Console) {
		if (!this.adapters.has(adapter)) {
			this.adapters.add(adapter);
		}
	}

	ns(namespace: string): ConsoleAdapter {
		return {
			assert: (condition: boolean, ...params: unknown[]) =>
				logger.assert(condition, namespace, ...params),
			clear: () => logger.clear(),
			count: (label: string) => logger.count(`${namespace} ${label}`),
			countReset: (label: string) =>
				logger.count(`${namespace} ${label}`),
			debug: (...params: unknown[]) => logger.debug(namespace, ...params),
			error: (...params: unknown[]) => logger.error(namespace, ...params),
			info: (...params: unknown[]) => logger.info(namespace, ...params),
			log: (...params: unknown[]) => logger.log(namespace, ...params),
			time: (label: string) => logger.time(`${namespace} ${label}`),
			timeEnd: (label: string) => logger.time(`${namespace} ${label}`),
			timeLog: (label: string) => logger.time(`${namespace} ${label}`),
			warn: (...params: unknown[]) => logger.log(namespace, ...params),
		};
	}

	setLevel(logLevel: LogLevel) {
		this.level = logLevel;
	}

	assert(condition: boolean, ...params: unknown[]) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) =>
			adapter.assert(condition, ...params),
		);
	}

	clear() {
		this.adapters.forEach((adapter) => adapter.clear());
	}

	count(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.count(label));
	}

	countReset(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.countReset(label));
	}

	debug(...params: unknown[]) {
		if (this.level < LogLevel.DEBUG) return;
		this.adapters.forEach((adapter) => adapter.debug(...params));
	}

	error(...params: unknown[]) {
		if (this.level < LogLevel.ERROR) return;
		this.adapters.forEach((adapter) => adapter.error(...params));
	}

	info(...params: unknown[]) {
		if (this.level < LogLevel.INFO) return;
		this.adapters.forEach((adapter) => adapter.info(...params));
	}

	log(...params: unknown[]) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.log(...params));
	}

	time(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.time(label));
	}

	timeEnd(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.timeEnd(label));
	}

	timeLog(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.timeLog(label));
	}

	warn(...params: unknown[]) {
		if (this.level < LogLevel.WARN) return;
		this.adapters.forEach((adapter) => adapter.warn(...params));
	}
}

export const logger = new Logger();
export const ns = (namespace: string) => logger.ns(namespace);
