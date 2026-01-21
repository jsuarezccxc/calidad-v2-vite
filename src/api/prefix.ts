import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetPrefix = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostPrefix = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);

export const apiDeletePrefix = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);
