import { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetInventory = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostInventory = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiPutInventory = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);
export const apiDeleteInventory = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);
export const apiGetUtils = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostUtils = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiInventoryFiles = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
