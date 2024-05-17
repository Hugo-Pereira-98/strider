import { removeLocalStorage } from './localStorage';

export function clearStorage() {
	removeLocalStorage('bid');
	removeLocalStorage('offer');
	removeLocalStorage('organizations');
	removeLocalStorage('indications');
	removeLocalStorage('institutional');
}
