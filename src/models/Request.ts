/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericRecord } from '@models/GenericRecord';

export enum ServiceType {
    INVENTORY = 'INVENTORY',
    UTILS = 'UTILS',
    BUCKET = 'BUCKET',
    INVOICE = 'INVOICE',
    BINNACLE = 'BINNACLE',
    NOTIFICATION = 'NOTIFICATION',
    WEBSITE = 'WEBSITE',
    WEBSITE_NODE = 'WEBSITE_NODE',
    ELECTRONIC_INVOICE = 'ELECTRONIC_INVOICE',
    SUPPORT_DOCUMENT = 'SUPPORTING_DOCUMENT',
    DOMAIN = 'DOMAIN',
    SHOPPING = 'SHOPPING',
    PAYS = 'PAYS',
    PHYSICAL_STORE = 'PHYSICAL_STORE',
    SECURITY = 'SECURITY',
    ADMIN_NGINX = 'ADMIN_NGINX',
    PAYROLL = 'PAYROLL',
}

export enum HttpMethod {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

export enum FileType {
    INVOICE = 'INVOICE',
}

export enum FolderType {
    CAROUSEL = 'carousel',
    VOUCHER = 'voucher',
}

export class Request {
    resource: string;
    method?: HttpMethod;
    service?: ServiceType;
    user_id?: string;
    company_id?: string;
    data?: IGenericRecord[] | IGenericRecord;
    start_date?: number;
    finish_date?: number;

    /**
     * Constructor
     * @param resource: string - Service resource
     * @param method: HttpMethod - Optional Method request
     * @param service: ServiceType - Optional Service request
     * @param user_id: string - Optional user id
     * @param company_id: string - Optional company id
     * @param data: IGenericRecord[] | IGenericRecord - Optional data request
     * @param start_date: number - Optional start date request
     * @param finish_date: number - Optional finish date request
     */
    constructor(
        resource: string,
        method?: HttpMethod,
        service?: ServiceType,
        user_id?: string,
        company_id?: string,
        data?: IGenericRecord[] | IGenericRecord,
        start_date?: number,
        finish_date?: number
    ) {
        this.resource = resource;
        this.method = method;
        this.service = service;
        this.user_id = user_id;
        this.company_id = company_id;
        this.data = data;
        this.start_date = start_date;
        this.finish_date = finish_date;
    }
}

export class FetchRequest {
    resource: string;
    data?: IGenericRecord[] | IGenericRecord;
    start_date?: number;
    finish_date?: number;

    /**
     * Constructor
     * @param resource: string - Service resource
     * @param data: IGenericRecord[] | IGenericRecord - Optional data request
     * @param start_date: number - Optional start date request
     * @param finish_date: number - Optional finish date request
     */
    constructor(resource: string, data?: IGenericRecord[] | IGenericRecord, start_date?: number, finish_date?: number) {
        this.resource = resource;
        this.data = data;
        this.start_date = start_date;
        this.finish_date = finish_date;
    }
}

export class FetchRequestFormData {
    /**
     * Form data request
     */
    formData: FormData;

    /**
     * Constructor
     * @param file: File for upload
     * @param folder: Folder name
     * @param service Service request
     *
     */
    constructor(file: File, service: ServiceType, folder?: FolderType) {
        this.formData = new FormData();
        this.formData.set('file', file);
        this.formData.set('service', service);
        this.formData.set('folder', folder || '');
    }
}

export class RequestFormData {
    /**
     * Form data request
     */
    formData: FormData;

    /**
     * Constructor
     * @param resource Service resource
     * @param method Method request
     * @param service Service request
     * @param user_id User id
     * @param company_id company id
     * @param file File for upload
     * @param folder Folder name
     * @param type File type
     * @param data Optional data
     * @param body_content Optional body content
     * @param invoice_type Optional invoice type
     */
    constructor(
        resource: string,
        method: HttpMethod,
        service: ServiceType,
        user_id: string,
        company_id: string,
        file: FileList,
        folder?: FolderType,
        type?: FileType,
        data?: string,
        body_content?: string
    ) {
        this.formData = new FormData();
        this.formData.set('resource', resource);
        this.formData.set('method', method);
        this.formData.set('service', service);
        this.formData.set('user_id', user_id);
        this.formData.set('company_id', company_id);
        this.formData.set('file', file[0]);
        this.formData.set('folder', folder || '');
        this.formData.set('type', type || '');
        this.formData.set('data', data || '');
        this.formData.set('body_content', body_content || '');
    }
}

export class RequestDataForm {
    /**
     * Form data request
     */
    formData: FormData;

    /**
     * Constructor
     * @param resource Service resource
     * @param method Method request
     * @param service Service request
     * @param user_id User id
     * @param company_id company id
     * @param file File for upload
     * @param data_website_id id from website who write the article
     * @param title title article
     * @param contentArticle body of article
     * @param date_publish date the article was published
     * @param excerpt_article little resume of article
     * @param data_date date the article was written
     * @param data_status status of article if is published or not
     * @param data_author name of the person who wrote de article
     */
    constructor(
        resource: string,
        method: HttpMethod,
        service: ServiceType,
        user_id: string,
        company_id: string,
        data_website_id: string,
        title: string,
        contentArticle: string,
        date_publish: string,
        excerpt_article: string,
        data_date: string,
        file: FileList,
        data_status: string,
        data_author: string
    ) {
        this.formData = new FormData();
        this.formData.set('resource', resource);
        this.formData.set('method', method);
        this.formData.set('service', service);
        this.formData.set('user_id', user_id);
        this.formData.set('company_id', company_id);
        this.formData.set('data[website_id]', data_website_id);
        this.formData.set('data[name]', title);
        this.formData.set('data[content]', contentArticle);
        this.formData.set('data[publish_date]', date_publish);
        this.formData.set('data[excerpt]', excerpt_article);
        this.formData.set('data[date]', data_date);
        this.formData.set('image', file[0]);
        this.formData.set('data[status]', data_status);
        this.formData.set('data[author_id]', data_author);
    }
}

/**
 * This interface defines elements for creating a request
 *
 * @typeParam url: string - Defines url for request
 * @typeParam method: HttpMethod - Defines method for request
 * @typeParam service_type: ServiceType - Defines service type for request
 * @typeParam api: any - Defines api for request
 * @typeParam action: any - Optional param that defines action to dispatch
 * @typeParam action_with_await: any - Optional param that defines action with await to dispatch
 * @typeParam data_request: IGenericRecord | IGenericRecord[] - Optional param that defines data send for request
 * @typeParam action_response: any - Optional param that defines action that dispatch service code
 */
export interface ICreateRequest {
    url: string;
    method: HttpMethod;
    service_type: ServiceType;
    api: any;
    action?: any;
    action_with_await?: any;
    data_request?: IGenericRecord;
    action_response?: any;
}
