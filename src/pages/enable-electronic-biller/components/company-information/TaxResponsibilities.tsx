import React, { useMemo } from 'react';
import { IOptionSelect, SelectInput } from '@components/input';
import { Icon } from '@components/icon';
import { FILE_INDEX } from '@constants/File';
import { NATURAL_PERSON, SELF_RETAINING, SIMPLE_REGIMEN } from '@constants/DynamicRequest';
import { WITHHOLDINGS, NATURAL_RESPONSIBILITIES, DEFAULT_RESPONSIBILITY } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { formatString } from '@utils/Date';
import { toggleWithholdings } from '@utils/ElectronicInvoice';
import { numericsInput } from '@utils/SpecialCharacters';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import {
    FieldName,
    TOOLTIP_DATA,
    Withholdings,
    ResolutionFields,
    ITaxResponsibilitiesProps,
    DATE,
    FIRST_POSITION,
    SELECT_INPUT_PROPS,
} from '.';

export const TaxResponsibilities: React.FC<ITaxResponsibilitiesProps> = ({ data, handleDataChange, fiscalOptions, validate }) => {
    const { fiscal_responsibilities: responsibilities = [], person_type: personType } = data;

    const { disabledInputs } = usePermissions();

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
        handleDataChange({
            ...data,
            fiscal_responsibilities:
                option.value === SIMPLE_REGIMEN
                    ? [option]
                    : responsibilities.map((item: IGenericRecord, index: number) => (index === fieldIndex ? option : item)),
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
        return isNaturalPerson ? options?.filter(({ value }) => NATURAL_RESPONSIBILITIES.includes(value)) : options;
    };

    const getAvailableOptions = (): IOptionSelect[] => {
        const allOptions = fiscalOptions?.flatMap(option =>
            responsibilities.every(({ name }: IGenericRecord) => name !== option?.name)
                ? [{ ...option, withholdings: WITHHOLDINGS }]
                : []
        );

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
            disabledInputs ||
            !personType ||
            isNaturalPerson ||
            responsibilities.some((item: IGenericRecord) => !item.name || item.name === SIMPLE_REGIMEN) ||
            responsibilities?.length === availableOptions?.length
        );
    };

    return (
        <div>
            <div className="flex flex-col gap-4.5">
                {responsibilities.length ? (
                    responsibilities.map(
                        (
                            { name, withholdings, date, number_resolution: resolutionNumber = '' }: IGenericRecord,
                            index: number
                        ) => {
                            const requiresResolution = validate && !resolutionNumber;
                            return (
                                <div key={Symbol(`responsibility${index}`).toString()}>
                                    <div
                                        className={`flex flex-col lg:flex-row lg:items-${requiresResolution ? 'center' : 'end'}`}
                                    >
                                        <SelectInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.COMPANY_INFORMATION}-fiscal-responsabilities-${index}`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            labelText="*Responsabilidad fiscal:"
                                            options={availableOptions}
                                            optionSelected={(option): void => handleOptionChange(option, index)}
                                            classesWrapper="company-information__field"
                                            value={name.length > 36 ? name.slice(0, 36) : name}
                                            disabled={!personType || disabledInputs}
                                            required={validate && !name}
                                            {...(!index && TOOLTIP_DATA[FieldName.Responsibilities])}
                                            {...SELECT_INPUT_PROPS}
                                        />
                                        {!!index && name && NATURAL_RESPONSIBILITIES.includes(name) && (
                                            <Icon
                                                className="w-5.5 h-5.5 mb-2 ml-2 cursor-pointer"
                                                name="trashBlue"
                                                onClick={(): void => deleteResponsibility(index)}
                                            />
                                        )}

                                        {name && !NATURAL_RESPONSIBILITIES.includes(name) && (
                                            <div className="flex items-end gap-2 lg:ml-7">
                                                <ResolutionFields
                                                    data={{ date, resolutionNumber }}
                                                    handleChange={(option): void => handleResolutionChange(option, index)}
                                                    requiredResolution={requiresResolution}
                                                />
                                                {!!index && !disabledInputs && (
                                                    <Icon
                                                        className="w-5.5 h-5.5 mb-2 cursor-pointer"
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
                    )
                ) : (
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.COMPANY_INFORMATION}-fiscal-responsabilities`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Responsabilidad fiscal:"
                        options={availableOptions}
                        classesWrapper="company-information__field"
                        disabled={!personType || disabledInputs}
                        optionSelected={(option): void => {
                            handleOptionChange(option, FIRST_POSITION);
                        }}
                        required={(validate && !responsibilities.length) || (validate && !responsibilities?.[FILE_INDEX]?.name)}
                        {...SELECT_INPUT_PROPS}
                    />
                )}
            </div>
            <button className="company-information__button" disabled={disableButton()} onClick={addResponsibility} type="button">
                +Agregar adicional
            </button>
        </div>
    );
};
