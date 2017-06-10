const VERSION = 0;
const CACHE_NAME = `static-cache-${VERSION}`;
const BBOX_BASE_URL = 'https://transit.land/api/v1/routes?bbox=';

self.addEventListener('install', (event) => {
	console.log('@serviceWorker install');
});

self.addEventListener('activate', (event) => {
	console.log('@serviceWorker activate');
});

self.addEventListener('fetch', (event) => {
	console.log('@serviceWorker fetch', event.request.url);

	// const requestUrl = new URL(event.request.url);

	if (event.request.url.indexOf(BBOX_BASE_URL) !== -1) {
		// console.log('### handle bbox request', event.request.url.indexOf('='), event.request.url.indexOf('&'));
		let start = event.request.url.indexOf('=');
		let end = event.request.url.indexOf('&');

		let extractedParms = event.request.url.slice(start+1, end).split(',');
		console.log('##3 extractedParms:', extractedParms);
	}

	// event.respondWith(
	// 	console.log('event:', event)
	// );
});

// `https://transit.land/api/v1/routes?bbox=-123.16411550000001,46.1362083,-122.16411550000001,45.1362083&per_page=10`
// extract coordinate parameters
// 