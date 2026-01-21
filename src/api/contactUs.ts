import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const sendMessage = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
