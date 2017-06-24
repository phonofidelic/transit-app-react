const VERSION = 0;
const CACHE_NAME = `static-cache-${VERSION}`;
const BBOX_BASE_URL = 'https://transit.land/api/v1/routes?bbox=';

const STATIC_SOURCES = [
	'/',
	'static/js/bundle.js',
	// 'https://mapzen.com/js/mapzen.js',
	// 'https://mapzen.com/js/mapzen.css'
	]
self.addEventListener('install', (event) => {
	console.log('@serviceWorker install');
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(STATIC_SOURCES);
		})
	);
});

self.addEventListener('activate', (event) => {
	console.log('@serviceWorker activate');
});

self.addEventListener('fetch', (event) => {
	console.log('@serviceWorker fetch', event.request.url);

	if (event.request.url.indexOf('https://mapzen.com') == -1) {
		const requestUrl = new URL(event.request.url);
		// console.log('### requestUrl:', requestUrl);
	
		event.respondWith(
			caches.match(event.request).then(response => {
				if (response) {
					console.log('Found response in cache:', response);
					return response;
				} else {
					console.log('No response found in cache. About to fetch from network...')
					return fetch(requestUrl, {mode: 'cors'}).then(response => {
						console.log('Response from network:', response);
						return response;
					}).catch(err => {
						console.error('Fetch from network failed: ', err);
					});
				}
			})
		);
	}

	// if (event.request.url.indexOf(BBOX_BASE_URL) !== -1) {
	// 	// console.log('### handle bbox request', event.request.url.indexOf('='), event.request.url.indexOf('&'));
	// 	let start = event.request.url.indexOf('=');
	// 	let end = event.request.url.indexOf('&');

	// 	let extractedParms = event.request.url.slice(start+1, end).split(',');
	// 	console.log('##3 extractedParms:', extractedParms);
	// }

	// event.respondWith(
	// 	console.log('event:', event)
	// );
});

// `https://transit.land/api/v1/routes?bbox=-123.16411550000001,46.1362083,-122.16411550000001,45.1362083&per_page=10`
// extract coordinate parameters
// 