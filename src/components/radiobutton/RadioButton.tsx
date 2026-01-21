import React from 'react';
import { useTranslation } from 'react-i18next';
import { NO } from '@constants/RadioButtonOptions';
import { LANGUAGE_KEY } from '@constants/Translate';
import { SelectInput } from '@components/input';
import { ActionElementType, ElementType, generateId } from '@utils/GenerateId';
import { ChangeEvent, IRadioButtonProps, IEntity, ITableRadioButton, RADIO_BUTTON_LABELS } from '.';
import { RadioTooltip } from './RadioTooltip';
import './RadioButton.scss';

export const RadioButton: React.FC<IRadioButtonProps> = ({
    moduleId,
    entities,
    selected,
    setSelected = (): void => {},
    size = 'sm',
    sizeLabel,
    classesContainer = '',
    classesRadioButton = '',
    classesRadioInput = '',
    classesLabel = '',
    disabled = false,
    handleRow = (): void => {},
    handleChangeOption = (): void => {},
    name = '',
    linkerId,
    bgInputDark = false,
    radioColDirection = false,
    bgCircle = 'gray-light',
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const handleChange = (e: ChangeEvent): void => setSelected(e.target.name);

    const handleChangeRow = (e: ChangeEvent): void => {
        if (e.target.name === NO) handleRow();
    };

    const getBackground = (name: string): string => {
        return name === selected ? 'blue' : !bgInputDark ? bgCircle : 'gray';
    };
    const getChecked = (name: string): boolean => name === selected;
    const flexDirection = radioColDirection
        ? 'col'
        : size === 'xl' || (size === 'md' && 'col') || 'row' || (size === 'md-row' && 'row');

    const getLabelText = (text: string): string => {
        const translationKey = RADIO_BUTTON_LABELS.find(({ value }) => value === text.toLowerCase());
        return translationKey ? translate(`radio-button.${translationKey.name}`).toUpperCase() : text;
    };

    return (
        <div className={`flex flex-col md:gap-0 gap-5 md:flex-${flexDirection} ${classesContainer}`}>
            {entities?.map((entity: IEntity, key: number) => {
                const idRadioButton = linkerId ? `${linkerId} - ${key}` : entity.name;
                return (
                    <React.Fragment key={entity.name}>
                        <div
                            id={generateId({
                                module: moduleId,
                                submodule: `radio-btn-${entity.name}`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.RDO,
                            })}
                            className={`radiobutton radiobutton-${size} ${classesRadioButton} w-full lg:w-auto ${
                                !radioColDirection ? 'mr-7' : ''
                            }`}
                        >
                            <input
                                type="checkbox"
                                className={`radiobutton__input ${classesRadioInput}  ${
                                    size === 'md-row' ? 'radiobutton-md__input' : ''
                                } bg-${getBackground(entity.name)}`}
                                checked={getChecked(entity.name)}
                                name={entity.name}
                                id={generateId({
                                    module: moduleId,
                                    submodule: idRadioButton,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.RDO,
                                })}
                                onChange={(e: ChangeEvent): void => {
                                    handleChange(e);
                                    handleChangeRow(e);
                                    handleChangeOption(entity, name);
                                }}
                                disabled={disabled}
                            />
                            <label
                                className={`relative flex-1 lg:flex-auto radiobutton__label radiobutton__label-${
                                    sizeLabel ?? size
                                } ${classesLabel} ${entity.labelClass || ''}`}
                                htmlFor={idRadioButton}
                            >
                                {entity.labelElement ?? getLabelText(entity.label)}
                                {entity.tooltip && (
                                    <RadioTooltip descTooltip={entity.descTooltip} titleTooltip={entity.titleTooltip} />
                                )}
                            </label>
                            {entity.selectItems && (
                                <div className="hidden ml-4 md:block">
                                    <SelectInput
                                        id={generateId({
                                            module: moduleId,
                                            submodule: `radio-btn-${entity.selectItems}`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        placeholder="Seleccione"
                                    />
                                </div>
                            )}
                        </div>
                        {entity.selectItems && (
                            <div className="mt-2 ml-6 md:hidden sm:block">
                                <SelectInput
                                    id={generateId({
                                        module: moduleId,
                                        submodule: `radio-btn-${entity.selectItems}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    placeholder="Seleccione"
                                    classesWrapper="w-full"
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export const TableRadioButton: React.FC<ITableRadioButton> = ({
    size = 'sm',
    classesContainer = '',
    classesRadioButton = '',
    disabled = false,
    onChange = (): void => {},
    name = '',
    selectedTable = {},
    option = {},
}) => {
    const getBackground = (id: string): string => (id === selectedTable.id ? 'bg-blue border-none' : '');
    const getChecked = (id: string): boolean => id === selectedTable.id;
    const flexDirection = size === 'xl' || (size === 'md' && 'col') || 'row';

    return (
        <div className={`flex flex-col md:gap-0 gap-5 md:flex-${flexDirection} ${classesContainer}`}>
            <div className={`radiobutton radiobutton-${size} ${classesRadioButton}`}>
                <input
                    type="checkbox"
                    className={`radiobutton__input ${getBackground(option.id)}  `}
                    checked={getChecked(option.id)}
                    onChange={onChange}
                    name={name}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
