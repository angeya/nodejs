let Sequelize = require('sequelize');
const sequelize = new Sequelize(
	'database', 
	'username', 
	'password',{
	host: 'localhost',
	dialect: 'sqlite',//|'postgres'|'mssql',
	operatorsAliases: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	storage: './db/file.sever.sqlite',
});

//测试是否连接成功
sequelize.authenticate()
	.then(() => {
        console.log('建立连接成功！');
    })
    .catch(err => {
        console.error('建立连接失败。', err);
    });
module.exports = sequelize;