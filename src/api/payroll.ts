import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetPayroll = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostPayroll = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
