import { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiPayment = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiGetPayment = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiGetStatusPayment = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiSetStatusPayment = (request: FetchRequest): Promise<unknown> => FetchClient.patch(request.resource, request.data);

// PAYU PAYS
export const apiPayMembershipsOrUsers = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);
export const apiPayMembershipsOrUsersByPse = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);
export const apiPayUpdatedCardToken = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);
