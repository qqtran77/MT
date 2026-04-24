import * as SecureStore from 'expo-secure-store';
export const saveToken = (t: string) => SecureStore.setItemAsync('token', t);
export const getToken = () => SecureStore.getItemAsync('token');
export const removeToken = async () => { await SecureStore.deleteItemAsync('token'); await SecureStore.deleteItemAsync('user'); };
export const saveUser = (u: any) => SecureStore.setItemAsync('user', JSON.stringify(u));
export const getUser = async () => { const s = await SecureStore.getItemAsync('user'); return s ? JSON.parse(s) : null; };
