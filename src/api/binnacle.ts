import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetBinnacle = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostBinnacle = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false);

export const apiPostBinnacleSimpleObject = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false);

export const apiPutBinnacle = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);

export const apiDeleteBinnacle = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);
