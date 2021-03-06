interface Navigator {
	mozAlarms: {
		add: (Date, string, Object) => void;
		getAll: () => {
			onsuccess: () => void;
		};
		remove: (id: number) => void;
	};
	mozSetMessageHandler: (name: string, handler: (alarm: any) => void) => void;
	getDeviceStorage: (name: string) => any;
	mozApps: any;
}
declare var Notification;
declare var MozActivity;
