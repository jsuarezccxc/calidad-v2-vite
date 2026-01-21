import { FetchRequest } from '@models/Request';
import FetchClient, { headerDefault } from './client';

export const apiGetInvoice = (request: FetchRequest, companyId?: string): Promise<unknown> =>
    FetchClient.get(request.resource, null, companyId ? { ...headerDefault, 'company-id': companyId } : headerDefault);
export const apiPostInvoice = (request: FetchRequest): Promise<unknown> => FetchClient.post(request.resource, request.data);
export const apiPutInvoice = (request: FetchRequest): Promise<unknown> => FetchClient.put(request.resource, request.data);
export const apiDeleteInvoice = (request: FetchRequest): Promise<unknown> => FetchClient.delete(request.resource, request.data);
export const apiSendMailAttachment = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
export const apiSendMailInvoice = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
export const apiGetInvoicesAvailable = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
export const apiUploadInvoice = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
export const apiUploadRejectSupport = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, true, {}, true);
export const apiUpdateFile = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data, false, {}, true);
