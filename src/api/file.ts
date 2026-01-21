import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiFile = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data, true);

export const apiGetFile = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource, request.data, {}, true);

export const apiPostFormData = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
