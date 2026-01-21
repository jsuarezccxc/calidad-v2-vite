/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericRecord } from './GenericRecord';

/**
 * This interface defines file type
 *
 * @typeParam pdf: string - When file type is pdf
 * @typeParam xlsx: string - When file type is excel
 */
export interface IFileType {
    pdf: string;
    xlsx: string;
}

/**
 * This interface defines file request props
 *
 * @typeParam type: string - File's type
 * @typeParam module: string - File's module name
 * @typeParam start_date?: string | number - Optional start date for the data can be a Unix type or a string type "DD/MM/YYYY"
 * @typeParam finish_date?: string | number - Optional finish date for the data can be a Unix type or a string type "DD/MM/YYYY"
 * @typeParam route?: string - Optional BreadCrumb
 * @typeParam data: IGenericRecord - File's data
 * @typeParam now?: Date - Optional prop to show date now
 * @typeParam group?: string - Optional another argument
 * @typeParam supplier_name?: string - Optional another argument
 * @typeParam moduleName?: string - Optional module name
 * @typeParam downloadSession?: string - Optional download Session name
 * @typeParam range?: IGenericRecord - Optional range of dates
 * @typeParam sort_by?: string - Optional string to indicate sort by
 * @typeParam concept_type?: string - Optional string to indicate concept type
 * @typeParam searched_by?: string - Optional string to indicate search
 * @typeParam date?: number - Optional number milliseconds date
 */
export interface IFileRequest {
    type: string;
    module: string;
    start_date?: string | number;
    finish_date?: string | number;
    route?: string;
    data: IGenericRecord;
    now?: Date;
    group?: string;
    supplier_name?: string;
    moduleName?: string;
    downloadSession?: string;
    range?: IGenericRecord;
    sort_by?: string;
    concept_type?: string;
    searched_by?: string;
    date?: number;
}

/**
 * This interface defines file url request props
 *
 * @typeParam type: string - File's type
 * @typeParam module: string - File's module name
 * @typeParam url: string - File's url with information to download
 */
export interface IFileUrlRequest {
    type: string;
    module: string;
    url: string;
}

/**
 * This interface defines structure when get File
 *
 * @typeParam id: string - File' id
 * @typeParam url: string - File' url saved
 * @typeParam type: string - Optional File' type local
 * @typeParam file_type: string - File' type
 * @typeParam file_original_name: string - File name
 * @typeParam name: string - Optional File name
 * @typeParam preview_url: string - Optional Path of the pdf to display
 * @typeParam invoice_pdf_url: string - Optional Path of the pdf to display
 * @typeParam supporting_document_preview_url: string - Optional Path of the pdf to display
 * @typeParam supporting_document_pdf_url: string - Optional Path of the pdf to display
 */
export interface IFileResponse {
    id: string;
    url: string;
    type?: string;
    file_type: string;
    file_original_name: string;
    name?: string;
    preview_url?: string;
    invoice_pdf_url?: string;
    supporting_document_preview_url?: string;
    supporting_document_pdf_url?: string;
}
