import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetCompany = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource, request.data);

export const apiPostCompany = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);

export const apiPutCompany = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);

export const apiDeleteCompany = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);

export const apiGetAdminCustomers = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostCompanyAccountCreated = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);
