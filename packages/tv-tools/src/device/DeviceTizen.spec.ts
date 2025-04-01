import { BACK } from '../control';
import { Feature } from './Device';
import { DeviceTizen } from './DeviceTizen';
import {
	AppCommonScreenSaverState,
	NetworkConnectionType,
	NetworkState,
} from './DeviceTizen.types';
import { Features } from './mocks';

const prefix = 'tizen';

const webapis = {
	productinfo: {
		is8kPanelSupported: jest.fn(() => false),
		isUdPanelSupported: jest.fn(() => true),
		getRealModel: jest.fn(() => 'realModel'),
		getModelCode: jest.fn(() => 'modelCode'),
		getFirmware: jest.fn(() => 'firmware'),
	},
	network: {
		listener: null as null | ((state: NetworkState) => void),
		addNetworkStateChangeListener: jest.fn((listener) => {
			webapis.network.listener = listener;
		}),
		getActiveConnectionType: jest.fn(() => NetworkConnectionType.ETHERNET),
		getIp: jest.fn(() => 'localIp'),
		getMac: jest.fn(() => 'macAddress'),
	},
	appCommon: {
		setScreenSaver: jest.fn((_enabled, success) => {
			success();
		}),
	},
};

const currentApplication = {
	hide: jest.fn(),
	exit: jest.fn(),
};

const tizen = {
	application: {
		getCurrentApplication: jest.fn(() => currentApplication),
	},
	tvaudiocontrol: {
		getVolume: jest.fn(() => 100),
		isMute: jest.fn(() => false),
		setVolume: jest.fn(),
		setMute: jest.fn(),
	},
	tvinputdevice: {
		unregisterKey: jest.fn(),
		registerKey: jest.fn(),
		getSupportedKeys: jest.fn(() => []),
	},
};

const tizen18 =
	'Mozilla/5.0 (SMART-TV; LINUX; Tizen 4.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 TV Safari/537.36';
const tizen21 =
	'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) 76.0.3809.146/6.0 TV Safari/537.36';
const tizen22 =
	'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.5) AppleWebKit/537.36 (KHTML, like Gecko) 85.0.4183.93/6.5 TV Safari/537.36';
const tizen24 =
	'Mozilla/5.0 (SMART-TV; LINUX; Tizen 8.0) AppleWebKit/537.36 (KHTML, like Gecko) 108.0.5359.1/8.0 TV Safari/537.36';

const ua = jest
	.spyOn(window.navigator, 'userAgent', 'get')
	.mockReturnValue(tizen24);

describe('DeviceTizen', () => {
	const headSpy = jest
		.spyOn(document.head, 'appendChild')
		.mockImplementation((script) => {
			// @ts-expect-error: mock
			script.onload?.();
			return script;
		});
	const device = new DeviceTizen();

	// @ts-expect-error: mock
	window.webapis = webapis;
	// @ts-expect-error: mock
	window.tizen = tizen;

	it('should have the correct driver', () => {
		expect(device.driver).toBe(prefix);
	});

	it('should return platform info', async () => {
		expect(await device.platform()).toEqual({
			name: 'Tizen',
			version: '8.0',
		});
		ua.mockReturnValueOnce(tizen18);
		const oldDevice = new DeviceTizen();
		expect(await oldDevice.platform()).toEqual({
			name: 'Tizen',
			version: '4.0',
		});
		ua.mockReturnValueOnce('unknown');
		const unknownDevice = new DeviceTizen();
		expect(await unknownDevice.platform()).toEqual({
			name: 'Tizen',
			version: 'unknown',
		});
	});

	it('should return device info', async () => {
		expect(await device.deviceInfo()).toEqual({
			name: 'realModel (modelCode)',
			model: 'realModel',
			firmware: 'firmware',
			screenSize: '4k',
		});
	});

	it('should initialize', async () => {
		const documentSpy = jest.spyOn(document, 'addEventListener');
		await device.initialize();
		expect(documentSpy).toHaveBeenCalledWith(
			'visibilitychange',
			expect.any(Function),
		);
		expect(
			webapis.network.addNetworkStateChangeListener,
		).toHaveBeenCalledWith(expect.any(Function));
		// @ts-expect-error: private
		expect(headSpy.mock.calls[0][0].src).toContain(
			'$WEBAPIS/webapis/webapis.js',
		);
		expect(BACK.is(new KeyboardEvent('keydown', { keyCode: 10009 }))).toBe(
			true,
		);
	});

	it('should return volume', async () => {
		expect(await device.getVolume()).toEqual({
			level: 1,
			muted: false,
		});
	});

	it('should set volume', async () => {
		await device.setVolume({ level: 0.5, muted: true });
		expect(tizen.tvaudiocontrol.setVolume).toHaveBeenCalledWith(50);
		expect(tizen.tvaudiocontrol.setMute).toHaveBeenCalledWith(true);
	});

	it('should return screen saver', async () => {
		expect(await device.getScreenSaver()).toEqual({
			enabled: false,
			timeout: 0,
		});
	});

	it('should set screen saver', async () => {
		await device.setScreenSaver({ enabled: true });
		expect(webapis.appCommon.setScreenSaver).toHaveBeenCalledWith(
			AppCommonScreenSaverState.SCREEN_SAVER_ON,
			expect.any(Function),
			expect.any(Function),
		);
	});

	it('should return network info', async () => {
		webapis.network.listener?.(NetworkState.LAN_CABLE_ATTACHED);
		expect(await device.getNetworkInfo()).toEqual({
			connected: true,
			networkType: 'ethernet',
			localIp: 'localIp',
			macAddress: 'macAddress',
		});
	});

	it('should force close application', () => {
		device.closeApplication({ forceClose: true });
		expect(
			tizen.application.getCurrentApplication().exit,
		).toHaveBeenCalled();
	});

	it('should close application', () => {
		device.closeApplication();
		expect(
			tizen.application.getCurrentApplication().hide,
		).toHaveBeenCalled();
	});

	it.each(Features)(
		'should return whether %s isSupported',
		async (feature) => {
			const unsupported: Feature[] = [
				'volume',
				'multiplayer',
				'playready-cbc',
			];
			if (feature === 'widevine-cbc') {
				ua.mockReturnValueOnce(tizen21);
				const deviceFrom2021 = new DeviceTizen();
				expect(await deviceFrom2021.isSupported(feature)).toBe(false);
				ua.mockReturnValueOnce(tizen22);
				const deviceFrom2022 = new DeviceTizen();
				expect(await deviceFrom2022.isSupported(feature)).toBe(true);
			} else if (feature === '8k') {
				webapis.productinfo.is8kPanelSupported.mockReturnValueOnce(
					true,
				);
				expect(await device.isSupported(feature)).toBe(true);
				webapis.productinfo.is8kPanelSupported.mockReturnValueOnce(
					false,
				);
				expect(await device.isSupported(feature)).toBe(false);
			} else if (feature === '4k') {
				webapis.productinfo.isUdPanelSupported.mockReturnValueOnce(
					true,
				);
				expect(await device.isSupported(feature)).toBe(true);
				webapis.productinfo.isUdPanelSupported.mockReturnValueOnce(
					false,
				);
				expect(await device.isSupported(feature)).toBe(false);
			} else {
				expect(await device.isSupported(feature)).toBe(
					!unsupported.includes(feature),
				);
			}
		},
	);
});
