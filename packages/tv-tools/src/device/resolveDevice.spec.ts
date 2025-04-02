import { DeviceBrowser } from './browser';
import { resolveDevice } from './resolveDevice';
import { DeviceTizen } from './tizen';
import { DeviceWebos } from './webos';

describe('resolveDevice', () => {
	it.each([
		[
			'Mozilla/5.0 (SMART-TV; LINUX; Tizen 8.0) AppleWebKit/537.36 (KHTML, like Gecko) 108.0.5359.1/8.0 TV Safari/537.36',
			DeviceTizen,
		],
		[
			'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.270 Safari/537.36 WebAppManager',
			DeviceWebos,
		],
		[
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
			DeviceBrowser,
		],
	])('should return correct device for userAgent %s', (ua, device) => {
		jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(ua);
		expect(resolveDevice()).toBeInstanceOf(device);
	});
});
