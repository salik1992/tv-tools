import * as Key from '../control';
import { ns } from '../logger';
import type {
	DeviceInfo,
	Feature,
	NetworkInfo,
	NetworkType,
	PlatformInfo,
	ScreenSaver,
	ScreenSize,
	Volume,
} from './Device';
import { DeviceBase } from './DeviceBase';
import {
	AppCommonScreenSaverState,
	NetworkConnectionType,
	NetworkState,
	type Tizen,
	type Webapis,
} from './DeviceTizen.types';

declare const webapis: Webapis;
declare const tizen: Tizen;

const logger = ns('[DeviceTizen]');

const webapisSrc = '$WEBAPIS/webapis/webapis.js';

const keysToUnregister = ['VolumeUp', 'VolumeDown', 'VolumeMute'] as const;

const keysToRegister = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'ColorF0Red',
	'ColorF1Green',
	'ColorF2Yellow',
	'ColorF3Blue',
	'MediaPlay',
	'MediaPause',
	'MediaPlayPause',
	'MediaStop',
	'MediaRewind',
	'MediaFastForward',
	'MediaRecord',
	'ChannelUp',
	'ChannelDown',
	'PreviousChannel',
	'ChannelList',
	'Info',
	'Guide',
] as const;

export class DeviceTizen extends DeviceBase {
	override readonly driver = 'tizen';

	private scriptsInjected: Promise<void>;

	private screenSaverEnabled = false;

	private networkState: NetworkState = NetworkState.WIFI_UNKNOWN;

	constructor() {
		super();
		this.scriptsInjected = this.injectPlatformScripts();
	}

	private platformInfo: PlatformInfo = {
		name: 'Tizen',
		version:
			window.navigator.userAgent.match(/Tizen ([.\d]*)/)?.[1] ??
			'unknown',
	};

	public override async platform(): Promise<PlatformInfo> {
		return this.platformInfo;
	}

	private screenSize: ScreenSize | null = null;
	private getScreenSize(): ScreenSize {
		if (!this.screenSize) {
			if (webapis.productinfo.is8kPanelSupported()) {
				this.screenSize = '8k';
			} else if (webapis.productinfo.isUdPanelSupported()) {
				this.screenSize = '4k';
			} else if (window.innerWidth === 1920) {
				this.screenSize = 'fhd';
			} else {
				this.screenSize = 'hd';
			}
		}
		return this.screenSize;
	}

	public override async deviceInfo(): Promise<DeviceInfo> {
		return {
			name: `${webapis.productinfo.getRealModel()} (${webapis.productinfo.getModelCode()})`,
			model: webapis.productinfo.getRealModel(),
			firmware: webapis.productinfo.getFirmware(),
			screenSize: this.getScreenSize(),
		};
	}

	public override async initialize(): Promise<void> {
		await this.scriptsInjected;
		document.addEventListener('visibilitychange', this.onVisibilityChange);
		webapis.network.addNetworkStateChangeListener(
			this.onNetworkStateChange,
		);
		this.initializeKeys();
	}

	public override async getVolume(): Promise<Volume> {
		return {
			level: tizen.tvaudiocontrol.getVolume() / 100,
			muted: tizen.tvaudiocontrol.isMute(),
		};
	}

	public override async setVolume({ level, muted }: Partial<Volume>) {
		if (level !== undefined) {
			tizen.tvaudiocontrol.setVolume(level * 100);
		}
		if (muted !== undefined) {
			tizen.tvaudiocontrol.setMute(muted);
		}
	}

	public override async getScreenSaver() {
		return {
			enabled: this.screenSaverEnabled,
			timeout: -1,
		};
	}

	public override async setScreenSaver({ enabled }: Partial<ScreenSaver>) {
		return new Promise<void>((resolve) => {
			if (enabled !== undefined) {
				this.screenSaverEnabled = enabled;
				webapis.appCommon.setScreenSaver(
					enabled
						? AppCommonScreenSaverState.SCREEN_SAVER_ON
						: AppCommonScreenSaverState.SCREEN_SAVER_OFF,
					resolve,
					() => {
						logger.error('Failed to set screen saver');
						resolve();
					},
				);
			}
		});
	}

	public override async getNetworkInfo(): Promise<NetworkInfo> {
		return {
			connected: this.isNetworkConnected(this.networkState),
			networkType: this.getNetworkType(
				webapis.network.getActiveConnectionType(),
			),
			localIp: webapis.network.getIp(),
			macAddress: webapis.network.getMac(),
		};
	}

	public override closeApplication({ forceClose = false } = {}) {
		if (forceClose) {
			tizen.application.getCurrentApplication().exit();
		} else {
			tizen.application.getCurrentApplication().hide();
		}
	}

	public override async isSupported(feature: Feature): Promise<boolean> {
		switch (feature) {
			case 'volume':
			case 'multiplayer':
				return false;
			case 'screensaver':
				return true;
			case 'widevine-ctr':
			case 'playready-ctr':
			case 'fairplay':
				return true;
			case 'widevine-cbc':
				return parseFloat(this.platformInfo.version) >= 6.5;
			case 'playready-cbc':
				return false;
			case '8k':
				return webapis.productinfo.is8kPanelSupported();
			case '4k':
				return webapis.productinfo.isUdPanelSupported();
			default:
				return false;
		}
	}

	private injectPlatformScripts(): Promise<void> {
		if (typeof webapis !== 'undefined') {
			return Promise.resolve();
		}
		const includedScript = Array.from(
			document.head.querySelectorAll('script'),
		).find(({ src }) => src === webapisSrc);
		if (includedScript) {
			return new Promise<void>((resolve) => {
				includedScript.onload = () => {
					resolve();
				};
			});
		}
		return new Promise<void>((resolve) => {
			const webapisScript = document.createElement('script');
			webapisScript.src = webapisSrc;
			webapisScript.type = 'text/javascript';
			webapisScript.onload = () => {
				resolve();
			};
			document.head.appendChild(webapisScript);
		});
	}

	private onVisibilityChange = () => {
		this.eventListener.triggerEvent(
			'visibilitychange',
			document.visibilityState === 'visible',
		);
	};

	private onNetworkStateChange = (state: NetworkState) => {
		this.networkState = state;
		this.eventListener.triggerEvent(
			'networkchange',
			this.isNetworkConnected(state),
		);
	};

	private isNetworkConnected(state: NetworkState): boolean {
		switch (state) {
			case NetworkState.GATEWAY_CONNECTED:
			case NetworkState.WIFI_CONNECTED:
			case NetworkState.LAN_CABLE_ATTACHED:
				return true;
			default:
				return false;
		}
	}

	private getNetworkType(type: NetworkConnectionType): NetworkType {
		switch (type) {
			case NetworkConnectionType.WIFI:
				return 'wifi';
			case NetworkConnectionType.ETHERNET:
				return 'ethernet';
			case NetworkConnectionType.CELLULAR:
				return 'cellular';
			default:
				return 'unknown';
		}
	}

	private initializeKeys() {
		keysToUnregister.forEach((key) => {
			tizen.tvinputdevice.unregisterKey(key);
		});
		keysToRegister.forEach((key) => {
			tizen.tvinputdevice.registerKey(key);
		});
		const supportedKeys = tizen.tvinputdevice.getSupportedKeys();
		const keyCodeMap = supportedKeys.reduce(
			(acc, key) => ({
				...acc,
				[key.name]: key.code,
			}),
			{} as Record<string, number>,
		);
		Key.updateKey(Key.BACK, { keyCodes: [10009] });
		Key.updateKey(Key.NUMBER_0, { keyCodes: [keyCodeMap['0']] });
		Key.updateKey(Key.NUMBER_1, { keyCodes: [keyCodeMap['1']] });
		Key.updateKey(Key.NUMBER_2, { keyCodes: [keyCodeMap['2']] });
		Key.updateKey(Key.NUMBER_3, { keyCodes: [keyCodeMap['3']] });
		Key.updateKey(Key.NUMBER_4, { keyCodes: [keyCodeMap['4']] });
		Key.updateKey(Key.NUMBER_5, { keyCodes: [keyCodeMap['5']] });
		Key.updateKey(Key.NUMBER_6, { keyCodes: [keyCodeMap['6']] });
		Key.updateKey(Key.NUMBER_7, { keyCodes: [keyCodeMap['7']] });
		Key.updateKey(Key.NUMBER_8, { keyCodes: [keyCodeMap['8']] });
		Key.updateKey(Key.NUMBER_9, { keyCodes: [keyCodeMap['9']] });
		Key.updateKey(Key.RED, { keyCodes: [keyCodeMap.ColorF0Red] });
		Key.updateKey(Key.GREEN, { keyCodes: [keyCodeMap.ColorF1Green] });
		Key.updateKey(Key.YELLOW, { keyCodes: [keyCodeMap.ColorF2Yellow] });
		Key.updateKey(Key.BLUE, { keyCodes: [keyCodeMap.ColorF3Blue] });
		Key.updateKey(Key.PLAY, { keyCodes: [keyCodeMap.MediaPlay] });
		Key.updateKey(Key.PAUSE, { keyCodes: [keyCodeMap.MediaPause] });
		Key.updateKey(Key.PLAY_PAUSE, {
			keyCodes: [keyCodeMap.MediaPlayPause],
		});
		Key.updateKey(Key.STOP, { keyCodes: [keyCodeMap.MediaStop] });
		Key.updateKey(Key.REWIND, { keyCodes: [keyCodeMap.MediaRewind] });
		Key.updateKey(Key.FAST_FORWARD, {
			keyCodes: [keyCodeMap.MediaFastForward],
		});
		Key.updateKey(Key.CHANNEL_UP, { keyCodes: [keyCodeMap.ChannelUp] });
		Key.updateKey(Key.CHANNEL_DOWN, { keyCodes: [keyCodeMap.ChannelDown] });
		Key.updateKey(Key.EXIT, { keyCodes: [keyCodeMap.Exit] });
	}
}
