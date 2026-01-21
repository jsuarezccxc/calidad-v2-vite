import type { FetchRequest } from '@models/Request';
import type { IHeaders } from 'models/Login';
import FetchClient from './client';

export const apiGetUser = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiUpdateUser = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);

export const apiPostUsers = (request: FetchRequest, contentType?: IHeaders): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, undefined, contentType);

export const apiValidatemigrationAccount = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);
