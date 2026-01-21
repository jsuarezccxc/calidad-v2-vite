import { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiBucketGet = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiBucketPost = (request: FetchRequest, isFile = false): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, isFile);
export const apiBucketDelete = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource);
export const apiBucketPostFormData = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
