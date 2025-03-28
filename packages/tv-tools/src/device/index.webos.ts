import type { Device } from './Device';
import { DeviceWebos } from './DeviceWebos';

export * from './Device';

export const device: Device = new DeviceWebos();
