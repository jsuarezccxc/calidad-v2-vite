import React, { useEffect } from 'react';
import { RootState } from '@redux/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import fileDownload from 'js-file-download';
import { useHistory } from 'react-router-dom';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { Information } from '@components/information';
import { PageTitle } from '@components/page-title';
import { Button } from '@components/button';
import { BreadCrumb } from '@components/bread-crumb';
import { TitleButtons } from '@constants/Buttons';
import { downloadIconsProps } from '@pages/warehouse-control-report';
import { InvoiceViewer } from '@components/invoice-viewer';
import useParam from '@hooks/useParam';
import { ID } from '@constants/BuildProduct';
import { routes } from '.';

const ViewInvoice: React.FC = () => {
    const [history, dispatch, { queryParam }] = [useHistory(), useDispatch(), useParam(ID)];
    const { invoiceCorrection } = useSelector((state: RootState) => state.correctionBusinessDocument);

    useEffect(() => {
        dispatch(getSpecificDocument(queryParam));
    }, []);

    const handleDownloadExcel = (url: string): void => {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                fileDownload(blob, 'Documento electronico.xlsx');
            });
    };

    const download = (): void => {
        handleDownloadExcel(invoiceCorrection.invoice_excel_url);
    };

    return (
        <>
            <div className="h-full mb-2">
                <div>
                    <PageTitle title="Facturación electrónica" />
                    <BreadCrumb routes={routes()} />
                    <Information title="Visualización de documento electrónico" />
                </div>
                <InvoiceViewer
                    isPDF
                    invoicePDFUrl={invoiceCorrection?.invoice_pdf_url}
                    download={downloadIconsProps(download).download}
                />
            </div>
            <div className="flex items-end justify-end text-right mt-7 xs:mb-8 xs:flex xs:items-center xs:justify-center">
                <Button text={TitleButtons.BACK} background={'gray-light'} onClick={(): void => history.goBack()} />
            </div>
        </>
    );
};

export default ViewInvoice;
