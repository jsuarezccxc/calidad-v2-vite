import type { FetchRequest } from '@models/Request';
import FetchClient from './client';

export const apiPostAppointment = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiGetSchedules = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
