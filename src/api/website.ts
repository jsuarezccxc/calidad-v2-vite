import { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetWebsite = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostWebsite = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiPutWebsite = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);
export const apiDeleteWebsite = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource);
export const apiSubdomain = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiGetWebsiteAuth = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiInitialData = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
export const apiCreateWebsite = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
export const apiWebsiteFile = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
