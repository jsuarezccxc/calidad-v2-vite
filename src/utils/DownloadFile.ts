import { IDownloadIconsProps } from '@components/icon';
import { XLSX, PDF } from '@constants/DownloadFile';
import { IGenericRecord } from '@models/GenericRecord';
import { IFileRequest, IFileUrlRequest } from '@models/File';
import { IDates } from '@models/Date';
import { getDateFromUnix } from './Date';
import { ModuleApp } from './GenerateId';

/**
 * Function that return the request file for download the pdf and excel
 *
 * @param downloadFile: (icon: string) => void - Function for download files
 * @param moduleId: string - Optional param with the module name in kebab-case (e.g., "electronic-document")
 * @param className: string - Optional param with a className for customize the icons
 * @returns IDownloadIconsProps
 */
export const downloadIconsProps = (
    downloadFile: (icon: string) => void,
    moduleId: string,
    className?: string
): IDownloadIconsProps => ({
    download: {
        excel: (): void => downloadFile(XLSX),
        pdf: (): void => downloadFile(PDF),
    },
    moduleId,
    className,
});

/**
 * Function that return the request file for download the pdf and excel
 *
 * @param type: string - File's type
 * @param module: string - File's module
 * @param data: IGenericRecord - File's data
 * @param dates: IDates - Optional file's dates
 * @param formattedData: boolean - Optional param that indicates if return the formatted date
 * @param group: string - Optional param additional
 * @returns IFileRequest
 */
export const getRequestFile = (
    type: string,
    module: string,
    data: IGenericRecord,
    dates?: IDates,
    formattedData = false,
    group?: string,
    supplier_name?: string
): IFileRequest => {
    return {
        type,
        module,
        group,
        data,
        start_date: formattedData ? getDateFromUnix(dates?.start_date)?.formattedDate : dates?.start_date,
        finish_date: formattedData ? getDateFromUnix(dates?.finish_date)?.formattedDate : dates?.finish_date,
        supplier_name: supplier_name || '',
    };
};

/**
 * Function that return the request file for download the pdf and excel of a file with url
 *
 * @param type: string - File's type
 * @param module: string - File's module
 * @param url: string - File's url
 * @returns IFileUrlRequest
 */
export const getRequestFileUrl = (type: string, module: string, url: string): IFileUrlRequest => {
    return {
        type,
        module,
        url,
    };
};

/**
 * Function that return the request file for download the excel
 *
 * @param downloadExcel: () => void - Function for download files
 * @returns IDownloadIconsProps
 */
export const downloadExcelProps = (downloadExcel: () => void): IDownloadIconsProps => ({
    moduleId: ModuleApp.OTHERS,
    download: {
        excel: downloadExcel,
        pdf: (): void => {},
    },
});

/**
 * Function to download a file from a response.
 *
 * @param response - IGenericRecord: The response object containing the file as a blob.
 * @param fileName - string: The name file.
 */
export const previewFile = async (response: IGenericRecord, fileName: string): Promise<void> => {
    const blob = response instanceof Blob ? response : await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
