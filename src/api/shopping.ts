import { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetShopping = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiPostShopping = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
