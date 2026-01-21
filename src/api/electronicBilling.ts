import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetElectronic = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostElectronic = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
