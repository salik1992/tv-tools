export enum ProductInfoConfigKey {
	DATA_SERVICE = 0,
	SERVICE_COUNTRY = 1,
}

export enum ProductInfoNoGlass3dSupport {
	NOT_SUPPORTED = 0,
	SUPPORTED = 1,
}

export enum ProductInfoSiServerType {
	OPERATING = 0,
	DEVELOPMENT = 1,
	DEVELOPING = 2,
}

export interface ProductInfo {
	ProductInfoConfigKey: ProductInfoConfigKey;
	ProductInfoNoGlass3dSupport: ProductInfoNoGlass3dSupport;
	ProductInfoSiServerType: ProductInfoSiServerType;
	getVersion(): string;
	getFirmware(): string;
	getDuid(): string;
	getModel(): string;
	getModelCode(): string;
	getSmartTVServerType(): ProductInfoSiServerType;
	getSmartTVServerVersion(): string;
	getTunerEpop(): string;
	isSoccerModeEnabled(): boolean;
	isTtvSupported(): boolean;
	isUdPanelSupported(): boolean;
	is8kPanelSupported(): boolean;
	getRealModel(): string;
	getNoGlass3dSupport(): ProductInfoNoGlass3dSupport;
	getLocalSet(): string;
	getSystemConfig(key: ProductInfoConfigKey): string;
	setSystemConfig(
		key: ProductInfoConfigKey,
		value: string,
		onSuccess: () => void,
		onError: () => void,
	): void;
	addSystemConfigChangeListener(
		key: ProductInfoConfigKey,
		listener: (value: string) => void,
	): number;
	removeSystemConfigChangeListener(listenerId: number): void;
	isUHDAModel(): boolean;
}

export enum NetworkConnectionType {
	DISCONNECTED = 0,
	WIFI = 1,
	CELLULAR = 2,
	ETHERNET = 3,
}

export enum NetworkIpMode {
	NONE = 0,
	STATIC = 1,
	DYNAMIC = 2,
	AUTO = 3,
	FIXED = 4,
	UNKNOWN = 5,
}

export enum NetworkState {
	LAN_CABLE_ATTACHED = 1,
	LAN_CABLE_DETACHED = 2,
	LAN_CABLE_UNKNOWN = 3,
	GATEWAY_CONNECTED = 4,
	GATEWAY_DISCONNECTED = 5,
	WIFI_CONNECTED = 6,
	WIFI_DISCONNECTED = 7,
	WIFI_UNKNOWN = 8,
}

export enum NetworkWifiSecurityMode {
	WEP = 1,
	WPA_PSK = 2,
	WPA2_PSK = 3,
	EAP = 4,
	NONE = 5,
	UNKNOWN = 6,
}

export enum NetworkWifiEncryptionType {
	WEP = 1,
	TKIP = 2,
	AES = 3,
	TKIP_AES_MIXED = 4,
	NONE = 5,
	UNKNOWN = 6,
}

interface Network {
	NetworkConnectionType: NetworkConnectionType;
	NetworkIpMode: NetworkIpMode;
	NetworkState: NetworkState;
	NetworkWifiSecurityMode: NetworkWifiSecurityMode;
	NetworkWifiEncryptionType: NetworkWifiEncryptionType;
	getVersion(): string;
	isConnectedToGateway(): boolean;
	getIpMode(): NetworkIpMode;
	getSubnetMask(): string;
	getGateway(): string;
	getMac(): string;
	getDns(): string;
	getIp(): string;
	getActiveConnectionType(): NetworkConnectionType;
	addNetworkStateChangeListener(
		listener: (state: NetworkState) => void,
	): number;
	removeNetworkStateChangeListener(listenerId: number): void;
	getWiFiSsid(): string;
	getWiFiSignalStrengthLevel(): number;
	getWiFiSecurityMode(): NetworkWifiSecurityMode;
	getWiFiEncryptionType(): NetworkWifiEncryptionType;
	getSecondaryDns(): string;
	setDhcpOption60Field(vendorName: string): void;
	removeDhcpOption60Field(): void;
	getCurrentDhcpOption60Field(): string;
	checkCurrentIpWith60Field(): string;
}

export enum AppCommonScreenSaverState {
	SCREEN_SAVER_ON = 0,
	SCREEN_SAVER_OFF = 1,
}

interface AppCommon {
	getVersion(): string;
	getDuid(): string;
	setScreenSaver(
		state: AppCommonScreenSaverState,
		onSuccess?: () => void,
		onError?: () => void,
	): void;
}

export interface Webapis {
	productinfo: ProductInfo;
	network: Network;
	appCommon: AppCommon;
}

interface ApplicationControlData {
	key: string;
	value: string[];
}

interface ApplicationControlRequest {
	appControl: {
		operation: string;
		uri?: string;
		mime?: string;
		category?: string;
		data?: ApplicationControlData[];
		launchMode?: 'SINGLE' | 'GROUP';
	};
	callerAppId: string;
	replyResult(data: ApplicationControlData[]): void;
	replyFailure(): void;
}

interface TizenApplication {
	appInfo: {
		id: string;
		name: string;
		iconPath: string;
		version: string;
		show: boolean;
		categories: string[];
		installDate: Date;
		size: number;
		packageId: string;
	};
	contextId: string;
	exit(): void;
	hide(): void;
	getRequestedAppControl(): ApplicationControlRequest;
	addEventListener(eventName: string, listener: () => void): number;
	removeEventListener(listenerId: number): void;
	broadcastEvent(eventName: string, data: object): void;
	broadcastTrustedEvent(eventName: string, data: object): void;
}

export type AudioOutputMode = 'PCM' | 'DOLBY' | 'DTS' | 'AAC';

export type AudioBeepType =
	| 'UP'
	| 'DOWN'
	| 'LEFT'
	| 'RIGHT'
	| 'PAGE_LEFT'
	| 'PAGE_RIGHT'
	| 'BACK'
	| 'SELECT'
	| 'CANCEL'
	| 'KEYPAD'
	| 'KEYPAD_ENTER'
	| 'KEYPAD_DEL'
	| 'MOVE'
	| 'PREPARING';

interface TVAudioControl {
	setMute(mute: boolean): void;
	isMute(): boolean;
	setVolume(volume: number): void;
	getVolume(): number;
	setVolumeUp(): void;
	setVolumeDown(): void;
	setVolumeChangeListener(listener: (volume: number) => void): void;
	unsetVolumeChangeListener(): void;
	getOutputMode(): AudioOutputMode;
	playSound(beep: AudioBeepType): void;
}

interface InputDeviceKey {
	name: string;
	code: number;
}

interface TVInputDevice {
	getSupportedKeys(): InputDeviceKey[];
	getKey(keyName: string): InputDeviceKey | null;
	registerKey(keyName: string): void;
	unregisterKey(keyName: string): void;
}

type SystemInfoProfile =
	| 'MOBILE_FULL'
	| 'MOBILE_WEB'
	| 'MOBILE'
	| 'WEARABLE_FULL'
	| 'TV';

interface SystemInfoDeviceCapabilities {
	bluetooth: boolean;
	nfc: boolean;
	nfcReservedPush: boolean;
	multiTouchCount: number;
	inputKeyboard: boolean;
	inputKeyboardLayout: boolean;
	wifi: boolean;
	wifiDirect: boolean;
	opengles: boolean;
	openglestextureFormat: string;
	openglesVersion1_1: boolean;
	openglesVersion2_0: boolean;
	fmRadio: boolean;
	platformVersion: string;
	camera: boolean;
	cameraFront: boolean;
	cameraFrontFlash: boolean;
	cameraBack: boolean;
	cameraBackFlash: boolean;
	location: boolean;
	locationGps: boolean;
	locationWps: boolean;
	microphone: boolean;
	usbHost: boolean;
	usbAccessory: boolean;
	screenOutputRca: boolean;
	screenOutputHdmi: boolean;
	platformCoreCpuArch: string;
	platformCoreFpuArch: string;
	sipVoip: boolean;
	duid: string;
	speechRecognition: boolean;
	speechSynthesis: boolean;
	accelerometer: boolean;
	accelerometerWakeup: boolean;
	barometer: boolean;
	barometerWakeup: boolean;
	gyroscope: boolean;
	gyroscopeWakeup: boolean;
	magnetometer: boolean;
	magnetometerWakeup: boolean;
	photometer: boolean;
	photometerWakeup: boolean;
	proximity: boolean;
	proximityWakeup: boolean;
	tiltmeter: boolean;
	tiltmeterWakeup: boolean;
	dataEncryption: boolean;
	graphicsAcceleration: boolean;
	push: boolean;
	telephony: boolean;
	telephonyMms: boolean;
	telephonySms: boolean;
	screenSizeNormal: boolean;
	screenSize480_800: boolean;
	screenSize720_1280: boolean;
	autoRotation: boolean;
	shellAppWidget: boolean;
	visionImageRecognition: boolean;
	visionQrcodeGeneration: boolean;
	visionQrcodeRecognition: boolean;
	visionFaceRecognition: boolean;
	secureElement: boolean;
	nativeOspCompatible: boolean;
	profile: SystemInfoProfile;
}

type SystemInfoPropertyId =
	| 'BATTERY'
	| 'CPU'
	| 'STORAGE'
	| 'DISPLAY'
	| 'DEVICE_ORIENTATION'
	| 'BUILD'
	| 'LOCALE'
	| 'NETWORK'
	| 'WIFI_NETWORK'
	| 'ETHERNET_NETWORK'
	| 'CELLULAR_NETWORK'
	| 'NET_PROXY_NETWORK'
	| 'SIM'
	| 'PERIPHERAL'
	| 'MEMORY'
	| 'VIDEOSOURCE'
	| 'CAMERA_FLASH'
	| 'ADS'
	| 'SERVICE_COUNTRY'
	| 'SOURCE_INFO'
	| 'PANEL';

interface SystemInfo {
	getTotalMemory(): number;
	getAvailableMemory(): number;
	getCapabilities(): SystemInfoDeviceCapabilities;
	getCapability<C extends keyof SystemInfoDeviceCapabilities>(
		capability: C,
	): SystemInfoDeviceCapabilities[C];
	getCount(property: SystemInfoPropertyId): number;
	getPropertyValue<Id extends SystemInfoPropertyId>(
		property: Id,
		onSuccess: (value: unknown) => void,
		onError: () => void,
	): void;
	getPropertyValueArray<Id extends keyof SystemInfoPropertyId>(
		property: Id,
		onSuccess: (value: unknown[]) => void,
		onError: () => void,
	): void;
	addPropertyValueChangeListener<Id extends keyof SystemInfoPropertyId>(
		property: Id,
		listener: (value: unknown) => void,
	): number;
	addPropertyValueArrayChangeListener<Id extends keyof SystemInfoPropertyId>(
		property: Id,
		listener: (value: unknown[]) => void,
	): number;
	removePropertyValueChangeListener(listenerId: number): void;
}

interface WebSetting {
	setUserAgentString(
		userAgent: string,
		onSuccess: () => void,
		onError: (error: string) => void,
	): void;
	removeAllCookies(onSuccess: () => void, onError: () => void): void;
}

export interface Tizen {
	application: {
		getCurrentApplication(): TizenApplication;
	};
	tvaudiocontrol: TVAudioControl;
	tvinputdevice: TVInputDevice;
	systeminfo: SystemInfo;
	websetting: WebSetting;
}
