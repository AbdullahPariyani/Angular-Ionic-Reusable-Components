const API = {
	AUTH: 'login',
	ACCOUNT: 'account',
};
export const AUTH = {
	LOGIN: `${API.AUTH}/login`,
	VERIFY_OTP: `${API.AUTH}/login_confirm`,
	CLIENT_DATA: `${API.AUTH}/client_data`,
};

export const ACCOUNT = {
	GET_USER_LIST: `${API.ACCOUNT}/GetUserList`,
	GET_USER_DETAILS: `${API.ACCOUNT}/GetUserDetails`,
};
