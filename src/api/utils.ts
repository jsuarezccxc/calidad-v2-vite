import { HttpMethod, FetchRequest } from '@models/Request';
import FetchClient from '@api/client';

export const apiDynamicRequest = (request: FetchRequest, type = HttpMethod.POST): Promise<unknown> =>
    type === HttpMethod.POST ? FetchClient.post(request.resource, request.data) : FetchClient.get(request.resource, request.data);

export const apiCustomQuery = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);

export const apiGetReasonRejections = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiGetUtils = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostUtils = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
