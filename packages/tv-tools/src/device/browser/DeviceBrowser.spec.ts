import { logger } from '../../logger';
import type { Feature } from '../base';
import { Features } from '../mocks';
import { DeviceBrowser } from './DeviceBrowser';

const prefix = '[DeviceBrowser]';

describe('DeviceBrowser', () => {
	const device = new DeviceBrowser();

	it('should carry correct name of the driver', async () => {
		expect(device.driver).toBe('browser');
	});

	it('should return platform info', async () => {
		const platformInfo = await device.platform();
		expect(platformInfo).toEqual({
			name: window.navigator.vendor || 'unknown',
			version: '',
		});
	});

	it('should return device info', async () => {
		const deviceInfo = await device.deviceInfo();
		expect(deviceInfo).toEqual({
			name: window.navigator.platform || 'unknown',
			model: 'unknown',
			firmware: window.navigator.userAgent,
			screenSize: 'unknown',
		});
	});

	it('should initialize', async () => {
		const spyWindow = jest.spyOn(window, 'addEventListener');
		const spyDocument = jest.spyOn(document, 'addEventListener');
		await device.initialize();
		expect(spyWindow).toHaveBeenCalledWith('online', expect.any(Function));
		expect(spyWindow).toHaveBeenCalledWith('offline', expect.any(Function));
		expect(spyDocument).toHaveBeenCalledWith(
			'visibilitychange',
			expect.any(Function),
		);
	});

	it('should return volume', async () => {
		const spy = jest.spyOn(logger, 'warn');
		const volume = await device.getVolume();
		expect(volume).toEqual({
			level: 1,
			muted: false,
		});
		expect(spy).toHaveBeenCalledWith(prefix, 'getVolume not supported');
		spy.mockRestore();
	});

	it('should warn on setVolume', async () => {
		const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
		await device.setVolume({ level: 0.5 });
		expect(spy).toHaveBeenCalledWith(prefix, 'setVolume not supported');
		spy.mockRestore();
	});

	it('should return screen saver', async () => {
		const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
		const screenSaver = await device.getScreenSaver();
		expect(screenSaver).toEqual({
			enabled: false,
			timeout: 0,
		});
		expect(spy).toHaveBeenCalledWith(
			prefix,
			'getScreenSaver not supported',
		);
		spy.mockRestore();
	});

	it('should warn on setScreenSaver', async () => {
		const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
		await device.setScreenSaver({ enabled: true });
		expect(spy).toHaveBeenCalledWith(
			prefix,
			'setScreenSaver not supported',
		);
		spy.mockRestore();
	});

	it('should return network info', async () => {
		const networkInfo = await device.getNetworkInfo();
		expect(networkInfo).toEqual({
			connected: true,
			localIp: '0.0.0.0',
			macAddress: '00:00:00:00:00:00',
			networkType: 'unknown',
		});
	});

	it.each(Features)(
		'should return whether %s isSupported',
		async (feature) => {
			const unsupported: Feature[] = ['volume', 'screensaver'];
			expect(await device.isSupported(feature)).toBe(
				!unsupported.includes(feature),
			);
		},
	);
});
