import LocalStorage from '@utils/LocalStorage';
import { LoginConstants } from '@constants/Login';
import { IGenericRecord } from '@models/GenericRecord';

export const getUserData = (): IGenericRecord => JSON.parse(LocalStorage.get(LoginConstants.USER_DATA));
