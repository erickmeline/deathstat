'use strict';

const 
	axios = require('axios'),
	cheerio = require('cheerio'),
	express = require('express'),
	http = require('http'),
	path = require('path'),
	stats = require('./data/stats');

const getDate = () => {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const yyyy = today.getFullYear();
	return `${mm}/${dd}/${yyyy}`;
};

const compareDates = () => {
	stats.list((err, data) => {
		if (data.length) {
			const savedDate = data[data.length-1].date;
			const compareDate1 = new Date();
			const compareDate2 = new Date(savedDate);
			if (compareDate1.setHours(0,0,0,0) > compareDate2.setHours(0,0,0,0)) {
				fetchData();
			}
		}
		else {
			fetchData();
		}
	});
};

const fetchData = () => {
	axios('https://www.worldometers.info/coronavirus/country/us/').then((res) => {
	const $ = cheerio.load(res.data);
	const fetchRecord = {
		date: getDate(),
		detected: parseFloat($('.maincounter-number').eq(0).first('span').text().trim().replace(/,/g, '')),
		recovered: parseFloat($('.maincounter-number').eq(2).first('span').text().trim().replace(/,/g, '')),
		deaths: parseFloat($('.maincounter-number').eq(1).first('span').text().trim().replace(/,/g, '')),
	}
	fetchRecord.mortality = (fetchRecord.deaths / (fetchRecord.deaths+fetchRecord.recovered)).toFixed(4);
	stats.create(fetchRecord);
	console.log('fetched record:',fetchRecord);
  }).catch(() => console.log('fetch failed'));
}

compareDates();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	stats.list((err, data) => {
		res.render('index', { stats: data });
	});
});

http.createServer(app).listen(3000);
