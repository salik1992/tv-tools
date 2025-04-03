import type { Device } from './base';
import { DeviceTizen } from './tizen';

export * from './base/Device';

export const device: Device = new DeviceTizen();
