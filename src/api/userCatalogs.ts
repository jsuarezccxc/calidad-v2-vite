import { FetchRequest } from '@models/Request';
import FetchClient from './client';
import { urls } from './urls';

export const apiGetUser = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource, request.data);

export const apiEditUser = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);

export const apiUserPermissions = (): Promise<unknown> => FetchClient.get(urls.permission);

export const apiDeleteUser = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);

export const apiAddUser = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
