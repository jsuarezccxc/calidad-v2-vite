import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiPostInstructions = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);

export const apiPutInstructions = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);