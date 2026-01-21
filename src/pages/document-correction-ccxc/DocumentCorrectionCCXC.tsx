import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { ID } from '@constants/UtilsConstants';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { getGeneralInvoices } from '@redux/correction-business-document/actions';
import { RootState } from '@redux/rootReducer';
import useSearch from '@hooks/useSearch';
import useParam from '@hooks/useParam';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { TableByCCXC } from './components';
import { breadCrumb } from '.';
import './DocumentCorrectionCCXC.scss';

const DocumentCorrectionCCXC: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const { queryParam } = useParam(ID);

    const { generalInvoices } = useSelector((state: RootState) => state.correctionBusinessDocument);
    const { resultData, setResultData } = useSearch(generalInvoices, ['number']);

    useEffect(() => {
        dispatch(getGeneralInvoices(true));
    }, []);

    useEffect(() => {
        if (queryParam) setResultData(generalInvoices?.filter(invoice => invoice.id === queryParam) || []);
    }, [queryParam, generalInvoices]);

    return (
        <>
            <div className="document-correction-ccxc">
                <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={SUPPORT_DOCUMENTS_TITLE} />
                <BreadCrumb routes={breadCrumb()} />
                <h3 className="w-full font-bold text-center font-allerbold text-26lg text-blue mb-7">{MODULE_TITLES.NOTE}</h3>
                <Information
                    title={getRouteName(Routes.DOCUMENT_CORRECTION_CCXC)}
                    description="A continuación, visualice el documento electrónico emitido por el empresario que ha requerido corrección por parte de CCxC."
                />
                <div className="flex flex-col mt-4.5">
                    <TableByCCXC data={resultData} />
                </div>
            </div>
            <div className="flex items-end justify-end my-0 text-right xs:flex xs:items-center xs:justify-center">
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.ELECTRONIC_DOCUMENTS,
                        history,
                        getRoute(Routes.REPORT_ELECTRONIC_DOCUMENTS),
                        {
                            name: getRouteName(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
                            moduleName: getRouteName(Routes.ELECTRONIC_INVOICE),
                        }
                    )}
                />
            </div>
        </>
    );
};

export default DocumentCorrectionCCXC;
