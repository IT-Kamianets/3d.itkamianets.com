export const environment: {
	appVersion: string;
	production: boolean;
	defaultLanguage: string;
	languages: AppLanguage[];
	/** Public web app config of the shared Web Art Work project; access is enforced by Firebase rules. */
	firebase: {
		apiKey: string;
		authDomain: string;
		projectId: string;
		storageBucket: string;
		messagingSenderId: string;
		appId: string;
	};
} = {
	firebase: {
		apiKey: 'AIzaSyBm-sCDqmFwHKEta6uZmp7ILmm4Pc_CrWc',
		authDomain: 'webart-work.firebaseapp.com',
		projectId: 'webart-work',
		storageBucket: 'webart-work.firebasestorage.app',
		messagingSenderId: '393420038189',
		appId: '1:393420038189:web:855aa6acb185d884e9d8a4',
	},
	appVersion: '1.0.0',
	production: true,
	defaultLanguage: 'ua',
	languages: [
		{
			code: 'ua',
			name: 'Ukrainian',
			nativeName: 'Українська',
			flagSrc: 'flags/ukraine.svg',
			htmlLang: 'uk',
			population: 35,
		},
		{
			code: 'en',
			name: 'English',
			nativeName: 'English',
			flagSrc: 'flags/united-kingdom.svg',
			htmlLang: 'en',
			population: 280,
		},
	],
};

export interface AppLanguage {
	code: string;
	name: string;
	nativeName: string;
	flagSrc: string;
	htmlLang: string;
	population: number;
}
