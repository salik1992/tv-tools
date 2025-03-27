import { ns } from '../logger';
import type {
	DeviceInfo,
	NetworkInfo,
	PlatformInfo,
	ScreenSaver,
	Volume,
} from './Device';
import { DeviceBase } from './DeviceBase';

const logger = ns('[DeviceBrowser]');

export class DeviceBrowser extends DeviceBase {
	driver = 'browser';

	public async platform(): Promise<PlatformInfo> {
		return {
			name: window.navigator.vendor || 'unknown',
			version: '',
		};
	}

	public async deviceInfo(): Promise<DeviceInfo> {
		return {
			name: window.navigator.platform || 'unknown',
			model: 'unknown',
			firmware: window.navigator.userAgent,
			screenSize: 'unknown',
		};
	}

	public async initialize(): Promise<void> {
		window.addEventListener('online', this.onOnLine);
		window.addEventListener('offline', this.onOffLine);
		document.addEventListener('visibilitychange', this.onVisibilityChange);
	}

	public async getVolume(): Promise<Volume> {
		logger.warn('getVolume not supported');
		return {
			level: 1,
			muted: false,
		};
	}

	public async setVolume(_volume: Partial<Volume>): Promise<void> {
		logger.warn('setVolume not supported');
	}

	public async getScreenSaver(): Promise<ScreenSaver> {
		logger.warn('getScreenSaver not supported');
		return {
			enabled: false,
			timeout: 0,
		};
	}

	public async setScreenSaver(
		_screenSaver: Partial<ScreenSaver>,
	): Promise<void> {
		logger.warn('setScreenSaver not supported');
	}

	public async getNetworkInfo(): Promise<NetworkInfo> {
		return {
			connected: window.navigator.onLine,
			networkType: 'unknown',
			localIp: '0.0.0.0',
			macAddress: '00:00:00:00:00:00',
		};
	}

	private onOnLine = () => {
		this.eventListener.triggerEvent('networkchange', true);
	};

	private onOffLine = () => {
		this.eventListener.triggerEvent('networkchange', false);
	};

	private onVisibilityChange = () => {
		this.eventListener.triggerEvent(
			'visibilitychange',
			document.visibilityState === 'visible',
		);
	};
}
