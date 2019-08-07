let mySequelize = require("./../config/database");
let Sequelize = require("sequelize");
let File;
module.exports = () => {
	File = mySequelize.define('file', {
		name: {
	    	type: Sequelize.STRING,
		},
		path: {
	    	type: Sequelize.STRING,
	  	},
	  	dir:  {
	  		type: Sequelize.STRING,	
	  	}, 
		file: {
			type: Sequelize.BLOB,
		}
	});
	File.sync({alter: false });
	return File;
};
