import FetchClient from '@api/client';
import { FetchRequest } from '@models/Request';

export const apiGetContingency = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostFileContingency = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data, false, {}, true);
export const apiPutContingency = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);
