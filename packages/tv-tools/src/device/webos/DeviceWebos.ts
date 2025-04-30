import { BACK, INPUT_DONE, updateKey } from '../../control';
import { ns } from '../../logger';
import { noop } from '../../utils/noop';
import type {
	Feature,
	NetworkInfo,
	NetworkType,
	ScreenSaver,
	ScreenSize,
	Volume,
} from '../base';
import { DeviceBase } from '../base';
import { initializeWebosTvJs } from './lib';
import {
	type ConnectionManagerResponse,
	type DeviceInfo,
	type PalmSystem as IPalmSystem,
	type KeyboardStateChangeEvent,
	RequestUrls,
	type WebOS,
} from './types';

const logger = ns('[DeviceWebos]');

declare const webOS: WebOS;
declare const PalmSystem: IPalmSystem;
declare global {
	interface DocumentEventMap {
		keyboardStateChange: KeyboardStateChangeEvent;
	}
}

const CONNECTED = 'connected';
const UNKNOWN_IP = '0.0.0.0';
const UNKNONW_CONNECTION_MANAGER_RESPONSE: ConnectionManagerResponse = {
	returnValue: true,
	isInternetConnectionAvailable: false,
	wired: { state: 'disconnected' },
	wifi: { state: 'disconnected' },
	wifiDirect: { state: 'disconnected' },
};

export class DeviceWebos extends DeviceBase {
	override readonly driver = 'webos';

	protected deviceInfoResolver: (value: DeviceInfo) => void = noop;
	protected deviceInfoPromise: Promise<DeviceInfo> = new Promise<DeviceInfo>(
		(resolve) => {
			this.deviceInfoResolver = resolve;
		},
	);

	public override async platform() {
		const deviceInfo = await this.deviceInfoPromise;
		return {
			name: 'WebOS',
			version: deviceInfo.version ?? 'unknown',
		};
	}

	protected async getScreenSize(): Promise<ScreenSize> {
		const deviceInfo = await this.deviceInfoPromise;
		if (deviceInfo.uhd8k) {
			return '8k';
		}
		if (deviceInfo.uhd) {
			return '4k';
		}
		return 'fhd';
	}

	public override async deviceInfo() {
		const deviceInfo = await this.deviceInfoPromise;
		return {
			name: `LG WebOS ${deviceInfo.modelName} ${deviceInfo.version}`,
			model: deviceInfo.modelName ?? 'unknown',
			firmware: deviceInfo.version ?? 'unknown',
			screenSize: await this.getScreenSize(),
		};
	}

	public override async initialize() {
		initializeWebosTvJs();
		webOS.deviceInfo((deviceInfo) => {
			this.deviceInfoResolver(deviceInfo);
		});
		document.addEventListener('visibilitychange', this.onVisibilityChange);
		document.addEventListener(
			'keyboardStateChange',
			this.onKeyboadStateChange,
		);
		updateKey(BACK, { keyCodes: [461] });
		await this.deviceInfoPromise;
	}

	public override async getVolume(): Promise<Volume> {
		logger.warn('getVolume not supported');
		return {
			level: 1,
			muted: false,
		};
	}

	public override async setVolume(_volume: Partial<Volume>) {
		logger.warn('setVolume not supported');
	}

	public override async getScreenSaver(): Promise<ScreenSaver> {
		logger.warn('getScreenSaver not supported');
		return {
			enabled: false,
			timeout: 0,
		};
	}

	public override async setScreenSaver(_screenSaver: Partial<ScreenSaver>) {
		logger.warn('setScreenSaver not supported');
	}

	public override async getNetworkInfo(): Promise<NetworkInfo> {
		const manager = await this.getConnectionManager();
		return {
			connected: manager.isInternetConnectionAvailable,
			networkType: this.getConnectionType(manager),
			localIp: this.getLocalIp(manager),
			macAddress: 'unknown',
		};
	}

	public override readonly canCloseApplication = true;

	public override closeApplication(): void {
		PalmSystem.deactivate();
	}

	public override async isSupported(feature: Feature): Promise<boolean> {
		switch (feature) {
			case 'volume':
			case 'multiplayer':
			case 'screensaver':
				return false;
			case 'widevine-ctr':
			case 'widevine-cbc':
			case 'playready-ctr':
			case 'playready-cbc':
				return true;
			case 'fairplay':
				return false;
			case '8k':
				return (await this.deviceInfo()).screenSize === '8k';
			case '4k':
				return ['4k', '8k'].includes(
					(await this.deviceInfo()).screenSize,
				);
			default:
				return false;
		}
	}

	protected isPalmSystem() {
		const weboOS1 = /(Web0S|537.41).+(Web0S|537.41)/;
		const weboOS2 = /(Web0S|538.2).+(Web0S|538.2)/;
		return (
			weboOS1.test(navigator.userAgent) ||
			weboOS2.test(navigator.userAgent)
		);
	}

	protected async getConnectionManager(): Promise<ConnectionManagerResponse> {
		const url = this.isPalmSystem()
			? RequestUrls.CONNECTION_MANAGER_PALM
			: RequestUrls.CONNECTION_MANAGER;
		return new Promise<ConnectionManagerResponse>((resolve) => {
			webOS.service.request(url, {
				method: 'getStatus',
				parameters: { subscribe: true },
				onSuccess: (response) => {
					if (response.returnValue) {
						resolve(response);
					}
					resolve(UNKNONW_CONNECTION_MANAGER_RESPONSE);
				},
				onFailure: () => resolve(UNKNONW_CONNECTION_MANAGER_RESPONSE),
			});
		});
	}

	protected getConnectionType(
		manager: ConnectionManagerResponse,
	): NetworkType {
		switch (CONNECTED) {
			case manager.wired.state:
				return 'ethernet';
			case manager.wifi.state:
				return 'wifi';
			case manager.wifiDirect.state:
				return 'wifi';
			default:
				return 'unknown';
		}
	}

	protected getLocalIp(manager: ConnectionManagerResponse): string {
		switch (CONNECTED) {
			case manager.wired.state:
				return manager.wired.ipAddress ?? UNKNOWN_IP;
			case manager.wifi.state:
				return manager.wifi.ipAddress ?? UNKNOWN_IP;
			case manager.wifiDirect.state:
				return manager.wifiDirect.ipAddress ?? UNKNOWN_IP;
			default:
				return UNKNOWN_IP;
		}
	}

	protected onVisibilityChange = () => {
		this.eventListener.triggerEvent(
			'visibilitychange',
			document.visibilityState === 'visible',
		);
	};

	protected onKeyboadStateChange = (event: KeyboardStateChangeEvent) => {
		if (
			!event.detail?.visibility &&
			document.activeElement?.tagName === 'INPUT'
		) {
			(document.activeElement as HTMLInputElement).dispatchEvent(
				INPUT_DONE.toKeyboardEvent('keyup'),
			);
		}
	};
}
