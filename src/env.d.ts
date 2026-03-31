interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_APP_AXIOS_BASE_URL: string;
	readonly VITE_APP_YN_LABEL: string;
	readonly VITE_EDMS_URL: string;
	readonly VITE_APPROVAL_URL: string;
	readonly VITE_CLICK_TO_DIAL_URL: string;
	readonly VITE_RD_BASE_URL: string;
	readonly VITE_EDMS_IMG_URL: string;
	readonly VITE_NAVER_MAPS_API_KEY: string;
	readonly VITE_SHA256_SALT_KEY: string;
	readonly VITE_CENTER_APP_QR_URL: string;
	readonly VITE_DRIVER_APP_QR_URL: string;
	readonly VITE_ENVIRONMENT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
