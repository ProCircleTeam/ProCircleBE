const admin = require('firebase-admin');
const db = require('../../models');
const {Notification} = require('../../models');

const {User} = db;
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

class NotificationService {
	/**
   * Save a notification in DB
   * @param {Object} payload
   * @param {number} payload.userId - ID of the user receiving the notification
   * @param {string} payload.title - Title of the notification
   * @param {string} payload.content - Body content of the notification
   * @param {string} [payload.type="general"] - Optional type (e.g. "match", "reminder", "system")
   * @returns {Promise<Notification>}
   */
	static async saveNotification({userId, title, content, type = 'general'}) {
		try {
			await Notification.create({
				userId,
				title,
				body: content,
				type,
				// eslint-disable-next-line camelcase
				is_read: false,
			});
		} catch (error) {
			console.error('❌ Error saving notification:', error);
			throw error;
		}
	}

	static async sendToUser(userId, title, body, data = {}, fcmToken) {
		try {
			const user = await User.findByPk(userId);

			if ((!user || !user.fcmToken) && !fcmToken) {
				console.warn(`No FCM token found for user ${userId}`);
				return;
			}

			const message = {
				notification: {title, body},
				token: fcmToken ?? user.fcmToken,
				data,
			};

			await admin.messaging().send(message);
			await NotificationService.saveNotification({
				userId,
				title,
				content: body,
			});

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
