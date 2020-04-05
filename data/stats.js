'use strict';

const Datastore = require('nedb'),
	path = require('path');

const db = { 
	stats: new Datastore({ filename: path.join(__dirname, 'stats.db'), autoload: true})
};

const record = {
	date: '04/04/2020', 
	detected: '10000',
	recoveries: 1000,
	deaths: 1000,
	mortality: 0.374
};

// db.stats.insert({ 
// 	date: '04/04/2020', 
// 	detected: '10000',
// 	recoveries: 1000,
// 	deaths: 1000,
//	mortality: 0.374
// 	}, (err, insertedData) => {
// });

const stats = {
	get: (alias, callback) => {
		db.stats.find({ date: date }, (err, stats) => {
			if (err || !stats) {
				return callback(new Error('Mortality date not found'));
			}
			callback(null, stats);
		})
	},
	create: (record, callback) => {
		db.stats.insert(record);
	},
	list: (callback) => {
		db.stats.find({}).sort({ date: 1 }).exec(callback);
	}
};

// stats.create(record);

module.exports = stats;
