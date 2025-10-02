
const admin = require('firebase-admin');
const db = require('../../models');

const {User} = db;
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

class NotificationService {
	static async sendToUser(userId, title, body, data = {}) {
		try {
			const user = await User.findByPk(userId);

			if (!user || !user.fcmToken) {
				console.warn(`No FCM token found for user ${userId}`);
				return;
			}

			const message = {
				notification: {title, body},
				token: user.fcmToken,
				data,
			};

			await admin.messaging().send(message);

			console.log(`✅ Notification sent to user ${userId}`);
		} catch (error) {
			console.error('❌ Error sending notification:', error);
		}
	}

	static async sendToMany(userIds, title, body, data = {}) {
		try {
			const users = await User.findAll({
				where: {id: userIds},
				attributes: ['fcmToken'],
			});

			const tokens = users.map(u => u.fcmToken).filter(Boolean);

			if (tokens.length === 0) {
				console.warn('No valid FCM tokens found');
				return;
			}

			const message = {
				notification: {title, body},
				tokens,
				data,
			};

			await admin.messaging().sendEachForMulticast(message);

			console.log(`✅ Notification sent to ${tokens.length} users`);
		} catch (error) {
			console.error('❌ Error sending notifications:', error);
		}
	}
}

module.exports = NotificationService;
