/* eslint-disable no-undef */
const admin = require('firebase-admin');
const path = require('path');
const {createRequire} = require('module');
const requireJSON = createRequire(require.main.filename);
const db = require('../../models');

const {User} = db;

const serviceAccountPath = path.resolve(__dirname, '../../firebase_service_account/procircle-8a357-firebase-adminsdk-fbsvc-3cd254a04d.json');
const serviceAccount = requireJSON(serviceAccountPath);

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
