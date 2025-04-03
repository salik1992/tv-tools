interface SystemInfo {
	readonly country?: string;
	readonly timezone?: string;
	readonly smartServiceCountry?: string;
}

export interface DeviceInfo {
	readonly modelName?: string;
	readonly modelNameAscii?: string;
	readonly version?: string;
	readonly sdkVersion?: string;
	readonly screenWidth?: number;
	readonly screenHeight?: number;
	readonly uhd?: boolean;
	readonly uhd8k?: boolean;
}

type ConnectionState = 'disconnected' | 'connected';
type IpSettingMethod = 'dhcp' | 'Manual';
type EnglishBoolean = 'yes' | 'no';
type StringBoolean = 'true' | 'false';

interface CommonInternetInterfaceStatus {
	readonly state: ConnectionState;
	readonly interfaceName?: string;
	readonly ipAddress?: string;
	readonly netmask?: string;
	readonly gateway?: string;
	readonly dns1?: string;
	readonly dns2?: string;
	readonly dns3?: string;
	readonly method?: IpSettingMethod;
	readonly onInternet?: EnglishBoolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WiredStatus extends CommonInternetInterfaceStatus {}

interface WifiStatus extends CommonInternetInterfaceStatus {
	readonly ssid?: string;
	readonly isWakeOnWiFiEnabled?: boolean;
}

interface WfdInfo {
	readonly wfdCpSupport: boolean;
	readonly wfdDeviceType: string;
	readonly wfdRtspPort: number;
	readonly wfdSessionAvail: boolean;
}

interface WifiPeerInfo {
	readonly deviceName: string;
	readonly deviceAddress: string;
	readonly groupOwner: boolean;
	readonly configMethod: number;
	readonly signalLevel: number;
	readonly wfdInfo: WfdInfo;
	readonly connected: boolean;
	readonly peerIp: string;
	readonly invited: string;
	readonly serviceDiscoveryResponse: string;
}

interface WifiDirectStatus extends CommonInternetInterfaceStatus {
	readonly localIp?: string;
	readonly connectedPeers?: WifiPeerInfo[];
}

interface RequestObject {
	send(): void;
	cancel(): void;
}

interface NegativeRequestResponse {
	returnValue: false;
	errorCode: number | string;
	errorText: string;
}

interface PositiveRequestResponse {
	returnValue: true;
}

export interface ConnectionManagerResponse extends PositiveRequestResponse {
	isInternetConnectionAvailable: boolean;
	wired: WiredStatus;
	wifi: WifiStatus;
	wifiDirect: WifiDirectStatus;
}
interface ConnectionManagerOptions {
	method: 'getStatus';
	parameters: { subscribe: true };
	onSuccess?(
		response: NegativeRequestResponse | ConnectionManagerResponse,
	): void;
	onFailure?(response: NegativeRequestResponse): void;
	onComplete?(
		response: NegativeRequestResponse | ConnectionManagerResponse,
	): void;
}

interface SystemPropertyResponse extends PositiveRequestResponse {
	modelName: string;
	firewareVersion: string;
	UHD: StringBoolean;
}
interface SystemPropertyOptions {
	method: 'getSystemInfo';
	parameters: { keys: ['modelName', 'firmwareVersion', 'UHD'] };
	onSuccess?(
		response: NegativeRequestResponse | SystemPropertyResponse,
	): void;
	onFailure?(response: NegativeRequestResponse): void;
	onComplete?(
		response: NegativeRequestResponse | SystemPropertyResponse,
	): void;
}

interface DuidResponse extends PositiveRequestResponse {
	idList: { idValue: string; idType: string }[];
}
interface DuidOptions {
	method: 'deviceid/getIDs';
	parameters: { idType: ['LGUDID'] };
	onSuccess?(response: NegativeRequestResponse | DuidResponse): void;
	onFailure?(response: NegativeRequestResponse): void;
	onComplete?(response: NegativeRequestResponse | DuidResponse): void;
}

export enum RequestUrls {
	CONNECTION_MANAGER = 'luna://com.webos.service.connectionmanager',
	CONNECTION_MANAGER_PALM = 'luna://com.palm.service.connectionmanager',
	SYSTEM_PROPERTY = 'luna://com.webos.service.tv.systemproperty',
	SM = 'luna://com.webos.service.sm',
}

interface RequestOptionsMap {
	[RequestUrls.CONNECTION_MANAGER]: ConnectionManagerOptions;
	[RequestUrls.CONNECTION_MANAGER_PALM]: ConnectionManagerOptions;
	[RequestUrls.SYSTEM_PROPERTY]: SystemPropertyOptions;
	[RequestUrls.SM]: DuidOptions;
}

export interface WebOS {
	readonly libVersion: '1.2.12';
	readonly platform: {
		tv?: true;
	};
	readonly keyboard: {
		isShowing(): boolean;
	};
	readonly service: {
		request<Request extends RequestUrls>(
			url: Request,
			options: RequestOptionsMap[Request],
		): RequestObject;
	};
	deviceInfo(callback: (deviceInfo: DeviceInfo) => void): void;
	fetchAppId(): string;
	fetchAppRootPath(): string;
	platformBack(): void;
	systemInfo(): SystemInfo;
}

export interface PalmSystem {
	deactivate(): void;
}
