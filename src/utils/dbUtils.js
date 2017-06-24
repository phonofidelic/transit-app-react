// import { idb } from 'idb';
const idb = require('idb');

const IDB_VERSION = 1;

export const openDb = () => {
	if(!'serviceWorker' in navigator) {
		return Promise.resolve();
	}

	console.log('Initiating database', idb);	
	return idb.open('transit-db', IDB_VERSION, (upgradeDb) => {
		switch (upgradeDb.oldVersion) {
			case 0:
				let routeStore = upgradeDb.createObjectStore('routes', {
					keyPath: 'onestop_id'
				});

				routeStore.createIndex('by-id', 'onestop_id');
		}
	});
};

export const populateDb = (dbPromise, routes) => {
	return dbPromise.then(db => {
		if (!db) return;

		const tx = db.transaction('routes', 'readwrite');
		const store = tx.objectStore('routes');

		routes.map(route => {
			store.put(route);
		});
	})
	.catch(err => {
		console.error('dbPromise error:', err);
	});
};

export const getStoredRouteData = (dbPromise) => {
	return dbPromise.then(db => {
		if (!db) return;

		const index = db.transaction('routes')
		.objectStore('routes').index('by-id');

		return index.getAll().then(routes => {
			console.log('### from idb, routes:', routes);
			return routes;
		});
	});
};