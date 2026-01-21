import React from 'react';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { TitleButtons } from '@constants/Buttons';
import { ModalCustom } from '@components/modal-custom';
import { MoneyInput, TextInput } from '@components/input';
import { PURCHASING_PROCESS_TEXTS } from '@information-texts/PurchasingProcess';
import { IGenericRecord } from '@models/GenericRecord';
import { FIELDS } from '@pages/purchasing-process';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';

export const PurchaseModals: React.FC<{
    showModalInfoCompanyFreePlan: boolean;
    setShowModalInfoCompanyFreePlan: (showModalInfoCompanyFreePlan: boolean) => void;
    dataFreePlanCompany: IGenericRecord;
    handleChangeInputFreeDocument: (e: React.ChangeEvent<HTMLInputElement>) => void;
    requiredField: IGenericRecord;
    statement: boolean;
    setStatement: (statement: boolean) => void;
    showModalFreePlanResponse: {
        approved: boolean;
        rejected: boolean;
        planAlreadyActive: boolean;
        planAlreadyPurchasedThisYear: boolean;
    };
    validateFreeDocumentPlan: () => void;
    handleValidateModalFreePlan: () => void;
}> = ({
    showModalInfoCompanyFreePlan,
    setShowModalInfoCompanyFreePlan,
    dataFreePlanCompany,
    handleChangeInputFreeDocument,
    requiredField,
    statement,
    setStatement,
    showModalFreePlanResponse,
    validateFreeDocumentPlan,
    handleValidateModalFreePlan,
}) => {
    const isModalResponseFreePlanVisible =
        showModalFreePlanResponse?.approved ||
        showModalFreePlanResponse?.rejected ||
        showModalFreePlanResponse?.planAlreadyActive ||
        showModalFreePlanResponse?.planAlreadyPurchasedThisYear;

    const getModalContent = (): IGenericRecord => {
        if (showModalFreePlanResponse?.planAlreadyActive) {
            return PURCHASING_PROCESS_TEXTS.PLAN_ALREADY_ACTIVE;
        }
        if (showModalFreePlanResponse?.planAlreadyPurchasedThisYear) {
            return PURCHASING_PROCESS_TEXTS.PLAN_ALREADY_PURCHASED_THIS_YEAR;
        }
        if (showModalFreePlanResponse?.approved) {
            return PURCHASING_PROCESS_TEXTS.APPLICATION_APPROVED;
        }
        return PURCHASING_PROCESS_TEXTS.APPLICATION_NOT_APPROVED;
    };

    const getClassesDinamic = (): string => {
        return `modalDataCompanyResponse--container ${
            showModalFreePlanResponse?.planAlreadyActive || showModalFreePlanResponse?.planAlreadyPurchasedThisYear ? 'small' : ''
        }`.trim();
    };

    const { title, description } = getModalContent();

    return (
        <>
            <ModalCustom
                id={generateId({
                    module: ModuleApp.PURCHASING_PROCESS,
                    submodule: 'modal-info-company-free-plan',
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showModalInfoCompanyFreePlan}
                showModal={(): void => {
                    setShowModalInfoCompanyFreePlan(!showModalInfoCompanyFreePlan);
                }}
                closeIcon={false}
                classesWrapper="modalDataCompany--container"
                classesModal="modalDataCompany--container"
            >
                <Icon
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'modal-info-company-free-plan',
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.ICO,
                    })}
                    name="closeBlue"
                    onClick={(): void => {
                        setShowModalInfoCompanyFreePlan(!showModalInfoCompanyFreePlan);
                    }}
                    className="icon-closeModal"
                    alt="close-modal"
                />
                <div className="flex w-full mb-4 sm:ml-8 xs:justify-center">
                    <h3
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'modal-info-company-free-plan.title',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="text-xl text-left xs:text-center font-allerbold leading-xl text-blue"
                    >
                        Detalle de la empresa
                    </h3>
                </div>

                <div className="modalDataCompany--container__info">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'modal-info-company-free-plan-number-employees',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={FIELDS.NUMBER_EMPLOYEES}
                        placeholder="..."
                        labelText="*Número de empleados de la empresa:"
                        value={String(dataFreePlanCompany.numberEmployees ?? '')}
                        onlyNumbers={true}
                        onChange={handleChangeInputFreeDocument}
                        required={requiredField.numberEmployees.error}
                    />
                    <MoneyInput
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'modal-info-company-free-plan-total-revenue',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={FIELDS.TOTAL_REVENUE}
                        placeholder="..."
                        labelText="*Ingresos de la empresa en el año anterior:"
                        value={dataFreePlanCompany.totalRevenue ?? ''}
                        onChange={handleChangeInputFreeDocument}
                        required={requiredField.totalRevenue.error}
                        classesInput="w-73"
                        classesWrapper="w-73"
                        maxLength={11}
                    />
                    <div className="flex mt-4">
                        <Checkbox
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'modal-info-company-free-plan-terms-check-box',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.CHK,
                            })}
                            name={FIELDS.ACCEPT_CHECKBOX}
                            checked={statement}
                            onChange={(): void => {
                                setStatement(!statement);
                            }}
                            classCheck="checkmark-light"
                            classContainer="small-check-box w-2"
                        />
                        <p className="text-base leading-4 font-aller text-gray-dark">
                            Declaro que la información anteriormente suministrada es veraz.
                        </p>
                    </div>
                    {requiredField.accept_checkbox.error && (
                        <label className="self-end text-tiny text-purple mr-1.5 mb-4 text-right justify-self-end w-full block">
                            {requiredField.accept_checkbox.text}
                        </label>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'modal-info-company-free-plan-validate',
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        text={TitleButtons.ACCEPT}
                        onClick={validateFreeDocumentPlan}
                        classes="m-auto shadow-templateDesign"
                    />
                </div>
            </ModalCustom>

            {isModalResponseFreePlanVisible && (
                <ModalCustom
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'modal-response-free-plan',
                        action: ActionElementType.INFO,
                        elementType: ElementType.MDL,
                    })}
                    show={isModalResponseFreePlanVisible}
                    showModal={(): void => {}}
                    closeIcon={false}
                    classesWrapper={getClassesDinamic()}
                    classesModal={getClassesDinamic()}
                >
                    <div className="modalDataCompanyResponse--container__info">
                        <div className="flex flex-col items-center justify-center mt-6 text-center">
                            <Icon
                                id={generateId({
                                    module: ModuleApp.PURCHASING_PROCESS,
                                    submodule: 'modal-response-free-plan',
                                    action: ActionElementType.CLOSE,
                                    elementType: ElementType.ICO,
                                })}
                                name={showModalFreePlanResponse.approved ? 'check' : 'cancelMulticolor'}
                                className="w-22.2"
                                alt="info-modal"
                            />
                            <h3
                                id={generateId({
                                    module: ModuleApp.PURCHASING_PROCESS,
                                    submodule: 'modal-response-free-plan-title',
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.TXT,
                                })}
                                className="mt-2 text-xl font-allerbold leading-xl text-blue"
                            >
                                {title}
                            </h3>
                        </div>
                        <div
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'modal-response-free-plan-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="mb-6 text-base font-normal text-center leading-base text-gray-dark"
                        >
                            {description}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'modal-response-free-plan',
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            text={TitleButtons.ACCEPT}
                            onClick={handleValidateModalFreePlan}
                            classes="m-auto shadow-templateDesign"
                        />
                    </div>
                </ModalCustom>
            )}
        </>
    );
};
