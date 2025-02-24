export enum LogLevel {
	ERROR,
	WARN,
	LOG,
	INFO,
	DEBUG,
}

export interface ConsoleAdapter {
	assert(condition: boolean, ...params: unknown[]): void;
	clear(): void;
	count(label: string): void;
	countReset(label: string): void;
	debug(...params: unknown[]): void;
	error(...params: unknown[]): void;
	info(...params: unknown[]): void;
	log(...params: unknown[]): void;
	time(label: string): void;
	timeEnd(label: string): void;
	timeLog(label: string): void;
	warn(...params: unknown[]): void;
}
