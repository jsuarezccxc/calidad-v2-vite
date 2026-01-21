import React, { useMemo } from 'react';
import { IOptionSelect, SelectSearchInput } from '@components/input';
import { Icon } from '@components/icon';
import {
    LEGAL_PERSON,
    NATURAL_PERSON,
    NATURAL_PERSON_MERCHANT,
    OTHERS,
    SELF_RETAINING,
    SIMPLE_REGIMEN,
} from '@constants/DynamicRequest';
import { WITHHOLDINGS, NATURAL_RESPONSIBILITIES, FIVE } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { formatString } from '@utils/Date';
import { toggleWithholdings } from '@utils/ElectronicInvoice';
import { DEFAULT_RESPONSIBILITY } from '@utils/Company';
import { numericsInput } from '@utils/SpecialCharacters';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { Withholdings, ResolutionFields, ITaxResponsibilitiesProps, DATE, TOOLTIP_DATA } from '.';
import './TaxResponsibilities.scss';

export const TaxResponsibilities: React.FC<ITaxResponsibilitiesProps> = ({
    data,
    handleDataChange,
    fiscalOptions = [],
    validate = false,
    isClient = false,
}) => {
    const { fiscal_responsibilities: responsibilities = [], person_type: personType } = data;

    const isNaturalPerson = personType === NATURAL_PERSON;

    const addResponsibility = (): void => {
        handleDataChange({ ...data, fiscal_responsibilities: [...responsibilities, DEFAULT_RESPONSIBILITY] });
    };

    const deleteResponsibility = (fieldIndex: number): void => {
        handleDataChange({
            ...data,
            fiscal_responsibilities: responsibilities.filter((_: IGenericRecord, index: number) => fieldIndex !== index),
        });
    };

    const handleOptionChange = (option: IOptionSelect, fieldIndex: number): void => {
        const newOption = { ...option, id: String(option.id) };
        handleDataChange({
            ...data,
            fiscal_responsibilities:
                option.value === SIMPLE_REGIMEN || (personType === LEGAL_PERSON && option.value === OTHERS)
                    ? [newOption]
                    : responsibilities.map((item: IGenericRecord, index: number) => (index === fieldIndex ? newOption : item)),
        });
    };

    const handleResolutionChange = ({ value, name }: IGenericRecord, itemIndex: number): void => {
        handleDataChange({
            ...data,
            fiscal_responsibilities: responsibilities.map((item: IGenericRecord, index: number) => ({
                ...item,
                [name]: itemIndex === index ? (name === DATE ? formatString(value) : numericsInput(value)) : item[name],
            })),
        });
        DATE;
    };

    const getResponsibilitiesPerPerson = (options: IOptionSelect[]): IOptionSelect[] => {
        return isNaturalPerson ? options.filter(({ value }) => NATURAL_RESPONSIBILITIES.includes(value)) : options;
    };

    const getAvailableOptions = (): IOptionSelect[] => {
        const allOptions = fiscalOptions
            ?.flatMap(option =>
                responsibilities.every(({ name }: IGenericRecord) => name !== option?.name)
                    ? [{ ...option, withholdings: WITHHOLDINGS }]
                    : []
            )
            .filter(({ id }) => (data?.person_type === NATURAL_PERSON_MERCHANT ? String(id) !== String(FIVE) : id));

        return getResponsibilitiesPerPerson(allOptions);
    };

    const selectRetention = (retention: string, itemIndex: number): void => {
        handleDataChange({
            ...data,
            fiscal_responsibilities: responsibilities.map(({ withholdings, ...item }: IGenericRecord, index: number) => ({
                ...item,
                withholdings: index === itemIndex ? toggleWithholdings(withholdings, retention) : withholdings,
            })),
        });
    };

    const availableOptions = useMemo(() => getAvailableOptions(), [fiscalOptions, responsibilities, personType]);

    const disableButton = (): boolean => {
        return (
            !personType ||
            isNaturalPerson ||
            (personType === LEGAL_PERSON && responsibilities.some((item: IGenericRecord) => item.name === OTHERS)) ||
            responsibilities.some((item: IGenericRecord) => !item.name || item.name === SIMPLE_REGIMEN) ||
            responsibilities?.length === availableOptions?.length
        );
    };

    const taxResponsabilitiesOptionsRender = availableOptions?.map((item: IGenericRecord) => ({
        ...item,
        id: item.id,
        code: item.code,
        name: item.name,
        value: item.value,
    }));

    return (
        <div className="tax-responsibilities">
            <div className="flex flex-col gap-4.5">
                {responsibilities.map(
                    ({ name, withholdings, date, number_resolution: resolutionNumber = '' }: IGenericRecord, index: number) => {
                        const requiresResolution = validate && !String(resolutionNumber);
                        return (
                            <div key={Symbol(`responsibility${index}`).toString()}>
                                <div className={`flex flex-col lg:flex-row lg:items-${requiresResolution ? 'center' : 'end'}`}>
                                    <SelectSearchInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `fiscal-responsabilities-${index}`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        optionSelect={taxResponsabilitiesOptionsRender}
                                        onChangeSelect={(_, option): void => handleOptionChange(option, index)}
                                        labelText={`${!isClient ? '*' : ''}Responsabilidad fiscal:`}
                                        classesWrapper="tax-responsibilities__field"
                                        value={name}
                                        disabled={!personType}
                                        required={validate && !name}
                                        {...(!index && TOOLTIP_DATA)}
                                    />
                                    {name && !NATURAL_RESPONSIBILITIES.includes(name) && (
                                        <div className="flex items-end gap-2 lg:ml-7">
                                            <ResolutionFields
                                                data={{ date, resolutionNumber }}
                                                handleChange={(option: IGenericRecord): void =>
                                                    handleResolutionChange(option, index)
                                                }
                                                requiredResolution={requiresResolution}
                                            />
                                            {!!index && (
                                                <Icon
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `fiscal-responsabilities-${index}`,
                                                        action: ActionElementType.TRASH,
                                                        elementType: ElementType.ICO,
                                                    })}
                                                    className="w-5 h-5 mb-2 cursor-pointer"
                                                    name="trashBlue"
                                                    onClick={(): void => deleteResponsibility(index)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {name === SELF_RETAINING && (
                                    <Withholdings
                                        selectRetention={(name): void => selectRetention(name, index)}
                                        validate={validate}
                                        withholdings={withholdings}
                                    />
                                )}
                            </div>
                        );
                    }
                )}
            </div>
            <button className="tax-responsibilities__button" disabled={disableButton()} onClick={addResponsibility} type="button">
                +Agregar adicional
            </button>
        </div>
    );
};
