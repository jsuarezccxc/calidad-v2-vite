import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiGetNotification = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiPostNotification = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
