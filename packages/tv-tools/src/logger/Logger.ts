import { type ConsoleAdapter, LogLevel } from './types';

/**
 * Main logger to be used by packages so that the developers can
 * adjust the level of logging or to connect the logs from the package
 * to their custom tools.
 */
class Logger implements ConsoleAdapter {
	/**
	 * The set of adapters that receive the logs.
	 */
	protected adapters = new Set<ConsoleAdapter>();

	/**
	 * Miminal level that is logged.
	 */
	protected level = LogLevel.DEBUG;

	/**
	 * Creates a logging output. Use to connect your logging adapter.
	 * @param adapter - the adapter to feed logs into
	 * @example
	 * ```typescript
	 * logger.use(window.console).use(debugConsole);
	 * ```
	 */
	public use(adapter: ConsoleAdapter) {
		if (!this.adapters.has(adapter)) {
			this.adapters.add(adapter);
		}
		return this;
	}

	/**
	 * Create a logger interface with a namespace. This will simply add passed
	 * string as the first parameter of the log or in case of labeled logs it
	 * prepends this string in front of the label.
	 *
	 * This function is also exported separately as `ns` function.
	 *
	 * @param namespace - the namespace name
	 * @returns ConsoleAdapter - the same logging interface as the basic logger
	 * @example
	 * ```typescript
	 * const logger = ns('List');
	 * logger.log('test'); // the same as logger.log('List', 'test');
	 * ```
	 */
	public ns(namespace: string): ConsoleAdapter {
		return {
			assert: (condition: boolean, ...params: unknown[]) =>
				logger.assert(condition, namespace, ...params),
			clear: () => logger.clear(),
			count: (label: string) => logger.count(`${namespace} ${label}`),
			countReset: (label: string) =>
				logger.countReset(`${namespace} ${label}`),
			debug: (...params: unknown[]) => logger.debug(namespace, ...params),
			error: (...params: unknown[]) => logger.error(namespace, ...params),
			info: (...params: unknown[]) => logger.info(namespace, ...params),
			log: (...params: unknown[]) => logger.log(namespace, ...params),
			time: (label: string) => logger.time(`${namespace} ${label}`),
			timeEnd: (label: string) => logger.timeEnd(`${namespace} ${label}`),
			timeLog: (label: string) => logger.timeLog(`${namespace} ${label}`),
			warn: (...params: unknown[]) => logger.warn(namespace, ...params),
		};
	}

	/**
	 * Change the level of logs that are being collected.
	 * @param logLevel - the level to set
	 */
	public setLevel(logLevel: LogLevel) {
		this.level = logLevel;
	}

	/**
	 * Create a log entry if the condition is false at the LOG level.
	 * @param condition - The condition that when negative, the log is created
	 * @param ...params - The things to log
	 */
	public assert(condition: boolean, ...params: unknown[]) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) =>
			adapter.assert(condition, ...params),
		);
	}

	/**
	 * Clears the console output.
	 */
	public clear() {
		this.adapters.forEach((adapter) => adapter.clear());
	}

	/**
	 * Creates a counter.
	 * @param label - label of the counter to count
	 */
	public count(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.count(label));
	}

	/**
	 * Resets a counter.
	 * @param - label of the counter to reset
	 */
	public countReset(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.countReset(label));
	}

	/**
	 * Creates a log at the DEBUG level.
	 * @param ...params - The things to log
	 */
	public debug(...params: unknown[]) {
		if (this.level < LogLevel.DEBUG) return;
		this.adapters.forEach((adapter) => adapter.debug(...params));
	}

	/**
	 * Creates a log at the ERROR level.
	 * @param ...params - The things to log
	 */
	public error(...params: unknown[]) {
		if (this.level < LogLevel.ERROR) return;
		this.adapters.forEach((adapter) => adapter.error(...params));
	}

	/**
	 * Creates a log at the INFO level.
	 * @param ...params - The things to log
	 */
	public info(...params: unknown[]) {
		if (this.level < LogLevel.INFO) return;
		this.adapters.forEach((adapter) => adapter.info(...params));
	}

	/**
	 * Creates a log at the LOG level.
	 * @param ...params - The things to log
	 */
	public log(...params: unknown[]) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.log(...params));
	}

	/**
	 * Creates a timer.
	 * @param label - The name of the timer
	 */
	public time(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.time(label));
	}

	/**
	 * Stops the timer.
	 * @param label - The name of the timer
	 */
	public timeEnd(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.timeEnd(label));
	}

	/**
	 * Logs the current time of the timer.
	 * @param label - The name of the timer
	 */
	public timeLog(label: string) {
		if (this.level < LogLevel.LOG) return;
		this.adapters.forEach((adapter) => adapter.timeLog(label));
	}

	/**
	 * Creates a log at the WARN level.
	 * @param ...params - The things to log
	 */
	public warn(...params: unknown[]) {
		if (this.level < LogLevel.WARN) return;
		this.adapters.forEach((adapter) => adapter.warn(...params));
	}
}

/**
 * Main logger to be used by packages so that the developers can
 * adjust the level of logging or to connect the logs from the package
 * to their custom tools.
 */
export const logger = new Logger();

/**
 * Create a logger interface with a namespace. This will simply add passed
 * string as the first parameter of the log or in case of labeled logs it
 * prepends this string in front of the label.
 *
 * This function is also exported separately as `ns` function.
 *
 * @param namespace - the namespace name
 * @returns ConsoleAdapter - the same logging interface as the basic logger
 * @example
 * ```typescript
 * const logger = ns('List');
 * logger.log('test'); // the same as logger.log('List', 'test');
 * ```
 */
export const ns = (namespace: string) => logger.ns(namespace);
