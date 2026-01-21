import type { FetchRequest } from '@models/Request';
import FetchClient from './client';
import { urls } from './urls';

export const apiGetHistory = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);

export const apiGetActiveMembership = (request: FetchRequest): Promise<unknown> =>
    FetchClient.get(request.resource, request.data);

export const apiPostMembershipFreeDocuments = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);

export const apiGetStatusTransaction = (companyId: string): Promise<unknown> =>
    FetchClient.getHeadersCompany(urls.membership.activeStatusTransaction, [], { 'company-id': companyId });

export const apiPostReactivePaymeny = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);

export const apiPostLandingMemberships = (request: FetchRequest): Promise<unknown> =>
    FetchClient.post(request.resource, request.data);

export const apiGetLandingMemberships = (request: FetchRequest): Promise<unknown> => FetchClient.get(request.resource);
