import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getDynamicData } from '@redux/warehouses/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getCurrentInvoice } from '@redux/correction-documents-client-employer/actions';
import { getInvoiceCalculations, setInvoiceCalculations } from '@redux/electronic-invoice/actions';
import usePopper from '@hooks/usePopper';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { IGenericRecord } from '@models/GenericRecord';
import { ICalculateInvoice } from '@models/ElectronicInvoice';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { ModuleApp } from '@utils/GenerateId';
import { VISUALIZATION_CORRECTION_DOCUMENT } from '@information-texts/VisualizationCorrectionDocument';
import {
    dataWithHoldings,
    formatMainDataTable,
    formatBussinesProducts,
    getTaxesAndRetentionFormat,
} from '@pages/correction-business-document/components/invoice-correction';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { TextInput } from '@components/input';
import { Tooltip } from '@components/tooltip';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Link, LinkColor } from '@components/button';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { acceptRejectionRoutes } from '../../';
import { headerViewTableCorrection } from '..';
import { VOIDED } from '.';

export const VisualizationCorrectionDocument: React.FC<IGenericRecord> = ({
    id,
    reasonRejection = 'otros',
    invoice,
    viewCorrection = false,
    invoiceView = {},
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        cancellationElectronicDocuments: { document },
        electronicInvoice: { products, invoiceCalculations },
    } = useSelector(
        ({
            electronicInvoice,
            correctionBusinessDocument,
            correctionDocumentsClientEmployer,
            cancellationElectronicDocuments,
        }: RootState) => ({
            electronicInvoice,
            correctionBusinessDocument,
            correctionDocumentsClientEmployer,
            cancellationElectronicDocuments,
        })
    );
    const {
        anchorEl,
        togglePopper,
        mouseProps: { onMouseLeave },
    } = usePopper();

    const [tableData, setTableData] = useState<IGenericRecord[]>([]);
    const [withHoldings, setwithHoldings] = useState<IGenericRecord[]>([]);
    const [valuesTotal, setValuesTotal] = useState<IGenericRecord>({ ...INVOICE_CALCULATES });
    const [recalculateTotals, setRecalculateTotals] = useState(false);

    useEffect(() => {
        return (): void => {
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getCurrentInvoice(id)),
                dispatch(getSpecificDocument(id)),
                dispatch(getDynamicData(['withholdings'])),
            ]);
        })();
    }, [id]);

    useEffect(() => {
        if (recalculateTotals) {
            getCalculate({
                withholdings: getTaxesAndRetentionFormat(withHoldings),
                sending_charge: stringToFloat(valuesTotal.total_charge_amount),
                products: formatBussinesProducts(tableData),
            });
            setRecalculateTotals(false);
        }
    }, [recalculateTotals]);

    useEffect(() => {
        if (invoiceCalculations) {
            setValuesTotal({ ...invoiceCalculations });
        }
    }, [invoiceCalculations]);

    useEffect(() => {
        setwithHoldings(dataWithHoldings(document?.withholdings, document?.invoice_details));
        setTableData(formatMainDataTable({ data: document?.invoice_details, products: products, primary: true }));
        setRecalculateTotals(true);
    }, [document]);

    useEffect(() => {
        setwithHoldings(dataWithHoldings(document?.withholdings, tableData));
    }, [tableData]);

    const getCalculate = (forCalculate: ICalculateInvoice): void => {
        dispatch(getInvoiceCalculations(forCalculate));
    };

    return (
        <>
            <div className="flex flex-col flex-1 h-full">
                <div className="flex flex-col">
                    <PageTitle title={SUPPORT_DOCUMENTS_TITLE} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
                    <BreadCrumb routes={acceptRejectionRoutes()} />
                    <h3 className="w-full font-bold text-center text-26lg font-allerbold mb-7 text-blue">{MODULE_TITLES.NOTE}</h3>
                    <h4 className="mb-2 text-lg font-bold text-gray-dark font-allerbold">
                        {VISUALIZATION_CORRECTION_DOCUMENT.CORRECTIONS_DOCUMENT}
                    </h4>
                    <div className="mb-4.5">
                        <div className="flex items-center cursor-pointer" onClick={togglePopper} onMouseLeave={onMouseLeave}>
                            <Icon name="purpleLight" className="w-5.5 h-5.5 mr-1" />
                            <p className="underline text-purple">{VISUALIZATION_CORRECTION_DOCUMENT.WHY_GENERATE_CORRECTION}</p>
                        </div>
                        <Tooltip
                            anchorEl={anchorEl}
                            iconName="light"
                            description={VISUALIZATION_CORRECTION_DOCUMENT.SUBMITTED_OBSERVATIONS}
                            placement="bottom-start"
                        />
                    </div>
                    <p className="pr-2 leading-5 text-gray-dark">{VISUALIZATION_CORRECTION_DOCUMENT.MAKE_CORRECTIONS}</p>
                </div>

                <div>
                    <div className="my-4.5">
                        <TextInput
                            value={invoiceView?.number || invoice.number}
                            labelText={VISUALIZATION_CORRECTION_DOCUMENT.ELECTRONIC_DOCUMENT}
                            name="document"
                            placeholder="FV 0004"
                            classesWrapper="mb-4.5 w-73"
                            classesWrapperInput="border-none"
                            disabled
                            tooltipInfo
                            titleTooltip={`${VISUALIZATION_CORRECTION_DOCUMENT.ELECTRONIC_DOCUMENT}:`}
                            descTooltip={VISUALIZATION_CORRECTION_DOCUMENT.SALES_INVOICE}
                        />
                        <div className="flex items-center xs:flex-col">
                            <div className="w-80">
                                <Table customTable data={[]} isNew headersTable={headerViewTableCorrection}>
                                    <tr>
                                        <td className="h-10 bg-white field-body--editable">
                                            <Text
                                                text={reasonRejection}
                                                type="text"
                                                disabled
                                                className="field-body--text"
                                                editTable={false}
                                                onChange={(): void => {}}
                                            />
                                        </td>
                                    </tr>
                                </Table>
                            </div>
                            {document?.invoice_state !== VOIDED && (
                                <div
                                    className={`${
                                        viewCorrection ? 'hidden' : 'flex'
                                    } lg:ml-4.5 text-sm font-allerbold h-full lg:mt-12 xs:mt-4.5`}
                                >
                                    <div
                                        className="px-3 py-1 text-center w-33.1 bg-white shadow-templateDesign rounded-md text-blue cursor-pointer"
                                        onClick={(): void => history.push(getRoute(Routes.GENERATE_DEBIT_NOTE))}
                                    >
                                        {VISUALIZATION_CORRECTION_DOCUMENT.DEBIT_NOTE}
                                    </div>
                                    <div
                                        className="bg-white text-center shadow-templateDesign ml-2 px-3 py-1 w-33.1 rounded-md text-blue cursor-pointer"
                                        onClick={(): void => history.push(getRoute(Routes.GENERATE_CREDIT_NOTE))}
                                    >
                                        {VISUALIZATION_CORRECTION_DOCUMENT.CREDIT_NOTE}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-gray-dark">
                    Para visualizar las notas generadas, haga click en el número de la nota o &nbsp;
                    <Link
                        href={getRoute(Routes.CORRECTED_DOCUMENTS)}
                        text="haciendo click aquí."
                        linkColor={LinkColor.PURPLE}
                        classes="text-base"
                    />
                </p>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${document?.invoice_id || document?.id}`,
                    {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    }
                )}
            />
        </>
    );
};
