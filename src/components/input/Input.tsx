import React, { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search';
import { ColorPicker, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import { v4 as uuid } from 'uuid';
import { LANGUAGE_KEY } from '@constants/Translate';
import { SHOW_DROPDOWN_OPTIONS } from '@constants/Options';
import { ID_CONTENT_TABLE } from '@constants/TableFieldType';
import { TIMEPICKER_HOURS, TIMEPICKER_MINUTES, SCHEDULE_AM, TIMEPICKER_SCHEDULES, TIMEPICKER_SECONDS } from '@constants/Time';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, ESCAPE_KEY } from '@constants/Keys';
import { EIGHT, ONE, ZERO } from '@constants/Numbers';
import {
    invalidChar,
    invalidCharNoDecimals,
    validateAlphanumeric,
    validateNumbers,
    validateLettersWithAccent,
    validateOnlyNumbers,
    validateOnlyNumbersOnPaste,
    validateAlphanumericNoWhitespace,
} from '@utils/Validation';
import { restProps } from '@utils/Props';
import { getHourValue } from '@utils/Date';
import { scrollByTable } from '@utils/Input';
import { removeDecimal } from '@utils/Decimals';
import { lengthGreaterThanZero } from '@utils/Length';
import { useOnClickOutside } from '@utils/ClickOutside';
import { getMbSize, validateFile, isValidExtension, validateSizeFile, getImageName } from '@utils/File';
import { lowerCase, removeAccents } from '@utils/Text';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { setDropdown } from '@redux/dropdown/actions';
import { RootState } from '@redux/rootReducer';
import usePopper from '@hooks/usePopper';
import useModalProps from '@hooks/useModalProps';
import { Tooltip } from '@components/tooltip';
import { ModalType } from '@components/modal-custom';
import { ChangeEvent } from '@components/radiobutton';
import { CheckboxValidate } from '@components/checkbox';
import { DatePickerBase } from '@components/date-picker';
import { Icon, Icon as IconComponent, IconsNames } from '@components/icon';
import { Form } from '@components/form';
import {
    IPropsInput,
    IOptionSelect,
    ITimePickerProps,
    NOT_VALUE,
    IFile,
    MAX_LENGTH_TEXT_AREA,
    DEFAULT_IMAGE_NAME,
    ITextAreaProps,
    ITextAreaIconsProps,
    DEFAULT_REQUIRED_TEXT,
    MAX_LENGTH_TEXT_INPUT,
    SIZE_IMAGE_LIMIT,
    ACCEPTED_FILES,
    IMAGE_ERROR,
    SIZE_MAX_MB,
    IMoneyInputProps,
    selectClassesWrapper,
    DEFAULT_OPTION,
} from '.';
import './Input.scss';

export const TextInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-text-input',
            action: ActionElementType.ACTION,
            elementType: ElementType.TXT,
        }),
        name,
        value = '',
        onChange = (): void => {},
        onKeyDown = (): void => {},
        onBlur = (): void => {},
        onPaste,
        placeholder = '',
        classesInput = '',
        disabled = false,
        type = 'text',
        alphanumeric = false,
        integerNumbers = false,
        onlyNumbers = false,
        maxLength = MAX_LENGTH_TEXT_INPUT,
        lettersWithAccent = false,
        decimalComma = false,
        noDecimals = false,
        limitCharacters = true,
        alphanumericNoWhitespace = false,
        icons = false,
        selectIconType,
        classIconSearch,
    } = props;

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (!onlyNumbers || (onlyNumbers && !validateOnlyNumbersOnPaste(event))) onChange(event);
    };

    return (
        <WrapperInput {...props}>
            <input
                id={id}
                type={type}
                autoComplete="off"
                name={name}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInput(e)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                    onKeyDown(e);
                    noDecimals && invalidCharNoDecimals.includes(e.key) && e.preventDefault();
                }}
                onKeyPress={(e): void => {
                    alphanumeric && validateAlphanumeric(e);
                    integerNumbers && validateNumbers(e);
                    onlyNumbers && validateOnlyNumbers(e);
                    lettersWithAccent && validateLettersWithAccent(e);
                    alphanumericNoWhitespace && validateAlphanumericNoWhitespace(e);
                }}
                onBlur={onBlur}
                onPaste={onPaste}
                placeholder={placeholder}
                disabled={disabled}
                className={`input ${classesInput} block ${icons && selectIconType ? 'pr-8' : ''}`}
                maxLength={limitCharacters ? maxLength : undefined}
                {...(limitCharacters && { maxLength })}
                {...(decimalComma && { pattern: '([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]' })}
            />
            {icons && selectIconType && (
                <div className={`w-5.5 h-5.5 flex items-center justify-center pointer-events-none absolute z-1 ${classIconSearch ?? 'top-7 right-0.5'} ${disabled ? 'hidden' : ''}`}>
                    <Icon
                        id={generateId({
                            module: ModuleApp.INPUT,
                            submodule: 'default-id-text-input',
                            action: ActionElementType.SEARCH,
                            elementType: ElementType.ICO,
                        })}
                        name={selectIconType}
                        className="w-2.5 h-2.5"
                    />
                </div>
            )}
        </WrapperInput>
    );
};

export const NumberInput: React.FC<IPropsInput> = props => {
    const {
        name,
        value,
        onChange = (): void => {},
        placeholder = '',
        classesInput = '',
        maxLength = MAX_LENGTH_TEXT_INPUT,
        disabled = false,
        integerNumbers = false,
        noDecimals = false,
        min = 1,
    } = props;
    return (
        <WrapperInput {...props}>
            <input
                autoComplete="off"
                name={name}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    if (maxLength + 1 === e.target.value?.length) return;
                    onChange(e);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={`input ${classesInput}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onKeyDown={(e: any): void => {
                    noDecimals
                        ? invalidCharNoDecimals.includes(e.key) && e.preventDefault()
                        : invalidChar.includes(e.key) && e.preventDefault();
                }}
                onKeyPress={(e): void => {
                    integerNumbers && removeDecimal(e);
                }}
                type="number"
                min={min}
                maxLength={maxLength}
            />
        </WrapperInput>
    );
};

export const SearchInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-search-input',
            action: ActionElementType.ACTION,
            elementType: ElementType.TXT,
        }),
        name,
        value,
        onChange,
        placeholder = '',
        disabled = false,
        classesInput = '',
        iconClassName = '',
        onlyNumbers = false,
        headerSearch = false,
        clearSearch = (): void => {},
        isNew = false,
        handleKeyChange = (): void => {},
        maxLength = MAX_LENGTH_TEXT_INPUT,
    } = props;

    const classSearch = isNew ? 'searchGreen' : 'searchGray';

    return (
        <WrapperInput {...props}>
            <input
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onKeyPress={(e): void => {
                    onlyNumbers && validateOnlyNumbers(e);
                }}
                onKeyDown={handleKeyChange}
                disabled={disabled}
                className={`input ${classesInput} text-gray-dark`}
                autoComplete="off"
                type="search"
                maxLength={maxLength}
            />
            <div className="icon-input-search">
                <IconComponent
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-select-input',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name={headerSearch && value ? 'cancelGray' : classSearch}
                    className={`${iconClassName} ${headerSearch && value ? 'w-6 h-6' : 'w-2.5 h-2.5'} text-red`}
                    onClick={clearSearch}
                />
            </div>
        </WrapperInput>
    );
};

export const PasswordInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-password-input',
            action: ActionElementType.ACTION,
            elementType: ElementType.TXT,
        }),
        name,
        value,
        onChange = (): void => {},
        placeholder = '',
        disabled = false,
        classesInput = '',
        maxLength = 120,
        classNameIcon,
        reference,
    } = props;

    const [viewPassword, setViewPassword] = useState(true);
    const typeEye = viewPassword ? 'eyeDisabledGreen' : 'eyeGreen';

    const iconName: IconsNames = disabled ? 'eyeDisabledGray' : typeEye;

    return (
        <WrapperInput {...props}>
            <input
                id={id}
                ref={reference}
                autoComplete="off"
                name={name}
                type={viewPassword ? 'password' : 'text'}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    onChange(e);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={`input ${classesInput}`}
                maxLength={maxLength}
            />
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-password-input',
                    action: ActionElementType.INFO,
                    elementType: ElementType.ICO,
                })}
                name={iconName}
                onClick={!disabled ? (): void => setViewPassword(!viewPassword) : (): void => {}}
                className={`${!disabled && 'cursor-pointer'} w-7 ${classNameIcon}`}
            />
        </WrapperInput>
    );
};

export const SelectInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-select-input',
            action: ActionElementType.ACTION,
            elementType: ElementType.DRP,
        }),
        options = [],
        disabled,
        value,
        showValue = false,
        placeholder = 'Seleccionar',
        placeholderColor = 'gray',
        optionSelected = (): void => {},
        classesInput = '',
        isTable = false,
        selectTextClass = '',
        clearOption = false,
        centerTextSelect = false,
        classListSelect = false,
        doubleValue = false,
        selectIconType = '',
        secondValue = '',
        idContentTable = ID_CONTENT_TABLE,
        isNewSelect = false,
        newSelectFields,
        onClickSelect = (): void => {},
        icons = false,
        messagesCustom = '',
        contectSelect = '',
        isPlanMembership = false,
        name,
        classScrollSelect = '',
        iconName = false,
        valueIconName = '',
        withFocus = true,
    } = props;

    const selectParentRef = useRef(null);

    const dispatch = useDispatch();

    /**
     * Allows div with all options for select
     */
    const [showOptions, setShowOptions] = useState(false);

    /**
     * Allows rotate arrow with animation
     */
    const [rotate, setRotate] = useState(false);
    /**
     * Allows save option selected
     */
    const [optionValue, setOptionValue] = useState({ key: '', value: '' });
    const [multipleValue, setMultipleValue] = useState({ key: '', value: '', secondValue: '' });
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-ONE);
    const [searchTerm, setSearchTerm] = useState('');
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
        if (clearOption) {
            if (doubleValue) {
                setMultipleValue({ key: '', value: '', secondValue: '' });
            }
            setOptionValue({ key: '', value: '' });
        }
    }, [clearOption]);

    useEffect(() => {
        selectValue();
    }, []);

    useEffect(() => {
        if (doubleValue) {
            setMultipleValue({ key: '', value: String(value), secondValue });
            return;
        }
        if (!value) {
            setOptionValue({ key: '', value: '' });
            return;
        }
        selectValue();
    }, [value]);

    useEffect(() => {
        isTable && options.length && dispatch(setDropdown(showOptions));
    }, [showOptions]);

    useEffect(() => {
        if (highlightedIndex >= ZERO && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [highlightedIndex]);

    useEffect(() => {
        if (showOptions) {
            setHighlightedIndex(ZERO);
        }
    }, [showOptions, searchTerm]);

    /**
     * function when clicked outside select
     */
    useOnClickOutside(selectParentRef, () => {
        setShowOptions(false);
        setRotate(false);
    });

    /**
     * Defines the value for showing in a select
     * @returns string | number
     */
    const selectValue = (): string | number => {
        if (value) {
            return value;
        }

        if (optionValue.value && !value) {
            return optionValue.value;
        }

        return placeholder;
    };

    /**
     * Execute functions when an option is clicked
     * @param option IOptionSelect
     */
    const onClickValue = (option: IOptionSelect): void => {
        setShowOptions(false);
        setRotate(false);
        isTable && dispatch(setDropdown(false));
        if (doubleValue) {
            setMultipleValue({
                key: option?.key,
                value: option?.value,
                secondValue: option?.valueText ?? '',
            });
        }
        setOptionValue({
            key: option?.key,
            value: option?.value,
        });
        optionSelected(option, name);
        setSearchTerm('');
    };

    const filteredOptions = options.filter(option => option?.value?.toLowerCase().includes(searchTerm.toLowerCase()));

    const valueSelect = selectValue();
    const text = valueSelect === NOT_VALUE ? placeholder : selectValue();

    const renderSelectValue = (): React.ReactElement => (
        <div className={`${iconName && valueIconName ? 'flex items-center' : ''}`}>
            {iconName && valueIconName && <img src={valueIconName} alt={valueIconName} className="w-5 ml-1.5" />}
            <p
                className={`text-sm input p-ellipsis pl-2 ${isTable ? 'xs:text-tiny text-left col-span-8' : 'xs:text-tiny'} ${
                    value || optionValue.value ? 'text-gray-dark' : `text-${placeholderColor}`
                } ${selectTextClass} leading-4 select__text`}
                title={String(text)}
            >
                {showValue ? value : text}
            </p>
        </div>
    );

    const renderSelectOption = (option: IOptionSelect, index: number): React.ReactElement =>
        isNewSelect ? (
            <li
                key={uuid()}
                className={`list-none options-custom ${index === highlightedIndex ? 'bg-blue-light' : ''}`}
                onClick={(): void => {
                    onClickValue(option);
                }}
                ref={(el: HTMLLIElement | null): HTMLLIElement | null => (optionRefs.current[index] = el)}
            >
                <span
                    className={`self-center ${!newSelectFields?.isEdit ? 'w-full' : 'w-9/12'} overflow-hidden text-sm leading-sm`}
                >
                    {option?.value}
                </span>
                {newSelectFields?.isEdit && option?.value !== 'No disponible' ? (
                    <div className="flex self-center">
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-select-input',
                                action: ActionElementType.EDIT,
                                elementType: ElementType.ICO,
                            })}
                            name="editBlue"
                            hoverIcon="editGreen"
                            className="w-4.25 h-4.25"
                            onClick={(): void => newSelectFields?.editClick(option.id)}
                        />
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-select-input',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            hoverIcon="trashGreen"
                            className="w-4.25 h-4.25"
                            onClick={(): void => newSelectFields?.trashClick(option.id)}
                        />
                    </div>
                ) : (
                    ''
                )}
            </li>
        ) : (
            <li
                key={uuid()}
                className={`option list-none ${iconName ? 'px-1 flex items-center gap-x-1.5' : 'px-4'} ${
                    option?.containerOption
                } ${index === highlightedIndex ? 'bg-blue-light' : ''}`}
                onMouseDownCapture={(e): void => {
                    e.isPropagationStopped();
                    onClickValue(option);
                }}
                ref={(el: HTMLLIElement | null): HTMLLIElement | null => (optionRefs.current[index] = el)}
            >
                {iconName && <img src={option.code} alt={option.code} className="w-5" />}
                {option?.value}
            </li>
        );

    const renderSelectOptionsDouble = (option: IOptionSelect): React.ReactElement => {
        return (
            <li
                key={uuid()}
                onClick={(): void => {
                    onClickValue(option);
                }}
                className="list-none bg-black option hover:bg-blue"
            >
                <div className={option.classDoubleText}>
                    {option?.isButton ? (
                        <div className={`${option.classTypeFont} input-button`}>{option.value}</div>
                    ) : (
                        <>
                            <span
                                className={`${option.classTypeFont} ${option.classTypeFont}-span leading-3 ${
                                    option.classTexts ?? ''
                                }`}
                            >
                                {option.value}
                            </span>
                            <p className={`${option.classTypeFont} ${option.classTypeFont}-text ${option.classTexts ?? ''}`}>
                                {option.valueText}
                            </p>
                        </>
                    )}
                </div>
            </li>
        );
    };

    const renderCurrentValue = (doubleValue: boolean, multipleValue: string, multipleSecond: string): React.ReactElement =>
        doubleValue && multipleValue && multipleSecond ? (
            <>
                <p className="pb-0.5 pt-1 leading-3 text-tiny md:text-sm text-gray-dark xs:py-0">{multipleValue}</p>
                <p className="pt-0.5 -mt-1 text-tiny md:text-sm text-gray-dark xs:pt-0">{multipleSecond}</p>
            </>
        ) : (
            renderSelectValue()
        );

    const classListOptions = (): string => {
        const defaultClasses = 'scroll-options-container select-custom absolute w-full top-full';
        const classList = classListSelect ? 'list-position' : '';
        const display = showOptions ? 'block' : 'hidden';
        const showDropdownOptions =
            options.length > SHOW_DROPDOWN_OPTIONS ? `scroll-select bg-green-scrollbar ${classScrollSelect}` : '';
        const classesNewSelect = isNewSelect ? 'hidden-scroll-select' : '';

        return `${defaultClasses} ${classList} ${display} ${classesInput} ${showDropdownOptions} ${classesNewSelect}`;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!showOptions) return;

        if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + ONE) % filteredOptions.length);
        } else if (e.key === ARROW_UP_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - ONE + filteredOptions.length) % filteredOptions.length);
        } else if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (highlightedIndex >= ZERO && highlightedIndex < filteredOptions.length) {
                onClickValue(filteredOptions[highlightedIndex]);
            }
        }
    };

    const classesSelectParent = (): {
        containerClasses: string;
        classesRenderValue: string;
        iconArrowClasses: string;
        classNewSelect: string;
    } => {
        const classesDisabled = disabled ? 'cursor-default' : 'cursor-pointer';
        const containerClasses = `flex flex-col justify-center w-full ${classesDisabled}`;

        const tableStyle = isTable || centerTextSelect ? 'w-full text-center' : '';
        const classesRenderValue = `w-full overflow-hidden ${tableStyle}`;

        const rotationClass = rotate && !isTable ? 'rotate-180' : 'rotate-0';
        const disabledClass = disabled && selectIconType ? 'hidden' : '';
        const iconArrowClasses = `w-5.5 h-5.5 transition duration-200 transform cursor-pointer ${rotationClass} ${disabledClass}`;

        const classNewSelect = isNewSelect ? 'scroll-options bg-green-scrollbar w-full' : '';

        return {
            containerClasses,
            classesRenderValue,
            iconArrowClasses,
            classNewSelect,
        };
    };

    const { classesWrapper, classesWrapperInput } = selectClassesWrapper(props, {
        showOptions,
        isTable,
        value: optionValue.value,
    });

    return (
        <WrapperInput
            {...{
                ...props,
                classesWrapper,
                isPlanMembership,
                classesWrapperInput,
            }}
        >
            <div className={classesSelectParent().containerClasses} ref={selectParentRef}>
                <div
                    tabIndex={ZERO}
                    onKeyDown={handleKeyDown}
                    onClick={(): void => {
                        if (!disabled) {
                            isTable &&
                                filteredOptions.length &&
                                scrollByTable(!showOptions, setDropdown, dispatch, idContentTable);
                            setShowOptions(!showOptions);
                            setRotate(!rotate);
                            onClickSelect();
                        }
                    }}
                    className={`flex flex-row items-center justify-between select-sub-container ${contectSelect}`}
                    id={id}
                >
                    <div className={classesSelectParent().classesRenderValue}>
                        {options.length > EIGHT ? (
                            <input
                                type="text"
                                value={showOptions ? searchTerm : value || optionValue.value || ''}
                                onChange={(e): void => {
                                    setSearchTerm(e.target.value);
                                    if (!showOptions) {
                                        setShowOptions(true);
                                        setRotate(true);
                                    }
                                }}
                                className={`w-full text-sm bg-transparent cursor-pointer outline-none pl-2 ${
                                    disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-dark'
                                }`}
                                disabled={disabled}
                                onKeyDown={handleKeyDown}
                                autoFocus={withFocus}
                            />
                        ) : (
                            renderCurrentValue(doubleValue, multipleValue.value, multipleValue.secondValue)
                        )}
                    </div>
                    <IconComponent
                        id={generateId({
                            module: ModuleApp.INPUT,
                            submodule: 'default-id-select-input',
                            action: ActionElementType.ARROW_DOWN,
                            elementType: ElementType.ICO,
                        })}
                        name={selectIconType || 'arrowDownGray'}
                        className={classesSelectParent().iconArrowClasses}
                    />
                </div>
                <ul className={classListOptions()} id="style-option">
                    <div className={classesSelectParent().classNewSelect}>
                        {icons ? (
                            <span className="select-message">
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.INPUT,
                                        submodule: 'default-id-select-input',
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ICO,
                                    })}
                                    name="infoBlue"
                                    hoverIcon="infoEditWhite"
                                    className="rotate-180"
                                />
                                <span className="leading-4 text-gray-dark">{messagesCustom}</span>
                            </span>
                        ) : (
                            filteredOptions?.map((option: IOptionSelect, index: number) => {
                                return option?.doubleText ? renderSelectOptionsDouble(option) : renderSelectOption(option, index);
                            })
                        )}
                    </div>
                    {isNewSelect && (
                        <li
                            className="py-2 pb-0 text-sm text-center underline align-text-bottom border-none cursor-pointer d-flex text-green leading-sm"
                            onClick={(): void => newSelectFields?.footerClick()}
                        >
                            {newSelectFields?.nameFooter}
                        </li>
                    )}
                </ul>
            </div>
        </WrapperInput>
    );
};

export const SelectInputWithFooter: React.FC<IPropsInput> = props => {
    const {
        disabled,
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-select-input-footer',
            action: ActionElementType.ACTION,
            elementType: ElementType.DRP,
        }),
        onClickSelect = (): void => {},
        wrapperSelect,
        value = '',
        selectIconType,
        placeholder = 'Seleccionar',
        options = [],
        onClickValue = (): void => {},
        isNewSelect,
        classesInput,
        wrapperClass,
        newSelectFields,
    } = props;

    const [showOptions, setShowOptions] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [optionsFilter, setOptionsFilter] = useState<IOptionSelect[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
        setSearchValue(value);
    }, [value]);

    useEffect(() => {
        filterData();
    }, [searchValue]);

    useEffect(() => {
        if (highlightedIndex >= ZERO && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [highlightedIndex]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowOptions(false);
                setRotate(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterData = (): void => {
        const filtered = searchValue
            ? options.filter((option: IOptionSelect) =>
                  removeAccents(lowerCase(option.value)).includes(removeAccents(lowerCase(searchValue)))
              )
            : options;

        setOptionsFilter(filtered);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!showOptions) return;

        if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < optionsFilter.length - ONE ? prev + ONE : ZERO));
        } else if (e.key === ARROW_UP_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > ZERO ? prev - ONE : optionsFilter.length - ONE));
        } else if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (highlightedIndex >= ZERO) {
                const option = optionsFilter[highlightedIndex];
                setShowOptions(false);
                setRotate(false);
                onClickValue(option);
            }
        } else if (e.key === ESCAPE_KEY) {
            setShowOptions(false);
            setRotate(false);
        }
    };

    return (
        <div className="flex items-end gap-2" ref={containerRef}>
            <WrapperInput
                {...{
                    ...props,
                    classesWrapper: `${props.classesWrapper}`,
                    classesWrapperInput: `${props.classesWrapperInput} relative ${showOptions ? 'input--options' : ''} ${
                        props.wrapperInputClasses
                    }`,
                }}
            >
                <div className={`flex flex-col w-full ${wrapperClass} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
                    <div
                        onClick={
                            disabled
                                ? (): void => {}
                                : (): void => {
                                      setShowOptions(!showOptions);
                                      setRotate(!rotate);
                                      filterData();
                                      onClickSelect();
                                  }
                        }
                        className={`flex flex-row items-center justify-between ${wrapperSelect}`}
                        id={id}
                    >
                        <Form className="flex items-center w-full">
                            <input
                                value={searchValue}
                                onChange={(e): void => {
                                    setSearchValue(e.target.value);
                                    setShowOptions(true);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                disabled={disabled}
                                className="w-full px-2 outline-none"
                            />
                            <Icon
                                id={generateId({
                                    module: ModuleApp.INPUT,
                                    submodule: 'default-id-select-input-footer',
                                    action: ActionElementType.ARROW_DOWN,
                                    elementType: ElementType.ICO,
                                })}
                                name="arrowDownGray"
                                className={`w-5.5 h-5.5 transition duration-200 transform ${
                                    !selectIconType && rotate ? 'rotate-180' : 'rotate-0'
                                }`}
                            />
                        </Form>
                    </div>
                    <div
                        className={`${
                            showOptions ? 'block' : 'hidden'
                        } flex flex-col absolute w-full top-8 bg-gray-light items-start rounded-lg shadow-templateDesign`}
                    >
                        {optionsFilter.length > ZERO && (
                            <ul
                                className={`${classesInput} z-20 w-full top-full p-0 ${
                                    optionsFilter.length > SHOW_DROPDOWN_OPTIONS ? 'h-29 overflow-y-scroll' : ''
                                } ${isNewSelect ? 'hidden-scroll-select' : ''}`}
                                id="style-option"
                            >
                                {optionsFilter.map((option, index) => (
                                    <li
                                        ref={(el: HTMLLIElement | null): HTMLLIElement | null => (optionRefs.current[index] = el)}
                                        key={option.id}
                                        className={`flex h-10 ml-2 text-center list-none border-b hover:bg-blue hover:text-white ${
                                            highlightedIndex === index ? 'bg-blue text-white' : ''
                                        }`}
                                    >
                                        <span
                                            className="self-center w-full overflow-hidden text-sm leading-sm"
                                            onClick={(): void => {
                                                setShowOptions(false);
                                                setRotate(false);
                                                onClickValue(option);
                                            }}
                                        >
                                            {option.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {newSelectFields && (
                            <span
                                className="mx-auto h-4.25 my-2 overflow-hidden text-sm underline leading-sm text-green"
                                onClick={(): void => newSelectFields.footerClick()}
                            >
                                {newSelectFields.nameFooter}
                            </span>
                        )}
                    </div>
                </div>
            </WrapperInput>
        </div>
    );
};

export const MultiSelectInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-multi-select-input',
            action: ActionElementType.ACTION,
            elementType: ElementType.DRP,
        }),
        options = [],
        disabled,
        value,
        showValue = false,
        placeholder = 'Seleccionar',
        optionSelected = (): void => {},
        classesInput = '',
        isTable = false,
        selectTextClass = '',
        clearOption = false,
        centerTextSelect = false,
        classListSelect = false,
        doubleValue = false,
        selectIconType = '',
        secondValue = '',
        idContentTable = ID_CONTENT_TABLE,
        isNewSelect = false,
        newSelectFields,
        onClickSelect = (): void => {},
        icons = false,
        messagesCustom = '',
        contectSelect = '',
    } = props;
    const selectParentRef = useRef(null);

    const dispatch = useDispatch();

    /**
     * Allows div with all options for select
     */
    const [showOptions, setShowOptions] = useState(false);

    /**
     * Allows rotate arrow with animation
     */
    const [rotate, setRotate] = useState(false);
    /**
     * Allows save option selected
     */
    const [optionValue, setOptionValue] = useState({ key: '', value: '' });
    const [multipleValue, setMultipleValue] = useState({ key: '', value: '', secondValue: '' });
    const [highlightedIndex, setHighlightedIndex] = useState(ZERO);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
        if (clearOption) {
            if (doubleValue) {
                setMultipleValue({ key: '', value: '', secondValue: '' });
            }
            setOptionValue({ key: '', value: '' });
        }
    }, [clearOption]);

    useEffect(() => {
        selectValue();
    }, []);

    useEffect(() => {
        if (doubleValue) {
            setMultipleValue({ key: '', value: String(value), secondValue });
            return;
        }
        if (!value) {
            setOptionValue({ key: '', value: '' });
            return;
        }
        selectValue();
    }, [value]);

    useEffect(() => {
        isTable && options.length && dispatch(setDropdown(showOptions));
        if (!showOptions) setHighlightedIndex(ZERO);
    }, [showOptions]);

    useEffect(() => {
        if (highlightedIndex >= ZERO && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [highlightedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!showOptions || !options.length) return;

        if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + ONE) % options.length);
        } else if (e.key === ARROW_UP_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - ONE + options.length) % options.length);
        } else if (e.key === ENTER_KEY) {
            e.preventDefault();
            const selectedOption = options[highlightedIndex];
            if (selectedOption) onClickValue(selectedOption);
        } else if (e.key === ESCAPE_KEY) {
            setShowOptions(false);
            setRotate(false);
        }
    };

    /**
     * function when clicked outside select
     */
    useOnClickOutside(selectParentRef, () => {
        setShowOptions(false);
        setRotate(false);
    });

    /**
     * Defines the value for showing in a select
     * @returns string | number
     */
    const selectValue = (): string | number => {
        if (value) return value;

        if (optionValue.value && !value) return optionValue.value;

        return placeholder;
    };

    /**
     * Execute functions when an option is clicked
     * @param option IOptionSelect
     */
    const onClickValue = (option: IOptionSelect): void => {
        setShowOptions(false);
        setRotate(false);
        isTable && dispatch(setDropdown(false));
        if (doubleValue) {
            setMultipleValue({
                key: option?.key,
                value: option?.value,
                secondValue: option?.valueText ?? '',
            });
        }
        setOptionValue({
            key: option?.key,
            value: option?.value,
        });
        optionSelected(option);
    };

    const currentValue = selectValue();
    const text = currentValue === NOT_VALUE ? placeholder : currentValue;

    const handleActionSelect = (): void => {
        if (!disabled) {
            isTable && options.length && scrollByTable(!showOptions, setDropdown, dispatch, idContentTable);
            setShowOptions(!showOptions);
            setRotate(!rotate);
            onClickSelect();
        }
    };

    const renderNoValueMultiSelect = (): React.ReactElement => (
        <p
            className={`text-sm input pl-2 ${isTable ? 'xs:text-tiny col-span-8' : 'xs:text-tiny'} ${
                value || optionValue.value ? 'text-gray-dark' : 'text-gray'
            } ${selectTextClass} leading-4 select__text`}
            title={String(text)}
        >
            {showValue ? value : text}
        </p>
    );

    const renderOptionMultiselect = (
        option: IOptionSelect,
        index: number,
        isHighlighted: boolean,
        onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void
    ): React.ReactElement =>
        isNewSelect ? (
            <li
                key={uuid()}
                className={`pl-4 list-none options-custom ${isHighlighted ? 'bg-blue-light' : ''}`}
                onClick={(): void => {
                    !option.multiSelectCheck && onClickValue(option);
                }}
                onKeyDown={onKeyDown}
                ref={(el: HTMLLIElement | null): HTMLLIElement | null => (optionRefs.current[index] = el)}
            >
                {option.multiSelectCheck && (
                    <CheckboxValidate checked={option.multiSelectCheck.value} onChange={(): void => onClickValue(option)} />
                )}
                <span
                    className={`self-center ${
                        !newSelectFields?.isEdit ? 'w-full' : 'w-9/12'
                    } overflow-hidden text-sm leading-sm text-center text-blue}`}
                >
                    {option?.value}
                </span>
                {newSelectFields?.isEdit && option?.value !== 'No disponible' && (
                    <div className="flex self-center">
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-multi-select-input',
                                action: ActionElementType.EDIT,
                                elementType: ElementType.ICO,
                            })}
                            name="editBlue"
                            hoverIcon="editGreen"
                            className="w-4.25 h-4.25"
                            onClick={(): void => newSelectFields?.editClick(option.id)}
                        />
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-multi-select-input',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            hoverIcon="trashGreen"
                            className="w-4.25 h-4.25"
                            onClick={(): void => newSelectFields?.trashClick(option.id)}
                        />
                    </div>
                )}
            </li>
        ) : (
            <li
                key={uuid()}
                className={`option list-none text-blue px-4 ${option?.containerOption} ${isHighlighted ? 'bg-blue-light' : ''}`}
                onClick={(): void => onClickValue(option)}
                onKeyDown={onKeyDown}
            >
                {option?.value}
            </li>
        );

    const classesListMultiSelect = (): string => {
        const defaultClasses = 'select-custom absolute w-full top-full';
        const classesList = classListSelect ? 'list-position' : '';
        const showList = showOptions ? 'block' : 'hidden';
        const optionList = options.length > SHOW_DROPDOWN_OPTIONS ? 'scroll-select bg-green-scrollbar' : '';
        const isNewSelectClasses = isNewSelect ? 'hidden-scroll-select' : '';

        return `${defaultClasses} ${classesList} ${showList} ${classesInput} ${optionList} ${isNewSelectClasses}`;
    };

    const classesSelectParent = (): {
        containerClasses: string;
        classesRenderValue: string;
        iconArrowClasses: string;
        classNewSelect: string;
    } => {
        const classesDisabled = disabled ? 'cursor-default' : 'cursor-pointer';
        const containerClasses = `flex flex-col justify-center w-full ${classesDisabled}`;

        const tableStyle = isTable || centerTextSelect ? 'w-full text-center' : '';
        const classesRenderValue = `w-full overflow-hidden ${tableStyle}`;

        const rotationClass = !selectIconType && rotate ? 'rotate-180' : 'rotate-0';
        const iconArrowClasses = `w-5.5 h-5.5 transition duration-200 transform cursor-pointer ${rotationClass}`;

        const classNewSelect = isNewSelect ? 'scroll-options bg-green-scrollbar w-full' : '';

        return {
            containerClasses,
            classesRenderValue,
            iconArrowClasses,
            classNewSelect,
        };
    };

    const validateDobleValue = (): boolean => doubleValue && !!multipleValue.value && !!multipleValue.secondValue;

    const { classesWrapper, classesWrapperInput } = selectClassesWrapper(props, {
        showOptions,
        isTable,
        value: optionValue.value,
    });

    return (
        <WrapperInput
            {...{
                ...props,
                classesWrapper,
                classesWrapperInput,
            }}
        >
            <div
                className={classesSelectParent().containerClasses}
                ref={selectParentRef}
                tabIndex={ZERO}
                onKeyDown={handleKeyDown}
            >
                <div
                    aria-hidden="true"
                    onClick={(): void => handleActionSelect()}
                    className={`flex flex-row items-center justify-between select-sub-container ${contectSelect}`}
                    id={id}
                >
                    <div className={classesSelectParent().classesRenderValue}>
                        {validateDobleValue() ? (
                            <>
                                <p className="pb-0.5 pt-1 leading-3 text-tiny md:text-sm text-gray-dark xs:py-0">
                                    {multipleValue.value}
                                </p>
                                <p className="pt-0.5 -mt-1 text-tiny md:text-sm text-gray-dark xs:pt-0">
                                    {multipleValue.secondValue}
                                </p>
                            </>
                        ) : (
                            renderNoValueMultiSelect()
                        )}
                    </div>
                    <IconComponent
                        id={generateId({
                            module: ModuleApp.INPUT,
                            submodule: 'default-id-multi-select-input',
                            action: ActionElementType.ARROW_DOWN,
                            elementType: ElementType.ICO,
                        })}
                        name={selectIconType || 'arrowDownGray'}
                        className={classesSelectParent().iconArrowClasses}
                    />
                </div>
                <ul className={classesListMultiSelect()} id="style-option">
                    <div className={classesSelectParent().classNewSelect}>
                        {icons ? (
                            <span className="select-message">
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.INPUT,
                                        submodule: 'default-id-multi-select-input',
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ICO,
                                    })}
                                    name="infoBlue"
                                    hoverIcon="infoEditWhite"
                                    className="rotate-180"
                                />
                                <span className="leading-4 text-gray-dark">{messagesCustom}</span>
                            </span>
                        ) : (
                            options?.map((option: IOptionSelect, index: number) => {
                                return option?.doubleText ? (
                                    <li
                                        key={uuid()}
                                        onClick={(): void => {
                                            onClickValue(option);
                                        }}
                                        className="list-none bg-black option hover:bg-blue"
                                    >
                                        <div className={option.classDoubleText}>
                                            {option?.isButton ? (
                                                <div className={`${option.classTypeFont} input-button`}>{option.value}</div>
                                            ) : (
                                                <>
                                                    <span
                                                        className={`${option.classTypeFont} ${
                                                            option.classTypeFont
                                                        }-span leading-3 ${option.classTexts ?? ''}`}
                                                    >
                                                        {option.value}
                                                    </span>
                                                    <p
                                                        className={`${option.classTypeFont} ${option.classTypeFont}-text ${
                                                            option.classTexts ?? ''
                                                        }`}
                                                    >
                                                        {option.valueText}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ) : (
                                    renderOptionMultiselect(option, index, index === highlightedIndex, (e): void => {
                                        if (e.key === ENTER_KEY) {
                                            e.preventDefault();
                                            onClickValue(option);
                                        }
                                    })
                                );
                            })
                        )}
                    </div>
                    {isNewSelect && (
                        <li
                            className="py-2 pb-0 text-sm text-center underline align-text-bottom border-none cursor-pointer d-flex text-green leading-sm"
                            onClick={(): void => newSelectFields?.footerClick()}
                        >
                            {newSelectFields?.nameFooter}
                        </li>
                    )}
                </ul>
            </div>
        </WrapperInput>
    );
};

export const FileInput: React.FC<IPropsInput> = props => {
    const {
        instructions = '',
        fileExtensionAccept,
        classesInput = '',
        file = [],
        setFile = (): void => {},
        name = '',
        multiple = false,
        disabled = false,
        widthFileText = '',
        onClick = (): void => {},
        labelText = '',
        addFileText = '',
        classNameFiles = '',
        sizeMaxMB = SIZE_MAX_MB,
        isValidateSize = false,
        getFile = (): void => {},
        placeholder,
        classesLabel,
        withModalDelete = true,
        updateRequiredField = (): void => {},
        cancelValidations = false,
        showTrashIcon = true,
    } = props;

    const propsFile = { ...props, isFile: true };
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fileId, setFileId] = useState<IGenericRecord>({});
    const [requiredField, setRequiredField] = useState<boolean>(false);
    const [requiredFile, setRequiredFile] = useState<boolean>(false);
    const [fileInvalidSize, setFileInvalidSize] = useState<boolean>(false);
    const [required, setRequired] = useState<boolean>(false);
    const [addNewFile, setAddNewFile] = useState<boolean>(true);
    const id = uuid();

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files?.length) {
            const filePosition = e.target.files[0];
            const newData = file.map((fileMap: IGenericRecord) => {
                if (fileMap.name === name) {
                    return {
                        ...fileMap,
                        name: fileMap.name,
                        files: multiple ? [...fileMap.files, filePosition] : [filePosition],
                        value: 0,
                    };
                }
                return { ...fileMap };
            });
            getFile(e);
            setFile(newData);
            multiple && setAddNewFile(false);
            multiple && setRequired(true);
            multiple && setRequiredFile(false);
        }
    };

    const toggleModal = (): void => setShowModal(!showModal);

    const removeFile = (): void => {
        onClick(fileId);
        toggleModal();
    };

    const getIdToDelete = (name: string, fileName?: string): void => {
        const id =
            (file && file.length > 0 && file?.find((findFile: IGenericRecord) => findFile.name === name).files[0].id) || '';
        if (!withModalDelete) {
            id ? onClick(id) : onClick(fileId);
        }
        if (id) {
            setFileId(id);
            toggleModal();
            return;
        }

        if (!id && !multiple) {
            setFile(
                file.map((fileMap: IGenericRecord) => {
                    if (fileMap.name === name) {
                        return {
                            ...fileMap,
                            name: fileMap.name,
                            files: [],
                            value: 1,
                        };
                    }
                    return { ...fileMap };
                })
            );
        }

        if (multiple) {
            setFile(
                file.map((filemap: IGenericRecord) => {
                    if (filemap.name === name) {
                        return {
                            name: filemap.name,
                            files: filemap.files.filter((value: IGenericRecord) => value.name !== fileName),
                        };
                    }
                    return { ...filemap };
                })
            );
        }
    };

    const addMultipleFile = (): void => {
        if (!required) {
            setRequiredFile(true);
        }
        if (required) {
            setRequired(false);
            setRequiredFile(false);
        }
        setAddNewFile(true);
    };
    useEffect(() => {
        if (cancelValidations) return;
        const isRequired = validateFile(file, name.toLowerCase(), fileExtensionAccept);
        setRequiredField(isRequired);
        updateRequiredField(isRequired);

        if (isValidateSize) setFileInvalidSize(validateSizeFile(file, name.toLowerCase(), sizeMaxMB));
    }, [file]);

    const disabledInputFile = (inputName: string): string => {
        if (!file.some((someFile: IGenericRecord) => someFile.name === inputName && someFile.files.length)) {
            return 'input--disabled';
        }
        return 'hidden';
    };

    const inputWithFiles = file.some((someFile: IGenericRecord) => someFile.name === name && someFile.files.length);

    const { deleteModal } = useModalProps({ showModal, toggleModal, moduleId: ModuleApp.INPUT });

    const disabledTrashIcon = disabled ? 'hidden' : '';

    const classesContainerFileInput = (): string => {
        const defaultClasses = 'flex';
        const multipleClasses = multiple ? 'flex-col justify-center' : 'flex-row items-center';
        const filesClasses =
            !multiple && !file.some((f: IFile) => f.name === name && f.files.length) ? 'input-file-height' : 'relative bottom-1';

        return `${defaultClasses} ${multipleClasses} ${filesClasses} ${classNameFiles}`;
    };

    const classesMainLabel = (): string => {
        const disabledClasses = !disabled ? 'cursor-pointer' : '';
        const requiredFileClasses = requiredFile ? 'input--required' : 'border-gray';
        const classesMultiple = multiple ? `border rounded-md h-29 py-1 items-center justify-center ${requiredFileClasses}` : '';
        const classesNewFile = addNewFile || !inputWithFiles ? 'flex' : 'hidden';
        const inputWithFilesClasses = !inputWithFiles ? 'w-max lg:w-full' : 'flex';
        const justifyClasses = inputWithFiles ? 'justify-end' : 'justify-center';

        return `h-full w-max lg:w-full flex ${justifyClasses} items-center ${disabledClasses} ${classesMultiple} ${classesNewFile} ${inputWithFilesClasses} ${
            disabled && disabledInputFile(name)
        }`;
    };

    const classesCurrentValue = (): string => {
        const defaultClasses = 'flex items-center justify-between pl-2 border rounded-md bg-blue border-blue';
        const disabledClasses = !disabled ? widthFileText : 'w-63';
        const classesValue = !classesInput ? 'w-63' : classesInput;

        return `${defaultClasses} ${disabledClasses} ${classesValue}`;
    };

    const classesWrapper = (
        props: React.PropsWithChildren<IPropsInput>
    ): {
        classesWrapperInput: string;
        classesLabel: string;
        classesEdit: string;
        classesUpload: string;
        classesContianerTrash: string;
        classesTrash: string;
        classesAdd: string;
    } => {
        const classesWithFiles = inputWithFiles || multiple ? 'border-none' : '';
        const classesWrapperInput = `rounded-md ${props.classesWrapperInput} ${classesWithFiles}`;

        const disabledClass = !disabled ? 'cursor-pointer' : '';
        const classesLabel = `block my-2 text-tiny text-center ${disabledClass} text-gray`;

        const classesMultiple = multiple || !inputWithFiles ? 'hidden' : 'block ml-2 cursor-pointer z-10';
        const classesEdit = `justify-end w-5.5 h-5.5 ${classesMultiple}`;

        const classesUpload = `w-5.5 h-5.5 m-auto z-10 ${disabledClass}`;

        const classesContianerTrash = !multiple && inputWithFiles ? 'self-center w-5.5' : '';

        const classesMultipleTrash = !multiple && inputWithFiles ? 'block cursor-pointer ml-2 z-10' : 'hidden';
        const classesTrash = `w-5.5 h-5.5  input--file__trashIcon ${classesMultipleTrash}`;

        const mClass = !addNewFile ? '-mt-2' : '';
        const classesAdd = `${mClass} bg-transparent text-green underline cursor-pointer`;
        return {
            classesWrapperInput,
            classesLabel,
            classesEdit,
            classesUpload,
            classesContianerTrash,
            classesTrash,
            classesAdd,
        };
    };

    const getIdLabel = (): string => (multiple || !inputWithFiles ? id : '');

    const showUploadFile = (): boolean => multiple || !inputWithFiles;

    const showInstructions = (): string => (file && Array.isArray(file) && lengthGreaterThanZero(file[0]) ? '' : instructions);

    return (
        <>
            {withModalDelete && <ModalType {...deleteModal} mainAction={(): void => removeFile()} />}

            <WrapperInput
                {...propsFile}
                fileInvalid={requiredField}
                requiredFile={requiredFile}
                extensions={fileExtensionAccept}
                classesWrapperInput={classesWrapper(props).classesWrapperInput}
                fileInvalidSize={fileInvalidSize}
            >
                <div className={classesContainerFileInput()}>
                    {multiple && (
                        <label className={`ml-1.5 mb-1 font-allerbold text-blue text-tiny ${classesLabel}`}>{labelText}</label>
                    )}
                    {file
                        ?.filter((fileFilter: IGenericRecord) => fileFilter.name === name)
                        ?.map((file: IGenericRecord) =>
                            file.files?.map((eachFile: IGenericRecord, idx: number) => (
                                <div key={`${file.name}${idx}`} className="file-content-input">
                                    <div className={`${multiple ? 'mb-2 flex' : ''}`}>
                                        <div className={classesCurrentValue()}>
                                            <p className="my-1.5 overflow-hidden text-white whitespace-nowrap overflow-ellipsis text-tiny">
                                                {eachFile.name}
                                            </p>
                                            <IconComponent
                                                id={generateId({
                                                    module: ModuleApp.INPUT,
                                                    submodule: 'default-id-file-input',
                                                    action: ActionElementType.ACTION,
                                                    elementType: ElementType.ICO,
                                                })}
                                                name="checkWhite"
                                                className="pr-0.5 w-5.5 h-5.5"
                                            />
                                        </div>
                                        <IconComponent
                                            id={generateId({
                                                module: ModuleApp.INPUT,
                                                submodule: 'default-id-file-input',
                                                action: ActionElementType.TRASH,
                                                elementType: ElementType.ICO,
                                            })}
                                            name="trashBlue"
                                            hoverIcon="trashGreen"
                                            className={`w-5.5 h-5.5 ${
                                                multiple ? `block cursor-pointer ml-0.5 ${disabledTrashIcon}` : 'hidden'
                                            }`}
                                            onClick={(): void => getIdToDelete(file.name, eachFile.name)}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    <label htmlFor={getIdLabel()} className={classesMainLabel()}>
                        <label htmlFor={id} className={classesWrapper(props).classesLabel} id="editIconLabel">
                            {!showUploadFile() && (
                                <div className="w-5.5">
                                    <IconComponent
                                        id={generateId({
                                            module: ModuleApp.INPUT,
                                            submodule: 'default-id-file-input',
                                            action: ActionElementType.EDIT,
                                            elementType: ElementType.ICO,
                                        })}
                                        name="editBlue"
                                        hoverIcon="editGreen"
                                        className={classesWrapper(props).classesEdit}
                                    />
                                </div>
                            )}
                            {showUploadFile() && (
                                <>
                                    {placeholder && <p className="mb-1 text-gray text-tiny">{placeholder}</p>}
                                    {showInstructions()}
                                    <IconComponent
                                        id={generateId({
                                            module: ModuleApp.INPUT,
                                            submodule: 'default-id-file-input',
                                            action: ActionElementType.UPLOAD,
                                            elementType: ElementType.ICO,
                                        })}
                                        name="uploadBlue"
                                        className={classesWrapper(props).classesUpload}
                                    />
                                </>
                            )}
                        </label>
                        <input
                            id={id}
                            name="fileExtension"
                            type="file"
                            className="hidden input--file__input"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeFile(e)}
                            accept={fileExtensionAccept ?? ''}
                            disabled={disabled}
                            value=""
                        />
                    </label>
                    <div className={classesWrapper(props).classesContianerTrash}>
                        {showTrashIcon && (
                            <IconComponent
                                id={generateId({
                                    module: ModuleApp.INPUT,
                                    submodule: 'default-id-file-input',
                                    action: ActionElementType.TRASH,
                                    elementType: ElementType.ICO,
                                })}
                                name="trashBlue"
                                hoverIcon="trashGreen"
                                className={classesWrapper(props).classesTrash}
                                onClick={(): void => getIdToDelete(name)}
                            />
                        )}
                    </div>
                    {requiredFile && (
                        <label htmlFor="fileExtension" className="self-start text-tiny text-purple mr-1.5 text-right -mb-1">
                            *Debe subir un archivo primero
                        </label>
                    )}

                    {multiple && !disabled && (
                        <div className="mt-2">
                            <p
                                className={classesWrapper(props).classesAdd}
                                onClick={(): void => addMultipleFile()}
                            >{`+Agregar ${addFileText}`}</p>
                        </div>
                    )}
                </div>
            </WrapperInput>
        </>
    );
};

export const SelectSearchInput: React.FC<IPropsInput> = props => {
    const {
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-select-search-input',
            action: ActionElementType.CUSTOM_ACTION,
            elementType: ElementType.TXT,
        }),
        optionSelect = [],
        placeholder = 'Seleccione',
        valueSelect,
        onChangeSelect,
        disabled,
        isTableSearch,
        classIconSearch,
        emptyMessage,
        classNameMain,
        idContentTable = ID_CONTENT_TABLE,
        selectIconType,
        renderOption,
    } = props;

    const dispatch = useDispatch();
    const { loader } = useSelector((state: RootState) => state.loader);

    const [loading, setLoading] = useState<boolean>(false);

    const handleFocus = (): void => {
        if (!disabled && isTableSearch) {
            scrollByTable(true, setDropdown, dispatch, idContentTable);
        }
    };

    const handleBlur = (): void => {
        if (!disabled && isTableSearch) {
            scrollByTable(false, setDropdown, dispatch, idContentTable);
        }
    };

    const [sendEmptyArray, setSendEmptyArray] = useState<boolean>(true);
    const filterOptionsArray = (options: SelectSearchOption[]) => (query: string): SelectSearchOption[] => {
        const filteredOptions = options.filter(option => String(option.name)?.toLowerCase().includes(query.toLowerCase()));
        if (!query) {
            setSendEmptyArray(true);
            return filteredOptions;
        }
        if (sendEmptyArray) {
            setSendEmptyArray(false);
            return [];
        }
        return filteredOptions;
    };

    const handleClick = (): void => {
        if (loading && !loader) return;
        setLoading(true);
        setTimeout(() => {
            !loader && setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (loader) return;
        setLoading(false);
    }, [loader]);

    return (
        <div onFocus={handleFocus} onBlur={handleBlur} className={classNameMain} onClick={handleClick}>
            <WrapperInput {...props}>
                <SelectSearch
                    id={id}
                    options={loading ? DEFAULT_OPTION : optionSelect}
                    value={valueSelect || placeholder}
                    placeholder={placeholder}
                    search={optionSelect.length > EIGHT}
                    filterOptions={filterOptionsArray}
                    onChange={onChangeSelect}
                    emptyMessage={emptyMessage}
                    disabled={disabled}
                    renderOption={renderOption}
                />

                {loading && (
                    <IconComponent
                        id={generateId({
                            module: ModuleApp.INPUT,
                            submodule: 'default-id-select-search-input',
                            action: ActionElementType.LOADER,
                            elementType: ElementType.ICO,
                        })}
                        name="loader"
                        className="absolute selectSearch-loading z-1 right-6"
                    />
                )}
                <IconComponent
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-select-search-input',
                        action: ActionElementType.ARROW_DOWN,
                        elementType: ElementType.ICO,
                    })}
                    name={`${selectIconType ?? 'arrowDownGray'}`}
                    className={`w-5.5 h-5.5 transition duration-200 transform rotate-0 pointer-events-none ${
                        isTableSearch ? '' : 'absolute z-1 m-0'
                    } ${classIconSearch ?? 'top-7 right-0.5'} ${disabled && selectIconType && !isTableSearch ? 'hidden' : ''}`}
                />
            </WrapperInput>
        </div>
    );
};

export const SelectSearchTableInput: React.FC<IPropsInput> = props => {
    const {
        optionSelect = [],
        placeholder,
        valueSelect,
        onChangeSelect,
        disabled,
        iconClassName,
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-select-search-table-input',
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
    } = props;
    const [focus, setFocus] = useState(false);
    const selectParentRef = useRef(null);

    useOnClickOutside(selectParentRef, () => {
        setFocus(false);
    });

    const handleSelect = (...args: Parameters<NonNullable<typeof onChangeSelect>>): void => {
        onChangeSelect?.(...args);
        setFocus(false);
    };

    return (
        <div
            className="w-full h-auto"
            onClick={(): void => {
                setFocus(!focus);
            }}
            ref={selectParentRef}
        >
            <WrapperInput {...props}>
                <SelectSearch
                    id={id}
                    options={optionSelect}
                    value={valueSelect}
                    placeholder={placeholder}
                    search={optionSelect.length > EIGHT}
                    filterOptions={fuzzySearch}
                    onChange={handleSelect}
                    disabled={disabled}
                    printOptions={focus ? 'always' : 'never'}
                    autoComplete="off"
                />

                <IconComponent
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-select-search-table-input',
                        action: ActionElementType.ARROW_DOWN,
                        elementType: ElementType.ICO,
                    })}
                    name={`${props.selectIconType ?? 'arrowDownGray'}`}
                    className={`w-5.5 h-5.5 transition duration-200 transform absolute right-0.5 z-1 m-0 ${
                        focus ? 'rotate-180' : 'rotate-0'
                    } ${iconClassName ?? 'top-7'}`}
                />
            </WrapperInput>
        </div>
    );
};

export const DatePickerDayInput: React.FC<IPropsInput> = props => {
    const { classIcon, onChangeDate } = props;
    return (
        <WrapperInput {...props}>
            <DatePickerBase
                dateFormat={undefined}
                disabled={props.disabled}
                onChangeDate={(date): void => onChangeDate?.(date, props.name)}
                selected={props.selected}
                maxDate={props.maxDate}
                minDate={props.minDate}
                className={props.classesInput}
                showPlaceHolderDate={props.showPlaceHolderDate}
                withoutDate={props.withoutDate}
                id={props.id}
            />
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-date-picker-day-input',
                    action: ActionElementType.CALENDAR,
                    elementType: ElementType.ICO,
                })}
                name={`${props.selectIconType ?? 'calendarGreen'}`}
                className={`-ml-7 w-5.5 h-5.5 ${classIcon}`}
            />
        </WrapperInput>
    );
};

export const DatePickerDayRange: React.FC<IPropsInput> = props => {
    const { classIcon, classesInput = '', onChangeDateRange = (): void => {} } = props;
    return (
        <WrapperInput {...props}>
            <DatePicker
                selectsRange
                startDate={props.startDate}
                endDate={props.endDate}
                minDate={props.minDate}
                onChange={onChangeDateRange}
                placeholderText="dd/mm/aaaa - dd/mm/aaaa"
                className={`pr-0.5 text-sm text-center xs:pr-2 xs:text-tiny input--date-range text-gray-dark ${classesInput} ${
                    props.disabled ? 'cursor-default' : 'cursor-pointer'
                }`}
                maxDate={props.maxDate}
                dateFormat="dd/MM/yyyy"
                id={props.id}
            />
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-date-picker-day-range-input',
                    action: ActionElementType.CALENDAR,
                    elementType: ElementType.ICO,
                })}
                name={`${props.selectIconType ?? 'calendarGreen'}`}
                className={`w-5.5 h-5.5 -ml-4 ${classIcon}`}
            />
        </WrapperInput>
    );
};

export const DatePickerMonthInput: React.FC<IPropsInput> = props => {
    const {
        limitMinDate = true,
        maxDate,
        minDate,
        onChangeDate,
        required,
        selected,
        disabled,
        secondIcon,
        classesInput,
        dateFormat = 'MM/yyyy',
        isPrint = false,
    } = props;
    return (
        <WrapperInput {...props}>
            {secondIcon && (
                <IconComponent
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-date-picker-month-input',
                        action: ActionElementType.CUSTOM_ACTION,
                        elementType: ElementType.ICO,
                    })}
                    name={secondIcon}
                    classIcon="w-5.5 h-5.5"
                />
            )}
            <DatePickerBase
                id={props.id}
                className={classesInput}
                dateFormat={dateFormat}
                showMonthYearPicker
                required={required}
                disabled={disabled}
                onChangeDate={onChangeDate}
                selected={selected}
                maxDate={maxDate || new Date()}
                showPlaceHolderDate={props.showPlaceHolderDate}
                placeholder={props.placeholder}
                {...(limitMinDate && { minDate: minDate || new Date() })}
            />
            {!isPrint && (
                <IconComponent
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-date-picker-month-input',
                        action: ActionElementType.CALENDAR,
                        elementType: ElementType.ICO,
                    })}
                    name={`${props.selectIconType ?? 'calendarGray'}`}
                    className="w-7"
                />
            )}
        </WrapperInput>
    );
};

export const DatePickerYearInput: React.FC<IPropsInput> = props => {
    return (
        <WrapperInput {...props}>
            <DatePickerBase
                id={props.id}
                dateFormat="yyyy"
                showYearPicker={true}
                onChangeDate={props.onChangeDate}
                className={props.classesInput}
                selected={props.selected}
                maxDate={props.maxDate || new Date()}
                minDate={props.minDate}
            />
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-date-picker-year-input',
                    action: ActionElementType.CALENDAR,
                    elementType: ElementType.ICO,
                })}
                name="calendarGray"
                className="w-7"
            />
        </WrapperInput>
    );
};

export const ColorInput: React.FC<IPropsInput> = props => {
    const {
        initialColor = '#000000',
        name,
        placeholder = '',
        classesInput = '',
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-color-input',
            action: ActionElementType.INPUT,
            elementType: ElementType.ICO,
        }),
        handleChangeColor = (): void => {},
    } = props;
    const [color, setColor] = useColor('hex', `${initialColor}`);
    const [rotate, setRotate] = useState<boolean>(false);
    const [openColor, setOpenColor] = useState<boolean>(false);
    const [valueColor, setValueColor] = useState<string>('');
    const [onClickColor, setOnClickColor] = useState<boolean>(false);
    useEffect(() => {
        if (color) {
            handleChangeColor(color?.hex);
        }
    }, [openColor]);

    useEffect(() => {
        setValueColor(initialColor);
    }, []);

    useEffect(() => {
        setValueColor(initialColor);
    }, [initialColor]);

    const selectParentRef = useRef(null);

    /**
     * function when clicked outside select
     */
    useOnClickOutside(selectParentRef, () => {
        setOpenColor(false);
        setRotate(false);
    });

    return (
        <div ref={selectParentRef}>
            <WrapperInput {...{ ...props, classesWrapperInput: 'input--value' }}>
                <div
                    onClick={(): void => {
                        setRotate(!rotate);
                        setOpenColor(!openColor);
                    }}
                    className="flex items-center w-full h-auto "
                >
                    {onClickColor ? (
                        <div className="flex">
                            <input type="color" value={color.hex} onChange={(): void => {}} className="w-5 h-5 ml-2" />
                        </div>
                    ) : (
                        <div className="flex">
                            <input type="color" value={valueColor} onChange={(): void => {}} className="w-5 h-5 ml-2" />
                        </div>
                    )}
                    <input
                        autoComplete="off"
                        name={name}
                        value={valueColor}
                        placeholder={placeholder}
                        className={`input ${classesInput} cursor-pointer`}
                        type="select"
                        id={id}
                        disabled
                        onChange={(): void => {}}
                    />
                    <label className="flex justify-end w-full h-full" htmlFor={id}>
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-color-input',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.ICO,
                            })}
                            name="arrowDownGray"
                            className={`transition duration-200 transform
                            ${rotate ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </label>
                </div>
            </WrapperInput>
            <div className="relative">
                {openColor && (
                    <div
                        className="absolute z-10 w-auto h-auto mt-1 rounded-lg shadow-select"
                        onClick={(): void => {
                            setOnClickColor(true);
                            setValueColor(color.hex);
                        }}
                    >
                        <ColorPicker
                            width={screen.width > 767 ? 285 : screen.width - 44}
                            height={287}
                            color={color}
                            onChange={setColor}
                            hideHSV
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const WrapperInput: React.FC<IPropsInput> = ({
    labelText = '',
    children,
    required,
    borderRequired = false,
    value,
    valueSelect,
    disabled,
    classesWrapper = 'relative w-73',
    classesWrapperInput = '',
    classesLabel = '',
    isFile = false,
    isTable = false,
    fileInvalid = false,
    fileInvalidSize = false,
    multiple = false,
    extensions = '',
    sizeMaxMB = SIZE_MAX_MB,
    classRequired = '',
    onClickIcon,
    tooltipInfo = false,
    titleTooltip = '',
    descTooltip = '',
    isPlanMembership,
    isTransparent = false,
    tooltip,
    tooltipGreen = true,
    classTittleTooltip = '',
    id = generateId({
        module: ModuleApp.INPUT,
        submodule: 'default-id-wrapper-input',
        action: ActionElementType.INPUT,
        elementType: ElementType.CONT,
    }),
    ...props
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { requiredText = translate('fields.required-field') } = props;
    const { anchorEl, mouseProps } = usePopper();

    const getClassesWrapper = (): {
        wrapperInputClasses: string;
        disabledClasses: string;
        containerInput: string;
        classesStyleLabel: string;
    } => {
        const fileClasses = isFile || isTable ? '' : 'input--container';
        const requiredClasses = required && !borderRequired ? 'input--required' : '';
        const valueClasses = value || valueSelect ? 'input--value' : '';
        const disabledClassesFile = !isFile && disabled ? 'input--disabled' : '';
        const wrapperInputClasses = `${fileClasses} ${requiredClasses} ${valueClasses} ${disabledClassesFile}`;

        const bgColor = isTransparent ? 'bg-transparent' : 'bg-white';
        const disabledClasses = disabled ? '' : bgColor;

        const containerInput = `relative flex flex-col ${classesWrapper}`;

        const multipleValue = multiple && isFile ? 'hidden' : '';
        const classesStyleLabel = `ml-1.5 mb-1 font-allerbold text-blue text-tiny ${classesLabel} ${multipleValue}`;

        return {
            wrapperInputClasses,
            disabledClasses,
            containerInput,
            classesStyleLabel,
        };
    };

    let wrapperInputClasses = getClassesWrapper().wrapperInputClasses;

    wrapperInputClasses += ' ' + classesWrapperInput;

    const combinedClasses = `${getClassesWrapper().disabledClasses} ${wrapperInputClasses} border-gray border`;

    const showInfo = (): boolean => !!tooltip || tooltipInfo || !!descTooltip;
    const nameIcon = (): IconsNames => (tooltipGreen ? 'infoGreen' : 'infoBlue');

    return (
        <div className={getClassesWrapper().containerInput}>
            <div className="flex flex-row align-items-center">
                {onClickIcon && (
                    <Icon
                        id={generateId({
                            module: ModuleApp.INPUT,
                            submodule: 'default-id-wrapper-input',
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        alt="Información"
                        name="infoGreen"
                        className={`l-1.5 mb-1 cursor-pointer w-5`}
                        hoverIcon="infoBlue"
                        onClick={onClickIcon}
                    />
                )}
                {showInfo() && (
                    <>
                        <span {...mouseProps}>
                            <Icon
                                id={generateId({
                                    module: ModuleApp.INPUT,
                                    submodule: 'default-id-wrapper-input',
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ICO,
                                })}
                                alt="Información"
                                name={nameIcon()}
                                className="l-1.5 mb-1 cursor-pointer w-4"
                                hoverIcon="infoBlue"
                            />
                        </span>
                        <Tooltip
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-wrapper-input',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TOOL,
                            })}
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            iconName="infoBlue"
                            description={descTooltip}
                            title={titleTooltip}
                            textStyles="text-sm"
                            wrapperClassName="rounded"
                            classTitle={classTittleTooltip}
                            {...tooltip}
                        />
                    </>
                )}
                {labelText && <label className={getClassesWrapper().classesStyleLabel}>{labelText}</label>}
            </div>
            <div id={id} className={!isPlanMembership ? combinedClasses : ''}>
                {children}
            </div>

            {required && (
                <label className={`self-end text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1 ${classRequired}`}>
                    {requiredText ?? ''}
                </label>
            )}
            {fileInvalid && (
                <label className={`self-end mr-12 text-right xs:mr-20 text-tiny text-purple ${classRequired}`}>
                    *Formato de archivo no válido (archivos permitidos {extensions.replace('application/', '')})
                </label>
            )}
            {fileInvalidSize && (
                <label className="self-end mr-12 text-right xs:mr-20 text-tiny text-purple">
                    *El tamaño máximo es {String(sizeMaxMB).slice(0, 1)}MB
                </label>
            )}
        </div>
    );
};

export const TimePicker: React.FC<ITimePickerProps> = React.memo(
    ({
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-time-input',
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        className = '',
        time = { minutes: 0, hour: 0, schedule: SCHEDULE_AM },
        setTime,
        setClickTimePicker = (): void => {},
        setTimePicker,
        clickTimePicker,
        showSeconds = false,
        eventClass = '',
    }) => {
        const getConditionalClasses = (
            item?: number | string,
            time?: number | string
        ): {
            containerClasses: string;
            timerValueClasses: string;
            minutesClasses: string;
            secondsClassesSpan: string;
            scheduleClasses: string;
        } => {
            const timerClass = showSeconds ? 'timepicker-complete ' : '';
            const containerClasses = `timepicker-container bg-gray-light ${className} timepicker-handler ${eventClass} ${timerClass}`;
            const classesItem = item === time ? 'bg-blue text-white' : 'text-gray-dark';
            const secondsClasses = showSeconds ? ' h-6.75' : '';
            const timerValueClasses = `${classesItem} flex flex-col py-1 text-sm cursor-pointer hover:bg-blue hover:text-white timepicker-handler ${eventClass} ${secondsClasses}`;
            const minutesClasses = `${classesItem} py-1 text-sm cursor-pointer hover:bg-blue hover:text-white timepicker-handler ${eventClass} ${secondsClasses}`;
            const secondsClassesSpan = `${classesItem} py-1 text-sm cursor-pointer hover:bg-blue hover:text-white timepicker-handler ${eventClass} close-schedule h-6.75`;
            const scheduleClasses = `${classesItem} py-1 text-sm cursor-pointer hover:bg-blue hover:text-white timepicker-handler ${eventClass} close-schedule ${
                showSeconds ? ' h-6.75' : ''
            }`;
            return {
                containerClasses,
                timerValueClasses,
                minutesClasses,
                secondsClassesSpan,
                scheduleClasses,
            };
        };

        const formatSeconds = (): string => (showSeconds ? ':' + getHourValue(time.seconds ?? 0) : '');

        return (
            <div id={id} className={getConditionalClasses().containerClasses}>
                <div className="py-2 text-sm text-center timepicker__hour text-blue timepicker-handler">
                    {getHourValue(time.hour ?? 0)}:{getHourValue(time.minutes ?? 0)}
                    {formatSeconds()}:{time.schedule}
                </div>
                <div className="flex border">
                    <div className="flex flex-col flex-1 overflow-y-auto text-center timepicker-height bg-green-scrollbar timepicker-handler">
                        {TIMEPICKER_HOURS.map(item => (
                            <button
                                className={getConditionalClasses(item, time.hour).timerValueClasses}
                                key={item}
                                onClick={(): void => {
                                    setTime({ ...time, hour: item });
                                    setClickTimePicker({ ...clickTimePicker, hour: true });
                                }}
                                type="button"
                            >
                                {getHourValue(item)}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto text-center hour timepicker-height bg-green-scrollbar timepicker-handler">
                        {TIMEPICKER_MINUTES.map(item => (
                            <button
                                className={getConditionalClasses(item, time.minutes).minutesClasses}
                                key={item}
                                onClick={(): void => {
                                    setTime({ ...time, minutes: item });
                                    setClickTimePicker({ ...clickTimePicker, minutes: true });
                                }}
                                type="button"
                            >
                                {getHourValue(item)}
                            </button>
                        ))}
                    </div>
                    {showSeconds && (
                        <div className="flex flex-col flex-1 overflow-y-auto text-center hour timepicker-height bg-green-scrollbar timepicker-handler">
                            {TIMEPICKER_SECONDS.map(item => (
                                <button
                                    className={getConditionalClasses(item, time.seconds).secondsClassesSpan}
                                    key={item}
                                    onClick={(): void => {
                                        setTime({ ...time, seconds: item });
                                        setClickTimePicker({ ...clickTimePicker, seconds: true });
                                        setTimePicker?.(false);
                                    }}
                                    type="button"
                                >
                                    {getHourValue(item)}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col flex-1 pt-1 text-center schedule timepicker-handler">
                        {TIMEPICKER_SCHEDULES.map(item => (
                            <button
                                className={getConditionalClasses(item, time.schedule).scheduleClasses}
                                key={item}
                                onClick={(): void => {
                                    setTime({ ...time, schedule: item });
                                    setClickTimePicker({ ...clickTimePicker, schedule: true });
                                    setTimePicker?.(false);
                                }}
                                type="button"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
);
TimePicker.displayName = 'TimePicker';

export const TextArea: React.FC<ITextAreaProps> = React.memo(
    ({
        id = generateId({
            module: ModuleApp.INPUT,
            submodule: 'default-id-textarea-input',
            action: ActionElementType.INPUT,
            elementType: ElementType.TXT,
        }),
        name = '',
        value = '',
        labelText = '',
        placeholder = '',
        onChange = (): void => {},
        classesLabel = '',
        classesInput = '',
        classesWrapper = '',
        icons = false,
        successAction = (): void => {},
        cancelAction = (): void => {},
        maxLength = MAX_LENGTH_TEXT_AREA,
        disabled = false,
        isTable = false,
        required = false,
        borderRequired = false,
        requiredText = DEFAULT_REQUIRED_TEXT,
        lettersWithAccent = false,
        limitCharacters = true,
        rows = 1,
        tooltip,
    }) => {
        const { anchorEl, mouseProps } = usePopper();
        const classesRequired = required ? 'input--required' : 'border-gray';
        const defaultClasses = isTable ? 'bg-transparent border-none' : classesRequired;
        return (
            <div className={classesWrapper}>
                {labelText && (
                    <div className="flex flex-wrap items-center">
                        {tooltip && (
                            <>
                                <span {...mouseProps}>
                                    <Icon
                                        id={generateId({
                                            module: ModuleApp.INPUT,
                                            submodule: 'default-id-textarea-input',
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.ICO,
                                        })}
                                        alt="Información"
                                        name="infoGreen"
                                        className={`l-1.5 mb-1 cursor-pointer w-5`}
                                        hoverIcon="infoBlue"
                                    />
                                </span>
                                <Tooltip
                                    id={generateId({
                                        module: ModuleApp.INPUT,
                                        submodule: 'default-id-textarea-input',
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.TOOL,
                                    })}
                                    {...tooltip}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    iconName="infoBlue"
                                    wrapperClassName="rounded"
                                />
                            </>
                        )}
                        <label className={`block ml-1.5 mb-1 font-allerbold text-blue text-tiny ${classesLabel}`}>
                            {labelText}
                        </label>
                    </div>
                )}
                <div className={`flex items-center gap-2 rounded-md  ${disabled ? 'bg-gray-light' : defaultClasses}`}>
                    <TextareaAutosize
                        id={id}
                        className={`${!isTable ? 'adaptable-text-area' : 'text-area-table'} ${
                            !isTable && `border-gray${value ? '-dark' : ''}`
                        } text-gray${value ? '-dark' : ''} ${classesInput} ${
                            required && !value && !borderRequired ? 'input--required' : ''
                        }`}
                        rows={rows}
                        {...restProps({ name, value, placeholder, onChange })}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                            if (lettersWithAccent) validateLettersWithAccent(e);
                        }}
                        disabled={disabled}
                        {...(limitCharacters && { maxLength })}
                    />
                    {icons && <TextAreaIcons {...restProps({ successAction, cancelAction })} />}
                </div>
                {required && <label className="text-error">{requiredText}</label>}
            </div>
        );
    }
);

TextArea.displayName = 'AdaptableTextArea';

export const TextAreaIcons: React.FC<ITextAreaIconsProps> = React.memo(
    ({ successAction = (): void => {}, cancelAction = (): void => {} }) => (
        <div className="relative flex items-center gap-1 xs:gap-0.5">
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-textarea-input',
                    action: ActionElementType.SUBMIT,
                    elementType: ElementType.ICO,
                })}
                name="checkBlue"
                hoverIcon="checkGreen"
                className="w-4.5 cursor-pointer"
                onClick={successAction}
            />
            <IconComponent
                id={generateId({
                    module: ModuleApp.INPUT,
                    submodule: 'default-id-textarea-input',
                    action: ActionElementType.CANCEL,
                    elementType: ElementType.ICO,
                })}
                name="cancelBlue"
                hoverIcon="cancelGreen"
                className="w-4.5 cursor-pointer"
                onClick={cancelAction}
            />
        </div>
    )
);
TextAreaIcons.displayName = 'TextAreaIcons';

export const ImageInput: React.FC<IPropsInput> = React.memo(
    ({
        classesLabel = '',
        classesWrapper = '',
        name = '',
        labelText = '',
        fileExtensionAccept = ACCEPTED_FILES,
        image = {},
        setImage = (): void => {},
        required = false,
        requiredText = DEFAULT_REQUIRED_TEXT,
        sizeImage = SIZE_IMAGE_LIMIT,
        showTrashIcon = true,
        imageInstruction = '',
        disabled = false,
        instructions = '',
        customHandleChangeImage,
        isRequiredWithImage = false,
        placeholder = '',
        classIcon = '',
        placeholderClass = '',
        cleanImage,
        showImageName = true,
        classesInput = '',
        classNameFiles = '',
    }) => {
        const [id, hasImage] = [uuid(), image[name]];
        const [sizeErrorKey, extensionErrorKey] = [`${name}SizeError`, `${name}ExtensionError`];

        const handleChangeImage = ({ target }: ChangeEvent): void => {
            if (target.files) {
                const [newImage, sizeImageError] = [target.files[0], getMbSize(target.files[0]?.size) > sizeImage];
                const extensionError = !isValidExtension(fileExtensionAccept, newImage?.name);
                setImage({
                    ...image,
                    [name]: newImage,
                    [sizeErrorKey]: sizeImageError,
                    [extensionErrorKey]: extensionError,
                });
            }
        };

        const deleteImage = (): void =>
            setImage({
                ...image,
                [name]: '',
                extensionError: false,
                sizeImageError: false,
            });

        return (
            <div className={`relative flex items-start w-full ${classesWrapper}`}>
                <span
                    className={`inline-block ml-1.5 mb-1 font-allerbold text-${
                        disabled ? 'gray' : 'blue'
                    } text-tiny ${classesLabel}`}
                >
                    {labelText}
                </span>
                <label className={`flex ${classesInput}`} htmlFor={id}>
                    {hasImage ? (
                        <div className="view__file">
                            {showImageName && (getImageName(image[name]?.name) || DEFAULT_IMAGE_NAME)}
                            <IconComponent
                                id={generateId({
                                    module: ModuleApp.INPUT,
                                    submodule: 'default-id-image-input',
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ICO,
                                })}
                                name="checkWhite"
                                className="w-5.5 h-5.5"
                            />
                        </div>
                    ) : (
                        <div className={`upload__file ${classNameFiles}`}>
                            {imageInstruction ||
                                (instructions ? (
                                    <>
                                        <IconComponent
                                            id={generateId({
                                                module: ModuleApp.INPUT,
                                                submodule: 'default-id-image-input',
                                                action: ActionElementType.UPLOAD,
                                                elementType: ElementType.ICO,
                                            })}
                                            name="uploadBlue"
                                            className="m-auto cursor-pointer select-none"
                                        />
                                        <span className="text-center select-none text-gray-dark text-tiny">{instructions}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={`select-none text-gray text-tiny ${placeholderClass}`}>
                                            {placeholder || 'Seleccione la imagen en formato jpg, jpeg, png'}
                                        </span>
                                        <IconComponent
                                            id={generateId({
                                                module: ModuleApp.INPUT,
                                                submodule: 'default-id-image-input',
                                                action: ActionElementType.UPLOAD,
                                                elementType: ElementType.ICO,
                                            })}
                                            name="uploadBlue"
                                            className={`m-auto cursor-pointer select-none ${classIcon}`}
                                        />
                                    </>
                                ))}
                        </div>
                    )}
                    {hasImage && showTrashIcon && (
                        <IconComponent
                            id={generateId({
                                module: ModuleApp.INPUT,
                                submodule: 'default-id-image-input',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            hoverIcon="trashGreen"
                            className="cursor-pointer w-4.5 h-4.5"
                            onClick={cleanImage ?? deleteImage}
                        />
                    )}
                </label>

                {required && (!hasImage || isRequiredWithImage) && <label className="text-error">{requiredText}</label>}
                {sizeImage && getMbSize(image[name]?.size) > sizeImage ? (
                    <label className="text-error">{IMAGE_ERROR.SIZE}</label>
                ) : null}
                {image[extensionErrorKey] && <label className="text-error">{IMAGE_ERROR.EXTENSION}</label>}
                <input
                    className="hidden"
                    accept={fileExtensionAccept}
                    onChange={customHandleChangeImage || handleChangeImage}
                    {...{ name, id, value: '', type: 'file', disabled }}
                />
            </div>
        );
    }
);

export const MoneyInput: React.FC<IMoneyInputProps> = ({
    id = generateId({
        module: ModuleApp.INPUT,
        submodule: 'default-id-money-input',
        action: ActionElementType.INPUT,
        elementType: ElementType.TXT,
    }),
    value = '',
    decimals = 2,
    thousandSeparator = '.',
    decimalSeparator = ',',
    displayType = 'number',
    onChange = (): void => {},
    name = '',
    disabled = false,
    inputClass = '',
    containerClass = '',
    subContainerClass = '',
    placeholder = '',
    allowNegative = false,
    allowLeadingZeros = false,
    maxLength = 10,
    symbols = false,
    isCopTxt = false,
    withIcon = true,
    onBlur = (): void => {},
    handleChange = (): void => {},
    fixedDecimalScale,
    prefix,
    ...props
}) => (
    <WrapperInput {...props} id={id} disabled={disabled} classesWrapperInput={disabled ? 'input--disabled' : ''}>
        <div
            className={`m-auto input-number flex ion-justify-content-center bg-transparent text-gray-dark relative w-full ${containerClass}`}
        >
            {withIcon && (
                <Icon
                    id={generateId({
                        module: ModuleApp.INPUT,
                        submodule: 'default-id-money-input',
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name="moneyGray"
                    className="relative -left-0.5 w-6"
                />
            )}
            <div className={`flex flex-col md:flex-row w-full bg-transparent ${subContainerClass}`}>
                <NumberFormat
                    id={id}
                    disabled={disabled}
                    value={symbols ? parseFloat(String(value).replace('-', '')) : value}
                    displayType={displayType}
                    thousandSeparator={thousandSeparator}
                    decimalSeparator={decimalSeparator}
                    decimalScale={decimals}
                    className={`number-format bg-transparent w-full text-left m-auto px-2 text-gray-dark text-sm outline-none xs:text-tiny ${inputClass}`}
                    onValueChange={onChange}
                    onChange={handleChange}
                    name={name}
                    allowNegative={allowNegative}
                    allowLeadingZeros={allowLeadingZeros}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onBlur={onBlur}
                    prefix={prefix}
                    fixedDecimalScale={fixedDecimalScale}
                />
                {isCopTxt ? <span className="self-center mr-1.5 ml-0.5 mt-0.5 text-tiny text-gray-dark">COP</span> : null}
            </div>
        </div>
    </WrapperInput>
);
