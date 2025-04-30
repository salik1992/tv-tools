import { BACK } from '../../control';
import { logger } from '../../logger';
import type { Feature } from '../base';
import { Features } from '../mocks';
import { DeviceWebos } from './DeviceWebos';
import type { DeviceInfo } from './types';

const prefix = '[DeviceWebos]';

jest.mock('./lib', () => ({
	initializeWebosTvJs: jest.fn(() => {
		// @ts-expect-error: mock
		window.webOS = {
			deviceInfo: (callback: (deviceInfo: DeviceInfo) => void) => {
				callback({
					modelName: 'modelName',
					version: '4.0',
					uhd: true,
					uhd8k: false,
				});
			},
			service: {
				request: (
					url: string,
					options: {
						method: string;
						parameters: Record<string, unknown>;
						onSuccess: (response: unknown) => void;
						onFailure: () => void;
					},
				) => {
					switch (url) {
						case 'luna://com.webos.service.connectionmanager':
							options.onSuccess({
								returnValue: true,
								isInternetConnectionAvailable: true,
								wired: { state: 'connected' },
								wifi: { state: 'disconnected' },
								wifiDirect: { state: 'disconnected' },
							});
							break;
					}
				},
			},
		};
		// @ts-expect-error: mock
		window.PalmSystem = {
			deactivate: jest.fn(),
		};
	}),
}));

describe('DeviceWebos', () => {
	const device = new DeviceWebos();

	it('should have the correct driver', () => {
		expect(device.driver).toBe('webos');
	});

	it('should initialize', async () => {
		const documentSpy = jest.spyOn(document, 'addEventListener');
		await device.initialize();
		expect(documentSpy).toHaveBeenCalledWith(
			'visibilitychange',
			expect.any(Function),
		);
		expect(BACK.is(new KeyboardEvent('keydown', { keyCode: 461 }))).toBe(
			true,
		);
	});

	it('should return platform info', async () => {
		expect(await device.platform()).toEqual({
			name: 'WebOS',
			version: '4.0',
		});
	});

	it('should return device info', async () => {
		expect(await device.deviceInfo()).toEqual({
			name: 'LG WebOS modelName 4.0',
			model: 'modelName',
			firmware: '4.0',
			screenSize: '4k',
		});
	});

	it('should get volume', async () => {
		expect(await device.getVolume()).toEqual({
			level: 1,
			muted: false,
		});
	});

	it('should set volume', async () => {
		const spy = jest.spyOn(logger, 'warn');
		await device.setVolume({ level: 0.5 });
		expect(spy).toHaveBeenCalledWith(prefix, 'setVolume not supported');
	});

	it('should get screen saver', async () => {
		const screenSaver = await device.getScreenSaver();
		expect(screenSaver).toEqual({
			enabled: false,
			timeout: 0,
		});
	});

	it('should set screen saver', async () => {
		const spy = jest.spyOn(logger, 'warn');
		await device.setScreenSaver({ enabled: true });
		expect(spy).toHaveBeenCalledWith(
			prefix,
			'setScreenSaver not supported',
		);
	});

	it('should return network info', async () => {
		expect(await device.getNetworkInfo()).toEqual({
			connected: true,
			networkType: 'ethernet',
			localIp: '0.0.0.0',
			macAddress: 'unknown',
		});
	});

	it('should close application', () => {
		device.closeApplication();
		// @ts-expect-error: mock
		expect(window.PalmSystem.deactivate).toHaveBeenCalled();
	});

	it.each(Features)(
		'should return whether %s isSupported',
		async (feature) => {
			const unsupported: Feature[] = [
				'volume',
				'screensaver',
				'multiplayer',
				'fairplay',
				'8k',
			];
			expect(await device.isSupported(feature)).toBe(
				!unsupported.includes(feature),
			);
		},
	);
});
