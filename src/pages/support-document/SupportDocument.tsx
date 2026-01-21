import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { validate as uuidValidate } from 'uuid';
import useParam from '@hooks/useParam';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ActionType } from '@constants/ActionType';
import { PREVIEW_DOCUMENT_SUPPORT } from '@constants/Supplier';
import { INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { ID } from '@constants/BuildProduct';
import { createNewJson } from '@utils/Json';
import LocalStorage from '@utils/LocalStorage';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { validateTableRetentions } from '@utils/ElectronicInvoice';
import { ModuleApp } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { uploadInvoice } from '@redux/suppliers/actions';
import { storeSupportDocument } from '@redux/support-document/actions';
import { getUniqueProductStock, setInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { SUPPORT_DOCUMENT } from '@information-texts/SupportDocumentAndBuy';
import { IFile } from '@components/input';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import {
    formatRequestProduct,
    validateDistributionWarehouse,
    validateFieldsSupport,
    validateProductsSupport,
} from '@components/support-document-and-buy';
import { ModalType } from '@components/modal-custom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import {
    SUPPORTING_DOCUMENT,
    infoModalSave,
    routesBread,
    titleButton,
    TYPE_PAGE,
    formatRequestData,
    FILE,
    TYPES_FILE,
    INPUTS_STATE_ELECTRONIC_INVOICE,
} from '.';

const SupportDocument: React.FC = () => {
    const [history, { queryParam }, dispatch] = [useHistory(), useParam(ID), useDispatch()];
    const [showSendForm, setShowSendForm] = useState(infoModalSave);
    const [fieldInputs, setFieldInputs] = useState<IGenericRecord>({});
    const [file, setFile] = useState<IFile>(FILE.slice());
    const [showModalFile, setShowModalFile] = useState<boolean>(false);
    const { quantityInvoices } = useSelector((state: RootState) => state.electronicInvoice);

    useEffect(() => {
        handleInitAndResetData();
        return (): void => {
            handleInitAndResetData();
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    const handleInitAndResetData = (): void => LocalStorage.set(PREVIEW_DOCUMENT_SUPPORT, JSON.stringify(createNewJson({})));

    const onSubmitStoreSupportDocument = async (preview: boolean): Promise<void> => {
        if (!Number(quantityInvoices.number_invoice) && !quantityInvoices.is_unlimited) return;
        const { validateError } = validateDistributionWarehouse(fieldInputs?.products);
        if (!validateFieldsSupport(fieldInputs)) return;
        if (
            !validateProductsSupport(fieldInputs?.products) ||
            !validateError ||
            validateTableRetentions(fieldInputs.withholdings, fieldInputs.country_name).some(value => value)
        )
            return;
        const response: IGenericRecord = await dispatch(
            storeSupportDocument(
                formatRequestData({
                    ...fieldInputs,
                    products: formatRequestProduct(fieldInputs.products),
                    invoice_type: SUPPORTING_DOCUMENT,
                    preview,
                    document_type_sales_manager: null,
                    payment_method_id: fieldInputs.payment_method_id ? fieldInputs.payment_method_id : null,
                })
            )
        );
        if (isCorrectResponse(Number(response?.statusCode))) {
            LocalStorage.set(
                PREVIEW_DOCUMENT_SUPPORT,
                JSON.stringify({ ...fieldInputs, pdf_url: response?.data.invoice_pdf_url })
            );
            if (!preview) {
                const { prefix_name_associated: prefix, prefix_number_associated: number } = response.data;
                setFieldInputs({ ...INPUTS_STATE_ELECTRONIC_INVOICE, onSubmit: true });
                LocalStorage.set(PREVIEW_DOCUMENT_SUPPORT, JSON.stringify(SUPPORT_DOCUMENT));
                history.push(getRoute(Routes.SUPPORT_DOCUMENT));
                setShowSendForm({
                    prefix,
                    number,
                    show: true,
                });
                await dispatch(getUniqueProductStock());
                return;
            }
            history.push(`${getRoute(Routes.SUPPORT_DOCUMENT)}?id=${TYPE_PAGE.PREVIEW}`);
        }
    };

    const uploadFileSupport = async (): Promise<void> => {
        if (lengthGreaterThanZero(file[0].files) && TYPES_FILE.includes(file[0].files[0].type)) {
            await dispatch(uploadInvoice(file[0].files));
            setShowModalFile(!showModalFile);
            setFile(FILE.slice());
        }
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col">
                <ModalType
                    show={showSendForm.show}
                    showModal={(): void => {
                        setShowSendForm(infoModalSave);
                    }}
                    type={ActionType.SUCCESS_CORRECTION_INVOICE}
                    title={SUPPORT_DOCUMENT.MODAL_SAVE_TITLE}
                    text={SUPPORT_DOCUMENT.MODAL_SAVE_TEXT({ ...showSendForm })}
                    textButton="button.add"
                    otherAction={(): void => history.push(getRoute(Routes.HOME))}
                />
                <PageTitle title={getRouteName(Routes.SUPPORT_DOCUMENT_MENU)} />
                <BreadCrumb routes={routesBread(queryParam, uuidValidate(queryParam))} />
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.SUPPORT_DOCUMENT}
                className=""
                titleButtonLeft={TitleButtons.BACK}
                onClickButtonLeft={(): void => history.goBack()}
                titleButtonRight={titleButton(queryParam)}
                onClickButtonRight={(): Promise<void> =>
                    !queryParam || uuidValidate(queryParam)
                        ? onSubmitStoreSupportDocument(true)
                        : queryParam === TYPE_PAGE.SUPPORT
                        ? uploadFileSupport()
                        : onSubmitStoreSupportDocument(false)
                }
            />
        </div>
    );
};

export default SupportDocument;
