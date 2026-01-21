import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import useParam from '@hooks/useParam';
import useModal from '@hooks/useModal';
import usePermissions from '@hooks/usePermissions';
import useScrollToError from '@hooks/useScrollToError';
import { useModalWarningSupplier } from '@hooks/useModalWarningSupplier';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { storeSupportDocument } from '@redux/support-document/actions';
import { getSuppliers, postStoreSupplier, putUpdateSupplier } from '@redux/suppliers/actions';
import { getUtilsData } from '@redux/correction-business-document/actions';
import {
    getInvoicesAvailable,
    getPrefixCompany,
    getUniqueProductStock,
    setInvoiceCalculations,
} from '@redux/electronic-invoice/actions';
import { setSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getFilesCompanyAction, postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getTodaysTime } from '@utils/Date';
import { isCorrectResponse } from '@utils/Response';
import { validateDocument } from '@utils/ElectronicNote';
import { ModuleApp } from '@utils/GenerateId';
import { ISupplier } from '@models/Supplier';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupportDocument } from '@models/SupportDocument';
import { IValidateInFunction, IValidateNote } from '@models/CorrectCancelElectronicDocument';
import { TitleButtons } from '@constants/Buttons';
import { INITIAL_SUPPLIER } from '@constants/Supplier';
import { SUPPORT_DOCUMENT } from '@constants/SupportDocument';
import { INIT_VALIDATE } from '@constants/CorrectCancelElectronicDocument';
import { INVOICE_CALCULATES, TypeFile, ValidateClassName } from '@constants/ElectronicInvoice';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';
import { Direction, DOC, DocsInstructionContext, TypeDoc } from '@pages/docs-instructions/context';
import { ModalType } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IOptionsSupportForm } from '@components/support-document-and-buy';
import { CreateSupplier, CreateSupportDocument } from './components';
import { IValidations, SupportContext } from './context';
import { UTILS, ModalKeys } from '.';
import './GenerateSupportDocument.scss';

const GenerateSupportDocument: React.FC<{ isInsertedPage?: boolean }> = ({ isInsertedPage = false }) => {
    const [dispatch, history, { queryParam }, location, { queryParam: IDSupplier }] = [
        useDispatch(),
        useHistory(),
        useParam(UTILS.VIEW),
        useLocation(),
        useParam(UTILS.ID),
    ];
    const { validateSupplier, modals, getRoute, Routes, KEYS_VALIDATE } = UTILS;
    const infoPage = UTILS.validateInfoPage(location.pathname + location.search);
    const { LOGO_SUPPORT } = TypeFile;
    const {
        userId,
        utilsData,
        company: { information },
        suppliers: { data: suppliers },
        electronicInvoice: { products, storePrefix },
    } = useSelector(({ electronicInvoice, correctionBusinessDocument, suppliers, session, company }: RootState) => ({
        company,
        electronicInvoice,
        userId: session.user?.id || '',
        suppliers: suppliers.suppliers,
        utilsData: correctionBusinessDocument.utilsData,
    }));
    const [reset, setReset] = useState<boolean>(false);
    const [submit, setSubmit] = useState<boolean>(false);
    const [cardFile, setCardFile] = useState<IGenericRecord>({});
    const [supplier, setSupplier] = useState<ISupplier>({ ...INITIAL_SUPPLIER, buy_responsible: userId });
    const [supportDocument, setSupportDocument] = useState<ISupportDocument>({ ...SUPPORT_DOCUMENT });
    const [stepInstructions, setStepInstructions] = useState<IGenericRecord | null>(null);
    const [invoice, setInvoice] = useState<string>('');
    const { activeModal, toggleModal } = useModal({ ...UTILS.STATE_MODAL });
    const optionsForm = useMemo<IOptionsSupportForm>(() => UTILS.buildOptionsPage(utilsData, storePrefix, suppliers), [
        utilsData,
        storePrefix,
        suppliers,
    ]);
    const { scrollToInput } = useScrollToError();
    const { disabledInputs } = usePermissions();
    const modalWarning = useModalWarningSupplier();
    const { isExistEmail } = modalWarning;

    useEffect(() => {
        dispatch(setSpecificDocument({}));
        dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        return (): void => {
            dispatch(setSpecificDocument({}));
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    useEffect(() => {
        if (information) setStepInstructions(information.step_instructions);
    }, [information]);

    useEffect(() => {
        if (!isInsertedPage && stepInstructions && (!stepInstructions[TypeDoc.SD] || !stepInstructions[TypeDoc.SD]?.isComplete)) {
            history.push(`${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=${TypeDoc.SD}`);
        }
    }, [stepInstructions]);

    const validations = useMemo<IValidations>(
        () => ({
            supplierError: submit ? (validateSupplier(supplier, !IDSupplier && isExistEmail) as string[]) : [],
            supportError:
                submit && !queryParam
                    ? (validateDocument(supportDocument, KEYS_VALIDATE) as IValidateNote)
                    : { ...INIT_VALIDATE },
        }),
        [submit, supplier, supportDocument]
    );

    const createSupplier = async (): Promise<void> => {
        const isCorrectResponse: IGenericRecord = await dispatch(
            postStoreSupplier({
                ...supplier,
                fiscal_responsibilities: supplier.fiscal_responsibilities.map(fiscal => ({ ...fiscal, id: String(fiscal.id) })),
                taxpayer: supplier.type_taxpayer_name,
                cellphone: supplier.phone,
            })
        );
        if (isCorrectResponse) {
            await dispatch(getSuppliers(true));
            setSupplier({ ...INITIAL_SUPPLIER, buy_responsible: userId });
            toggleModal(ModalKeys.SAVE_SUPPLIER);
            setSubmit(false);
        }
    };

    const editSupplier = async (): Promise<void> => {
        const statusCode: IGenericRecord = await dispatch(
            putUpdateSupplier(IDSupplier, {
                ...supplier,
                id: IDSupplier,
                cellphone: supplier.phone,
                taxpayer: supplier.type_taxpayer_name,
                company_id: information?.id,
            })
        );
        if (isCorrectResponse(Number(statusCode))) {
            await dispatch(getSuppliers(true));
            setSupplier({ ...INITIAL_SUPPLIER, buy_responsible: userId });
            toggleModal(ModalKeys.SAVE_SUPPLIER);
            setSubmit(false);
        }
    };

    const handleSupplier = (): void => {
        if (validateSupplier(supplier, !IDSupplier && isExistEmail, true)) {
            scrollToInput();
            return setSubmit(true);
        }
        if (IDSupplier) {
            editSupplier();
            return;
        }
        createSupplier();
    };

    const handleSaveSupport = async (isDraft = false): Promise<void> => {
        const { form, details, retentions } = validateDocument(supportDocument, KEYS_VALIDATE, true) as IValidateInFunction;
        if (form || details || retentions) {
            if (form) scrollToInput();
            if (!form && details) scrollToInput(ValidateClassName.ElectronicDocument);
            return setSubmit(true);
        }
        if (cardFile?.type) {
            await dispatch(postFileCompanyAction(cardFile as Blob, LOGO_SUPPORT));
        }
        const response: IGenericRecord = await dispatch(
            storeSupportDocument({
                ...UTILS.formatRequestData(supportDocument, products),
                preview: false,
                is_draft: isDraft,
                time_issue: getTodaysTime(),
                loader_inventory: true,
            })
        );
        if (isCorrectResponse(Number(response?.statusCode))) {
            setInvoice(response?.data?.id);
            toggleModal(ModalKeys.SAVE_SUPPORT);
            getData();
            dispatch(setSpecificDocument({}));
            setSupportDocument({ ...SUPPORT_DOCUMENT });
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
            setCardFile({});
            setSubmit(false);
            setReset(true);
        }
    };

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getInformationCompany()),
            dispatch(getUniqueProductStock(UTILS.PRODUCT_TYPE)),
            dispatch(getPrefixCompany(UTILS.PREFIX_TYPE)),
            dispatch(getFilesCompanyAction(LOGO_SUPPORT)),
            dispatch(getInvoicesAvailable()),
        ]);
    };

    const handleFinalAction = (): void => {
        if (queryParam) {
            toggleModal(ModalKeys.SAVE_SUPPLIER);
            return history.push(getRoute(Routes.GENERATE_SUPPORT_DOCUMENT));
        }
        toggleModal(ModalKeys.SAVE_SUPPORT);
        history.push(
            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${invoice}&type=${TYPE_NAVIGATION.CREATED_SUPPORT_DOCUMENT}`
        );
    };

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getSuppliers()), dispatch(getUtilsData()), getData()]);
        })();
        return (): void => {};
    }, []);

    useEffect(() => {
        setSubmit(false);
    }, [queryParam]);

    let goBack = (): void => {
        setSupplier({ ...INITIAL_SUPPLIER, buy_responsible: userId });
        if (IDSupplier) {
            return history.push(getRoute(Routes.GENERATE_SUPPORT_DOCUMENT));
        }
        history.goBack();
    };

    if (isInsertedPage) {
        const { getNextStepRoute } = useContext(DocsInstructionContext);
        goBack = (): void => {
            getNextStepRoute(Direction.PREV);
        };
    }

    const stepNameButton = (): string => {
        if (window.location.pathname === getRoute(Routes.DOCS_INSTRUCTIONS)) return TitleButtons.PREV_STEP;
        return TitleButtons.BACK;
    };

    return (
        <SupportContext.Provider
            value={{
                reset,
                setReset,
                supportDocument,
                setSupportDocument,
                supplier,
                setSupplier,
                optionsForm,
                products,
                submit,
                utilsData,
                validations,
                cardFile,
                setCardFile,
                modalWarning,
                IDSupplier,
            }}
        >
            {activeModal && (
                <ModalType
                    moduleId={ModuleApp.SUPPORT_DOCUMENT}
                    open
                    finalAction={handleFinalAction}
                    {...modals((): void => toggleModal(''))[activeModal]}
                />
            )}
            {!isInsertedPage && (
                <>
                    <PageTitle {...UTILS.PAGE_TITLE} />
                    <BreadCrumb routes={infoPage.routes} />
                    <Information
                        classNameTitle="font-allerbold text-26lg leading-8"
                        classNameSubContainer="justify-center mb-4.5"
                        title={infoPage.subTitle}
                        color="blue"
                    />
                </>
            )}
            {queryParam ? <CreateSupplier /> : <CreateSupportDocument />}
            <PageButtonsFooter
                moduleId={ModuleApp.SUPPORT_DOCUMENT}
                className="custom-footer-button"
                onClickButtonLeft={goBack}
                {...(queryParam
                    ? { ...UTILS.footerSupplier(IDSupplier), onClickButtonRight: handleSupplier }
                    : {
                          ...UTILS.FOOTER_SUPPORT(stepNameButton),
                          onClickButtonRight: (): void => {
                              handleSaveSupport();
                          },
                          onClickButtonCenter: (): void => {
                              handleSaveSupport(true);
                          },
                      })}
                disabledCenter={disabledInputs}
                disabledRight={disabledInputs}
            />
        </SupportContext.Provider>
    );
};

export default GenerateSupportDocument;
