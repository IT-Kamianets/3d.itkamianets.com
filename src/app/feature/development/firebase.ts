import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

let _app: Promise<FirebaseApp> | undefined;
let _db: Promise<Firestore> | undefined;

/** Browser only: loads the Firebase SDK on first use and shares one app instance. */
export const getFirebaseApp = () =>
	(_app ??= import('firebase/app').then(
		({ getApps, initializeApp }) => getApps()[0] ?? initializeApp(environment.firebase),
	));

export const getDb = () =>
	(_db ??= Promise.all([import('firebase/firestore'), getFirebaseApp()]).then(
		([{ getFirestore }, app]) => getFirestore(app),
	));
