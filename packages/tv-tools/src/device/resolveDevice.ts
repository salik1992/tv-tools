import type { Device } from './base';
import { DeviceBrowser } from './browser';
import { DeviceTizen } from './tizen';
import { DeviceWebos } from './webos';

export const resolveDevice = (): Device => {
	if (/Tizen/.test(navigator.userAgent)) {
		return new DeviceTizen();
	}
	if (/Web0S/.test(navigator.userAgent)) {
		return new DeviceWebos();
	}
	return new DeviceBrowser();
};
