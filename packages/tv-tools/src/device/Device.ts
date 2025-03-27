import { IEventListener } from '../utils/EventListener';

export type ScreenSize = 'unknown' | 'hd' | 'fhd' | 'qhd' | '4k' | '8k';

export type ScreenSaver = { enabled: boolean; timeout: number };

export type Volume = { muted: boolean; level: number };

export type NetworkType = 'unknown' | 'ethernet' | 'wifi' | 'cellular';

export type PlatformInfo = { name: string; version: string };

export type DeviceInfo = {
	name: string;
	model: string;
	firmware: string;
	screenSize: ScreenSize;
};

export type NetworkInfo = {
	connected: boolean;
	networkType: NetworkType;
	localIp: string;
	macAddress: string;
};

export type DeviceEvents = {
	networkchange: boolean;
	visibilitychange: boolean;
};

export interface Device extends IEventListener<DeviceEvents> {
	readonly driver: string;

	platform(): Promise<PlatformInfo>;
	deviceInfo(): Promise<DeviceInfo>;

	initialize(): Promise<void>;

	readonly canCloseApplication: boolean;
	closeApplication(): void;
	restartApplication(): void;

	getVolume(): Promise<Volume>;
	setVolume(volume: Partial<Volume>): Promise<void>;

	getScreenSaver(): Promise<ScreenSaver>;
	setScreenSaver(screenSaver: Partial<ScreenSaver>): Promise<void>;

	getNetworkInfo(): Promise<NetworkInfo>;
}
