import { FetchRequest } from '@models/Request';
import fetchClient from './client';

export const apiDomain = (request: FetchRequest): Promise<unknown> => fetchClient.post(request.resource, request.data);
