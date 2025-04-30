import { ns } from '../../logger';
import { EventListener } from '../../utils/EventListener';
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

	public abstract driver: string;

	public abstract platform(): Promise<PlatformInfo>;

	public abstract deviceInfo(): Promise<DeviceInfo>;

	public abstract initialize(): Promise<void>;

	public readonly canCloseApplication: boolean = false;

	public closeApplication(): void {
		logger.warn('closeApplication not supported');
	}

	public restartApplication(): void {
		window.location.reload();
	}

	public abstract getVolume(): Promise<Volume>;
	public abstract setVolume(volume: Partial<Volume>): Promise<void>;

	public abstract getScreenSaver(): Promise<ScreenSaver>;
	public abstract setScreenSaver(
		screenSaver: Partial<ScreenSaver>,
	): Promise<void>;

	public abstract getNetworkInfo(): Promise<NetworkInfo>;

	public abstract isSupported(feature: Feature): Promise<boolean>;
}
