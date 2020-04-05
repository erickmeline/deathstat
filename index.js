const axios = require('axios');
const cheerio = require('cheerio');

const siteUrl = 'https://addup.sierraclub.org/';

axios('https://addup.sierraclub.org/').then((response) => {
	const $ = cheerio.load(response.data);
	const firstUrl = $('body').find('img').attr('src')
	console.log(firstUrl)

  }).catch(() => console.log('something went wrong!'));

