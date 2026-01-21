import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetPolitics = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostPolitics = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);

export const apiDeletePolitics = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource);
