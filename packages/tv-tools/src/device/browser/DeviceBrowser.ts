import { ns } from '../../logger';
import type {
	DeviceInfo,
	Feature,
	NetworkInfo,
	PlatformInfo,
	ScreenSaver,
	Volume,
} from '../base';
import { DeviceBase } from '../base';

const logger = ns('[DeviceBrowser]');

export class DeviceBrowser extends DeviceBase {
	override driver = 'browser';

	public override async platform(): Promise<PlatformInfo> {
		return {
			name: window.navigator.vendor || 'unknown',
			version: '',
		};
	}

	public override async deviceInfo(): Promise<DeviceInfo> {
		return {
			name: window.navigator.platform || 'unknown',
			model: 'unknown',
			firmware: window.navigator.userAgent,
			screenSize: 'unknown',
		};
	}

	public override async initialize(): Promise<void> {
		window.addEventListener('online', this.onOnLine);
		window.addEventListener('offline', this.onOffLine);
		document.addEventListener('visibilitychange', this.onVisibilityChange);
	}

	public override async getVolume(): Promise<Volume> {
		logger.warn('getVolume not supported');
		return {
			level: 1,
			muted: false,
		};
	}

	public override async setVolume(_volume: Partial<Volume>): Promise<void> {
		logger.warn('setVolume not supported');
	}

	public override async getScreenSaver(): Promise<ScreenSaver> {
		logger.warn('getScreenSaver not supported');
		return {
			enabled: false,
			timeout: 0,
		};
	}

	public override async setScreenSaver(
		_screenSaver: Partial<ScreenSaver>,
	): Promise<void> {
		logger.warn('setScreenSaver not supported');
	}

	public override async getNetworkInfo(): Promise<NetworkInfo> {
		return {
			connected: window.navigator.onLine,
			networkType: 'unknown',
			localIp: '0.0.0.0',
			macAddress: '00:00:00:00:00:00',
		};
	}

	public override async isSupported(feature: Feature): Promise<boolean> {
		switch (feature) {
			case 'volume':
			case 'screensaver':
				return false;
			default:
				return true;
		}
	}

	protected onOnLine = () => {
		this.eventListener.triggerEvent('networkchange', true);
	};

	protected onOffLine = () => {
		this.eventListener.triggerEvent('networkchange', false);
	};

	protected onVisibilityChange = () => {
		this.eventListener.triggerEvent(
			'visibilitychange',
			document.visibilityState === 'visible',
		);
	};
}
