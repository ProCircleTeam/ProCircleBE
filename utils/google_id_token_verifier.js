const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

async function verifyGoogleIdToken(idToken) {
	try {
		console.log('Verified payload =====================> ');

		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.WEB_CLIENT_I,
		});

		const payload = ticket.getPayload();
		console.log('Verified payload =====================> ', payload);
		return {
			userId: payload.sub,
			email: payload.email,
			name: payload.name,
			picture: payload.picture,
		};
	} catch (e) {
		console.log('Error verifying Google id Token  ', e);
	}
}

module.exports = {verifyGoogleIdToken};
