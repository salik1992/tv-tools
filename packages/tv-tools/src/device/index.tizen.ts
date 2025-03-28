import type { Device } from './Device';
import { DeviceTizen } from './DeviceTizen';

export * from './Device';

export const device: Device = new DeviceTizen();
