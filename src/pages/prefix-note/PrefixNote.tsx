import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import useModal from '@hooks/useModal';
import usePermissions from '@hooks/usePermissions';
import useScrollToError from '@hooks/useScrollToError';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { getPrefixCompany } from '@redux/electronic-invoice/actions';
import { postPrefixNotesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { TitleButtons } from '@constants/Buttons';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { PREFIX as newPrefix } from '@constants/PrefixNote';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { KeyModals, MODALS, TYPES_NOTE } from '@constants/PrefixNote';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, ValidateClassName } from '@constants/ElectronicInvoice';
import { Source } from '@constants/Onboarding';
import { INFORMATION_PAGE } from '@information-texts/PrefixNote';
import { buttonsFooterProps } from '@utils/Button';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { Tabs } from '@components/tabs';
import { ModalType } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TablePrefix } from './components';
import { IParamAssign, IPrefixNote, UTILS } from '.';
import './PrefixNote.scss';

const PrefixNote: React.FC = () => {
    const [
        history,
        dispatch,
        { filterTypeNote, validatePrefixes, validateMessages, TYPE, CHECK, PREFIX, Routes, getRoute, deleteAndAssignPrefixes },
        { SAVE, DELETE },
    ] = [useHistory(), useDispatch(), UTILS, KeyModals];
    const { scrollToInput } = useScrollToError();
    const { disabledInputs } = usePermissions();

    const prefixes = useSelector((state: RootState) => state.electronicInvoice.storePrefix);
    const { id } = useSelector((state: RootState) => state.company.information || { id: '' });

    const [tab, setTab] = useState<number>(0);
    const [submit, setSubmit] = useState<boolean>(false);
    const [adjustmentNote, setAdjustmentNote] = useState<IPrefixNote[]>([]);
    const [creditDebitNote, setCreditDebitNote] = useState<IPrefixNote[]>([]);

    const { activeModal, toggleModal } = useModal({ ...MODALS });

    const { handlePostConfirmation } = useOnboardingNavigation(Source.ElectronicDocuments);

    const { errorAdjustmentNote, errorNote } = useMemo(
        () => ({
            errorNote: submit ? validateMessages(creditDebitNote) : [],
            errorAdjustmentNote: submit ? validateMessages(adjustmentNote) : [],
        }),
        [submit, adjustmentNote, creditDebitNote]
    );

    const handleGetPrefixes = async (): Promise<void> => {
        await dispatch(
            getPrefixCompany({
                types: [DEBIT_NOTE, CREDIT_NOTE, ADJUSTMENT_NOTE],
                with_prefixes: true,
            })
        );
    };

    const handleValue = ({ value, prefix, item, name }: IParamAssign): IPrefixNote => {
        if (prefix.id === item.id) {
            return {
                ...item,
                [name]: value,
                isChange: typeof value === VARIABLE_TYPE.BOOLEAN ? item.isChange : true,
            };
        }
        return prefix;
    };

    const handleInput = ({ target: { value } }: ChangeEvent, item: IPrefixNote): void => {
        if (!tab) {
            setCreditDebitNote(
                creditDebitNote.map(prefix => handleValue({ prefix, item, value, name: PREFIX as keyof IPrefixNote }))
            );
            return;
        }
        setAdjustmentNote(adjustmentNote.map(prefix => handleValue({ prefix, item, value, name: PREFIX as keyof IPrefixNote })));
    };

    const handleSelect = ({ id = '', value: prefixName }: IOptionSelect, item: IPrefixNote): void => {
        if (!tab) {
            setCreditDebitNote(
                creditDebitNote.map(prefix =>
                    handleValue({
                        prefix,
                        value: id,
                        name: TYPE as keyof IPrefixNote,
                        item: { ...item, type_name: prefixName },
                    })
                )
            );
            return;
        }
        setAdjustmentNote(
            adjustmentNote.map(prefix =>
                handleValue({ prefix, item: { ...item, type_name: prefixName }, value: id, name: TYPE as keyof IPrefixNote })
            )
        );
    };

    const handleCheckBox = ({ target: { checked } }: ChangeEvent, item: IPrefixNote): void => {
        if (!tab) {
            setCreditDebitNote(
                creditDebitNote.map(prefix => handleValue({ prefix, item, value: checked, name: CHECK as keyof IPrefixNote }))
            );
            return;
        }
        setAdjustmentNote(
            adjustmentNote.map(prefix => handleValue({ prefix, item, value: checked, name: CHECK as keyof IPrefixNote }))
        );
    };

    const handleDelete = (): void => {
        if (!tab) setCreditDebitNote(deleteAndAssignPrefixes(creditDebitNote));
        else setAdjustmentNote(deleteAndAssignPrefixes(adjustmentNote));
        handleModalDelete();
    };

    const addPrefix = (): void => {
        if (tab) {
            setAdjustmentNote([
                ...adjustmentNote,
                {
                    ...newPrefix,
                    id: uuid(),
                    isChange: true,
                    company_id: id,
                    type: ADJUSTMENT_NOTE,
                    type_name: TYPES_NOTE[ADJUSTMENT_NOTE],
                },
            ]);
            return;
        }
        setCreditDebitNote([...creditDebitNote, { ...newPrefix, id: uuid(), company_id: id }]);
    };

    const handleSave = async (): Promise<void> => {
        setSubmit(true);
        if (!validatePrefixes(adjustmentNote, true) && !validatePrefixes(creditDebitNote, true)) {
            setSubmit(false);
            await dispatch(
                postPrefixNotesCompanyAction([
                    ...adjustmentNote.filter(({ isChange }) => isChange),
                    ...creditDebitNote.filter(({ isChange }) => isChange),
                ])
            );
            handleGetPrefixes();
            handleModalSave();
        } else {
            scrollToInput(ValidateClassName.PrefixNote);
        }
    };

    const handleModalSave = (): void => toggleModal(SAVE);
    const handleModalDelete = (): void => toggleModal(DELETE);

    useEffect(() => {
        dispatch(getInformationCompany());
        handleGetPrefixes();
    }, []);

    useEffect(() => {
        setAdjustmentNote(filterTypeNote(prefixes, [ADJUSTMENT_NOTE]));
        setCreditDebitNote(filterTypeNote(prefixes, [DEBIT_NOTE, CREDIT_NOTE]));
    }, [prefixes]);

    const handleNextRoute = (): void => {
        handlePostConfirmation(() => history.push(getRoute(Routes.GENERATE_DEBIT_NOTE)));
    };

    return (
        <>
            {activeModal && (
                <ModalType
                    moduleId={`${ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}-prefix`}
                    {...(activeModal === SAVE
                        ? {
                              iconName: 'check',
                              finalAction: handleModalSave,
                              handleClosed: handleModalSave,
                          }
                        : {
                              iconName: 'trash',
                              finalAction: handleDelete,
                              handleClosed: handleModalDelete,
                              otherButton: { textButton: TitleButtons.CANCEL, onClick: handleModalDelete },
                          })}
                    text={INFORMATION_PAGE[activeModal]}
                    open
                />
            )}
            <div className="flex flex-col h-full xs:px-2">
                <PageTitle title="Documentos electrónicos" pageContent={UTILS.SUPPORT_DOCUMENTS_SUBTITLE} />
                <BreadCrumb routes={UTILS.BREAD_CRUMB} />
                <Information
                    title={MODULE_TITLES.NOTE}
                    classNameTitle="font-allerbold text-26lg leading-8"
                    classNameSubContainer="justify-center mb-4.5"
                    color="blue"
                />
                <h1 className="text-lg text-blue font-allerbold leading-lg mb-4.5">{UTILS.TITLE_PAGE}</h1>
                <div className="w-full text-base text-gray-dark mb-4.5">{INFORMATION_PAGE.DESCRIPTION}</div>
                <div className="flex-1">
                    <Tabs
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `prefix-tabs`,
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        indexTab={tab}
                        setIndexTab={setTab}
                        tabs={[
                            {
                                label: INFORMATION_PAGE.TITLE_CREDIT_DEBIT_NOTE,
                                content: (
                                    <TablePrefix
                                        data={submit ? (validatePrefixes(creditDebitNote) as IPrefixNote[]) : creditDebitNote}
                                        onChangeCheckBox={handleCheckBox}
                                        handleDelete={handleModalDelete}
                                        onChangeSelect={handleSelect}
                                        onChangeInput={handleInput}
                                        typeNote={DEBIT_NOTE}
                                        addPrefix={addPrefix}
                                        errors={errorNote}
                                    />
                                ),
                            },
                            {
                                label: INFORMATION_PAGE.TITLE_ADJUSTMENT_NOTE,
                                content: (
                                    <TablePrefix
                                        data={submit ? (validatePrefixes(adjustmentNote) as IPrefixNote[]) : adjustmentNote}
                                        onChangeCheckBox={handleCheckBox}
                                        handleDelete={handleModalDelete}
                                        onChangeSelect={handleSelect}
                                        errors={errorAdjustmentNote}
                                        onChangeInput={handleInput}
                                        typeNote={ADJUSTMENT_NOTE}
                                        addPrefix={addPrefix}
                                    />
                                ),
                            },
                        ]}
                    />
                </div>
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        history,
                        handleNextRoute,
                        { name: '', moduleName: '' },
                        TitleButtons.NEXT,
                        getRoute(Routes.ELECTRONIC_DOCUMENTS_GENERATED)
                    )}
                    onClickButtonCenter={handleSave}
                    threeButtons
                    disabledCenter={disabledInputs}
                />
            </div>
        </>
    );
};

export default PrefixNote;
