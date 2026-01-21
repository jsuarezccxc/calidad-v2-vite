import { useDispatch } from 'react-redux';
import { getFile } from '@redux/user/actions';
import { getInvoice } from '@redux/rejected-invoices/actions';
import { downloadXml } from '@redux/electronic-invoice/actions';
import { urls } from '@api/urls';

/**
 * This interface describes the properties that the useInvoice hook return
 *
 * @typeParam downloadExcel: (id: string, fileName: string) => Promise<void> - Function for download the excel
 * @typeParam downloadXML: (fileId: string) => Promise<void> - Function for download xml
 */
interface IUseInvoice {
    downloadExcel: (id: string, fileName: string) => Promise<void>;
    downloadXML: (fileId: string) => Promise<void>;
}

/**
 * Custom hook that download the invoice files
 *
 * @returns IUseInvoice
 */
const useInvoice = (): IUseInvoice => {
    const dispatch = useDispatch();

    const downloadExcel = async (invoiceId: string, fileName: string): Promise<void> => {
        const invoice = await dispatch(getInvoice(invoiceId, true));
        dispatch(getFile(invoice, fileName, urls.getFile));
    };

    const downloadXML = async (fileId: string): Promise<void> => {
        await dispatch(downloadXml(fileId));
    };

    return {
        downloadExcel,
        downloadXML,
    };
};

export default useInvoice;
