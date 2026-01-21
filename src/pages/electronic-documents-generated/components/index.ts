import { IGenericRecord } from '@models/GenericRecord';
import { IPaginatorBackend } from '@components/paginator-backend/index';

export { DocumentTable } from './DocumentTable';
export { TableFooter } from './TableFooter';
export { TableHeader } from './TableHeader';

/**
 * This interface describes the props of the document table
 *
 * @typeParam data: IGenericRecord[] - Table data
 * @typeParam downloadFile: (type: string) => void - Function to download file
 * @typeParam paginatorBack: IPaginatorBackend<IGenericRecord> - Paginator props
 * @typeParam isLoadingTable?: Boolean - Optional prop indicating when loading data for render skeleton
 */
export interface IDocumentTableProps {
    data: IGenericRecord[];
    downloadFile: (type: string) => void;
    paginatorBack: IPaginatorBackend<IGenericRecord>;
    isLoadingTable?: boolean;
}
