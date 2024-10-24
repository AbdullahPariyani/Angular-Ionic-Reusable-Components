import { isDevMode } from '@angular/core';

export const mConstant = {
	language: 'language',
	client: 'clientDetails',
	token: 'accessToken',
	splashShown: 'splashShown',
};

export let M_APP_CONFIG = {
	APP_VERSION: '1.0.0.0',
	SPLASH_TIME: 3000,
	IS_LOAD_FROM_IFRAME: false,
	DASHBOARD_URL: isDevMode() ? 'https://google.com' : 'https://google.com',
	ONE_SIGNAL_NOTIFICATION_ID: 'YOUR_ONE_SIGNAL_ID',
};
