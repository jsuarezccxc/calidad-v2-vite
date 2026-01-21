import React, { useMemo } from 'react';
import { SelectSearchOption } from 'react-select-search';
import { Icon } from '@components/icon';
import { SelectSearchInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { FieldName, TOOLTIP_DATA, IEconomicActivitiesProps, SELECT_INPUT_PROPS, MAX_CIIUS } from '.';

export const EconomicActivities: React.FC<IEconomicActivitiesProps> = ({ data, handleDataChange, options, validate }) => {
    const { disabledInputs } = usePermissions();
    const { ciius } = data;
    const addEconomyActivity = (): void => {
        handleDataChange({
            ...data,
            ciius: [...ciius, { id: '', code: '', name: '' }],
        });
    };

    const deleteActivity = (fieldIndex: number): void => {
        handleDataChange({
            ...data,
            ciius: ciius.filter((_: IGenericRecord, index: number) => fieldIndex !== index),
        });
    };

    const handleOptionChange = (option: IGenericRecord, fieldIndex: number): void => {
        handleDataChange({
            ...data,
            ciius: ciius.map((item: IGenericRecord, index: number) => ({
                is_main: !index,
                ...(index === fieldIndex ? { ...option, ciiu_id: option.id } : item),
            })),
        });
    };

    const getAvailableOptions = (): SelectSearchOption[] => {
        return options?.filter(option => ciius.every(({ name }: IGenericRecord) => name !== option?.name));
    };

    const availableOptions = useMemo(() => getAvailableOptions(), [options, ciius]);

    return (
        <div>
            <div className="flex gap-4.5 flex-col">
                {ciius.map(({ name }: IGenericRecord, index: number) => (
                    <div className="flex items-end gap-2" key={`activity${index}`}>
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.COMPANY_INFORMATION}-ciius-${index}`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*CIIU - Actividad económica:"
                            optionSelect={availableOptions}
                            valueSelect={name}
                            onChangeSelect={(_, option): void => handleOptionChange(option, index)}
                            classesWrapper={`company-information__activity-field ${name ? 'select--dark-placeholder' : ''}`}
                            classNameMain="w-full lg:w-auto"
                            required={validate && !name}
                            {...(name && { placeholder: name })}
                            {...TOOLTIP_DATA[FieldName.EconomicActivity]}
                            {...SELECT_INPUT_PROPS}
                        />
                        {!!index && !disabledInputs && (
                            <Icon
                                className="w-5.5 h-5.5 mb-2 cursor-pointer"
                                name="trashBlue"
                                onClick={(): void => deleteActivity(index)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <button
                disabled={ciius.length >= MAX_CIIUS || disabledInputs}
                className="company-information__button"
                type="button"
                onClick={addEconomyActivity}
            >
                +Agregar adicional
            </button>
        </div>
    );
};
