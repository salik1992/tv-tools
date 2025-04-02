import type { Device } from './base';
import { DeviceWebos } from './webos';

export * from './base/Device';

export const device: Device = new DeviceWebos();
