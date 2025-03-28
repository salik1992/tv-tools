import type { Device } from './Device';
import { DeviceBrowser } from './DeviceBrowser';
import { DeviceTizen } from './DeviceTizen';
import { DeviceWebos } from './DeviceWebos';

export * from './Device';

const resolveDevice = (): Device => {
	if (/Tizen/.test(navigator.userAgent)) {
		return new DeviceTizen();
	}
	if (/Web0S/.test(navigator.userAgent)) {
		return new DeviceWebos();
	}
	return new DeviceBrowser();
};

export const device = resolveDevice();
