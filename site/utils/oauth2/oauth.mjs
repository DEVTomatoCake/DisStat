import RequestHandler from './RequestHandler.mjs'

const { oauth2 } = await import(process.env.NODE_ENV === "production" ? '/config/config.mjs' : '../../config/config.mjs')

const requestHandler = new RequestHandler()

function encode(obj) {
	let string = "";

	for (const [key, value] of Object.entries(obj)) {
		if (!value) continue;
		string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
	}

	return string.substring(1);
}

export const tokenRequest = (options = {}) => {
	const obj = {
		client_id: oauth2.clientID,
		client_secret: oauth2.clientSecret,
		grant_type: "authorization_code",
		code: options.code,
		refresh_token: undefined,
		redirect_uri: options.redirectUri,
		scope: "identify"
	};

	const encoded_string = encode(obj);

	return requestHandler.request("POST", "/oauth2/token", encoded_string, {
		contentType: "application/x-www-form-urlencoded",
	});
}

export const getUser = (access_token) => {
	return requestHandler.request("GET", "/users/@me", undefined, {
		auth: {
			type: "Bearer",
			creds: access_token,
		},
	});
}