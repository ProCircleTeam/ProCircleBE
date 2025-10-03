const {sequelize} = require('../../models');

async function clearDBDataService() {
	const t = await sequelize.transaction();
	try {
		await sequelize.query('SET LOCAL session_replication_role = \'replica\';', {transaction: t});

		const models = Object.values(sequelize.models)
			.filter(m => !['SequelizeMeta', 'SequelizeData'].includes(m.getTableName()));

		await Promise.all(models.map(m => m.truncate({restartIdentity: true, cascade: true, transaction: t})));

		await t.commit();
		console.log('All data cleared successfully');
	} catch (error) {
		await t.rollback();
		console.error('Error clearing data:', error);
		throw error;
	}
}

module.exports = {clearDBDataService};
