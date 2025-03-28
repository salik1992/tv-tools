import { ns } from '../logger';
import { EventListener } from '../utils/EventListener';
import type {
	Device,
	DeviceEvents,
	DeviceInfo,
	Feature,
	NetworkInfo,
	PlatformInfo,
	ScreenSaver,
	Volume,
} from './Device';

const logger = ns('[DeviceBase]');

export abstract class DeviceBase implements Device {
	protected eventListener = new EventListener<DeviceEvents>();

	public addEventListener = this.eventListener.addEventListener;
	public removeEventListener = this.eventListener.removeEventListener;

	abstract driver: string;

	abstract platform(): Promise<PlatformInfo>;

	abstract deviceInfo(): Promise<DeviceInfo>;

	abstract initialize(): Promise<void>;

	public readonly canCloseApplication = false;

	public closeApplication(): void {
		logger.warn('closeApplication not supported');
	}

	public restartApplication(): void {
		window.location.reload();
	}

	abstract getVolume(): Promise<Volume>;
	abstract setVolume(volume: Partial<Volume>): Promise<void>;

	abstract getScreenSaver(): Promise<ScreenSaver>;
	abstract setScreenSaver(screenSaver: Partial<ScreenSaver>): Promise<void>;

	abstract getNetworkInfo(): Promise<NetworkInfo>;

	abstract isSupported(feature: Feature): Promise<boolean>;
}
