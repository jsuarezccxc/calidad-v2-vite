import React from 'react';
import { DatePickerMonthInput, NumberInput, SelectInput, TextInput } from '@components/input';
import { CARD_TYPES } from '@constants/PaymentPlans';
import { buildOptions } from '@utils/Company';
import { getUnixFromDate } from '@utils/Date';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { FIELDS, IInformationCard } from '.';
import './InformationCard.scss';

export const InformationCard: React.FC<IInformationCard> = ({ dynamicData, formData, handleChange, errorsData }) => {
    const {
        name,
        documentType,
        documentNumber,
        email,
        numberCard,
        expirationDate,
        securityCode,
        typeCard,
        placeholders,
    } = FIELDS;
    const { date: datePlaceholder, dots, select: selectPlaceholder } = placeholders;

    return (
        <div
            id={generateId({
                module: ModuleApp.PAYMENT_METHODS,
                submodule: 'information-card-method',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CRD,
            })}
            className="information-card"
        >
            <label className="information-card--title">Información de la tarjeta</label>
            <div className="fields__card">
                <div>
                    <TextInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-name',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={name}
                        placeholder={dots}
                        classesInput="input--width"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        onChange={(e): void => handleChange(e.target.value, 'name')}
                        value={formData.name}
                        required={!!errorsData.name}
                        requiredText={errorsData.name}
                    />
                </div>
                <div>
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-document-type',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText={documentType}
                        placeholder={selectPlaceholder}
                        selectIconType="arrowDownGreen"
                        contectSelect="input--width"
                        classesWrapperInput="input--width"
                        options={buildOptions(dynamicData?.document_types)}
                        optionSelected={(e): void => handleChange(e.value, 'documentType')}
                        value={formData.documentType}
                        required={!!errorsData.documentType}
                        requiredText={errorsData.documentType}
                    />
                </div>
                <div></div>
                <div>
                    <NumberInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-document-number',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={documentNumber}
                        placeholder={dots}
                        classesInput="input--width"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        onChange={(e): void => handleChange(e.target.value, 'documentNumber')}
                        value={formData.documentNumber}
                        required={!!errorsData.documentNumber}
                        requiredText={errorsData.documentNumber}
                        maxLength={10}
                    />
                </div>
                <div>
                    <TextInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={email}
                        placeholder={dots}
                        classesInput="input--width"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        onChange={(e): void => handleChange(e.target.value, 'email')}
                        value={formData.email}
                        required={!!errorsData.email}
                        requiredText={errorsData.email}
                    />
                </div>
                <div></div>
                <div>
                    <NumberInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-number-card',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={numberCard}
                        placeholder={dots}
                        classesInput="input--width"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        onChange={(e): void => handleChange(e.target.value, 'numberCard')}
                        value={formData.numberCard}
                        required={!!errorsData.numberCard}
                        requiredText={errorsData.numberCard}
                    />
                </div>
                <div>
                    <DatePickerMonthInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-expiration-date',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={expirationDate}
                        placeholder={datePlaceholder}
                        selectIconType="calendarGreen"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        showPlaceHolderDate
                        minDate={new Date()}
                        maxDate={new Date(2100, 11, 31)}
                        onChangeDate={(date): void => handleChange(getUnixFromDate(date), 'expirationDate')}
                        selected={formData.expirationDate}
                        required={!!errorsData.expirationDate}
                        requiredText={errorsData.expirationDate}
                    />
                </div>
                <div>
                    <NumberInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-security-code',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={securityCode}
                        placeholder={dots}
                        classesInput="input--width"
                        classesWrapperInput="input--width"
                        classesWrapper="xs:w-full"
                        onChange={(e): void => handleChange(e.target.value, 'securityCode')}
                        value={formData.securityCode}
                        required={!!errorsData.securityCode}
                        requiredText={errorsData.securityCode}
                        maxLength={3}
                    />
                </div>
                <div>
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'information-card-method-type-card',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText={typeCard}
                        placeholder={selectPlaceholder}
                        selectIconType="arrowDownGreen"
                        classesWrapper="input--width"
                        options={CARD_TYPES}
                        optionSelected={(e): void => handleChange(e.value, 'typeCard')}
                        value={formData.typeCard}
                        required={!!errorsData.typeCard}
                        requiredText={errorsData.typeCard}
                    />
                </div>
            </div>
        </div>
    );
};
