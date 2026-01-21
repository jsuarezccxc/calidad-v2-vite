/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericRecord } from '@models/GenericRecord';
import { HttpMethod } from '@models/Request';
import fetch from '@utils/Fetch';

export const headerDefault: IGenericRecord = { 'Content-Type': 'application/json; charset=utf-8' };

class FetchClient {
    baseUrl = `${process.env.REACT_APP_BASE_URL}`;

    formatUrl(uri: string): string {
        return `${this.baseUrl}${uri}`;
    }

    sendForm(
        method: HttpMethod,
        uri: string,
        data: any,
        isFile?: boolean,
        contentType?: IGenericRecord,
        isDataForm?: boolean
    ): Promise<unknown> {
        const url = uri.includes(this.baseUrl) ? uri : this.formatUrl(uri);

        let options = {};

        options = {
            method,
            headers: contentType || {},
        };

        if (method !== HttpMethod.GET) {
            options = {
                ...options,
                body: isDataForm ? data : JSON.stringify(data),
            };
        }

        return fetch.request(url, options).then(async response => isFile ? await response.blob() : response.json());
    }

    get(uri: string, data?: unknown, contentType = headerDefault, isFile = false): Promise<unknown> {
        return this.sendForm(HttpMethod.GET, uri, data, isFile, contentType);
    }

    post(uri: string, data: unknown, isFile = false, contentType = headerDefault, isDataForm = false): Promise<unknown> {
        return this.sendForm(HttpMethod.POST, uri, data, isFile, contentType, isDataForm);
    }

    put(uri: string, data: unknown, isFile = false, contentType = headerDefault, isDataForm = false): Promise<unknown> {
        return this.sendForm(HttpMethod.PUT, uri, data, isFile, contentType, isDataForm);
    }

    delete(uri: string, data?: unknown, isFile = false, contentType = headerDefault): Promise<unknown> {
        return this.sendForm(HttpMethod.DELETE, uri, data, isFile, contentType);
    }

    patch(uri: string, data: unknown, isFile = false, contentType = headerDefault, isDataForm = false): Promise<unknown> {
        return this.sendForm(HttpMethod.PATCH, uri, data, isFile, contentType, isDataForm);
    }

    getHeadersCompany(uri: string, data?: unknown, contentType = {}): Promise<unknown> {
        return this.sendForm(HttpMethod.GET, uri, data, false, contentType);
    }
}

export default new FetchClient();
