import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import TextareaAutosize from 'react-textarea-autosize';
import usePopper from '@hooks/usePopper';
import { PM } from '@constants/Calendar';
import { restProps } from '@utils/Props';
import {
    validateAlphanumeric,
    validateAlphanumericNoWhitespace,
    validateLettersWithAccent,
    validateNumbers,
} from '@utils/Validation';
import { ITime, SetTime, stringToTime } from '@utils/TimePicker';
import { getHourValue, getTimeDate } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon } from '@components/icon';
import {
    DEFAULT_REQUIRED_TEXT,
    ITextAreaProps,
    MAX_LENGTH_TEXT_AREA,
    MAX_LENGTH_TEXT_INPUT,
    TextAreaIcons,
    TEXT_AREA_ROWS,
    TimePicker,
} from '@components/input';
import { Tooltip } from '@components/tooltip';
import { Link, LinkColor } from '@components/button';
import { DatePickerBase } from '@components/date-picker';
import { TooltipIcon } from '@components/electronic-invoice/components';
import {
    IClickTimePicker,
    IDatePickerInputProps,
    ITextProps,
    ITitleProps,
    IValueFormatProps,
    DEFAULT_CLICK_TIME,
    ITimePickerInputProps,
    IClassesInput,
} from '.';
import './TableInput.scss';

export const Title: React.FC<ITitleProps> = ({
    id = '',
    className = '',
    text = '',
    color = 'blue',
    disabled = false,
    showInformation = false,
    sectionTooltip = '',
    isNew = false,
}) => {
    const [tooltip, setTooltip] = useState<string>('');
    const colorClass = color === 'white' ? 'text-white' : color === 'gray-dark' ? 'text-gray-dark' : 'text-blue';
    return (
        <h1
            id={id}
            className={`xs:min-h-7.5 text-sm leading-4 font-allerbold ${
                isNew ? 'text-left' : 'justify-center items-center m-auto text-center'
            } flex  xs:p-0 xs:text-tiny ${colorClass} ${className}`}
            aria-disabled={disabled}
        >
            {showInformation && <TooltipIcon setTooltip={(): void => setTooltip(sectionTooltip)} tooltip={tooltip} />}
            {text}
        </h1>
    );
};

export const Text: React.FC<ITextProps> = ({
    id = '',
    text,
    type,
    className,
    onChange,
    onBlur = (): void => {},
    editTable,
    name,
    color = 'gray-dark',
    alphanumeric = false,
    integerNumbers = false,
    maxLength = MAX_LENGTH_TEXT_INPUT,
    disabled = false,
    withFinalLink = false,
    redirectionPathLink = '',
    textLink = '',
    placeholder,
    tooltipInfo = false,
    titleTooltip = '',
    descTooltip = '',
    handleClick = (): void => {},
    onKeyDown,
    alphanumericNoWhitespace = false,
}) => {
    const { anchorEl, mouseProps } = usePopper();

    return editTable ? (
        <input
            onChange={onChange}
            value={text}
            className={`bg-transparent outline-none xs:text-center sm:text-center xs:text-tiny text-sm lg:h-full xs:min-h-6 ${className}`}
            type={type}
            name={name}
            onKeyPress={(e): void => {
                alphanumeric && validateAlphanumeric(e);
                integerNumbers && validateNumbers(e);
                alphanumericNoWhitespace && validateAlphanumericNoWhitespace(e);
            }}
            maxLength={maxLength}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
        />
    ) : (
        <p
            onClick={handleClick}
            id={id}
            className={`xs:mx-1 px-1.5 m-auto cursor-default flex flex-col justify-center text-sm leading-none xs:p-0 xs:text-tiny break-normal ${className} text-${color}`}
        >
            {tooltipInfo && (
                <>
                    <span {...mouseProps} className="cursor-pointer mr-0.5 flex items-center justify-center w-4.5">
                        <Icon name="infoGreen" className="cursor-pointer" />
                    </span>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.OTHERS,
                            submodule: `default-id-text-input`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        iconName="infoBlue"
                        anchorEl={anchorEl}
                        title={titleTooltip}
                        description={descTooltip}
                        placement="bottom-start"
                    />
                </>
            )}
            {text}{' '}
            {withFinalLink && (
                <Link
                    id={generateId({
                        module: ModuleApp.OTHERS,
                        submodule: `default-id-text-input`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.LNK,
                    })}
                    href={redirectionPathLink}
                    text={textLink}
                    linkColor={LinkColor.PURPLE}
                    classes="text-sm"
                />
            )}
        </p>
    );
};

export const NumberFormatInput: React.FC<IValueFormatProps> = ({
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: `default-id-number-input`,
        action: ActionElementType.INPUT,
        elementType: ElementType.TXT,
    }),
    value = '',
    decimals = 2,
    thousandSeparator = '.',
    decimalSeparator = ',',
    displayType = 'number',
    onChange = (): void => {},
    handleChange = (): void => {},
    name = '',
    disabled = false,
    inputClass = '',
    containerClass = '',
    subContainerClass = '',
    placeholder,
    withIcon = true,
    allowNegative = true,
    allowLeadingZeros = false,
    maxLength = 14,
    symbols = false,
    symbol = '',
    isTable = false,
    isCopTxt = false,
    onBlur = (): void => {},
    onKeyPress = (): void => {},
    fixedDecimalScale = false,
    customIcon,
    onKeyUp,
    ...props
}) => (
    <div className={`m-auto input-number flex ion-justify-content-center text-gray-dark relative ${containerClass}`}>
        {withIcon && <Icon name={'moneyGray'} className="w-6" />}
        {customIcon}
        {symbol && Number(value) > 0 ? <span className="relative w-2">{symbol}</span> : null}
        {symbols ? (String(value).includes('-') ? '-' : '+') : ''}
        <div className={`flex flex-1 flex-col md:flex-row ${subContainerClass}`}>
            <NumberFormat
                {...props}
                id={id}
                disabled={disabled}
                value={Number(value)}
                displayType={displayType}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                decimalScale={decimals}
                className={`number-format number-format-${
                    disabled ? 'uneditable' : 'editable'
                } bg-transparent w-full text-center m-auto ${
                    withIcon ? '' : '-left-0.5'
                } text-gray-dark text-sm outline-none xs:text-tiny ${withIcon && !isTable ? 'lg:h-10' : 'lg-6'} ${inputClass}`}
                onValueChange={onChange}
                onChange={handleChange}
                name={name}
                autoComplete="off"
                allowNegative={allowNegative}
                allowLeadingZeros={allowLeadingZeros}
                placeholder={placeholder}
                maxLength={maxLength}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
                fixedDecimalScale={fixedDecimalScale}
                onKeyUp={onKeyUp}
            />
            {isCopTxt ? <span className="self-center mr-1.5 ml-0.5 mt-0.5 text-tiny text-gray-dark">COP</span> : null}
        </div>
    </div>
);

export const PercentageFormatInput: React.FC<IValueFormatProps> = ({
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: `default-id-percentage-input`,
        action: ActionElementType.INPUT,
        elementType: ElementType.TXT,
    }),
    value,
    decimals = 2,
    thousandSeparator = '.',
    decimalSeparator = ',',
    displayType = 'number',
    onChange = (): void => {},
    handleChange = (): void => {},
    onKeyPress = (): void => {},
    onBlur = (): void => {},
    name = '',
    disabled = false,
    containerClass = '',
    inputClass = '',
    placeholder,
    suffix = '%',
    allowNegative = false,
    allowLeadingZeros = false,
    maxLength,
    fixedDecimalScale = false,
}) => (
    <>
        <div className={`input-number flex ion-justify-content-center ${containerClass}`}>
            <NumberFormat
                id={id}
                disabled={disabled}
                value={value}
                displayType={displayType}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                decimalScale={decimals}
                className={`number-format bg-transparent w-full text-center m-auto text-gray-dark text-sm outline-none xs:text-tiny ${inputClass}`}
                onValueChange={onChange}
                onChange={handleChange}
                onKeyPress={onKeyPress}
                onBlur={onBlur}
                name={name}
                autoComplete="off"
                placeholder={placeholder}
                suffix={suffix}
                allowNegative={allowNegative}
                allowLeadingZeros={allowLeadingZeros}
                maxLength={maxLength}
                fixedDecimalScale={fixedDecimalScale}
            />
        </div>
    </>
);

export const TextArea: React.FC<ITextAreaProps> = React.memo(
    ({
        id = generateId({
            module: ModuleApp.OTHERS,
            submodule: `default-id-textarea-input`,
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
        requiredText = DEFAULT_REQUIRED_TEXT,
        lettersWithAccent = false,
    }) => (
        <div className={classesWrapper}>
            {labelText && <label className={`block font-allerbold text-blue text-tiny ${classesLabel}`}>{labelText}</label>}
            <div
                className={`flex gap-2 rounded-md ${
                    disabled
                        ? 'bg-gray-light'
                        : isTable
                        ? 'bg-transparent'
                        : `${required ? 'input--required' : 'border-gray'} focus-within:border-green`
                }`}
            >
                <TextareaAutosize
                    id={id}
                    className={`adaptable-text-area-table border-transparent ${classesInput} ${
                        required && !value ? 'input--required' : ''
                    }`}
                    rows={TEXT_AREA_ROWS}
                    {...restProps({ name, value, placeholder, onChange, maxLength })}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                        lettersWithAccent && validateLettersWithAccent(e);
                    }}
                    disabled={disabled}
                />
                {icons && <TextAreaIcons {...restProps({ successAction, cancelAction })} />}
            </div>
            {required && <label className="text-error">{requiredText}</label>}
        </div>
    )
);

export const TableTextArea: React.FC<IGenericRecord> = React.memo(({ value = '', ...props }) => (
    <TextareaAutosize value={value} {...props} />
));

export const DatePickerInput: React.FC<IDatePickerInputProps> = React.memo(
    ({ className = '', classNameInput = '', dateFormat = 'dd/MM/yyyy', disabled, ...props }) => {
        const getConditionalClasses = (): IClassesInput => ({
            container: `table-input__date-picker ${className}`,
            input: `${classNameInput} table-input__date-picker__text bg-transparent ${
                disabled ? 'table-input__date-picker--disabled' : ''
            }`,
        });

        return (
            <div className={getConditionalClasses().container}>
                <DatePickerBase
                    {...props}
                    className={getConditionalClasses().input}
                    dateFormat={dateFormat}
                    disabled={disabled}
                />
                <Icon name={disabled ? 'calendarGray' : 'calendarGreen'} alt="calendar" className="w-6" />
            </div>
        );
    }
);

export const TimePickerInput: React.FC<ITimePickerInputProps> = React.memo(
    ({ className = '', disabled = false, onChange, value = '' }) => {
        const contentInput = useRef<HTMLDivElement | null>(null);
        const [showTime, setShowTime] = useState<boolean>(false);
        const [clickTimePicker, setClickTimePicker] = useState<IClickTimePicker>({ ...DEFAULT_CLICK_TIME });

        const handleTime = (time: ITime): void => {
            if (onChange)
                onChange(
                    `${getHourValue(
                        time.schedule === PM
                            ? Number(getTimeDate(`${time.hour}:00 ${time.schedule}`, undefined, 'HH'))
                            : time.hour || 0
                    )}:${getHourValue(time.minutes || 0)}:${getHourValue(time.seconds || 0)}`
                );
        };

        const outInput = (event: MouseEvent): void => {
            if (contentInput.current && !contentInput.current.contains(event.target as Node)) {
                setShowTime(false);
            }
        };

        const getConditionalClasses = (): IClassesInput => ({
            container: `table-input__time-picker ${className}`,
            input: `table-input__time-picker__input input--container table-input__time-picker__input--${
                disabled ? 'disabled' : 'available'
            }`,
        });

        useEffect(() => {
            document.addEventListener('click', outInput);
            return (): void => {
                document.addEventListener('click', outInput);
            };
        }, []);

        return (
            <div className={getConditionalClasses().container} ref={contentInput}>
                <div
                    className={getConditionalClasses().input}
                    onClick={(): void => {
                        if (!disabled) setShowTime(!showTime);
                    }}
                >
                    <span className="table-input__time-picker__input__span">{getTimeDate(value)}</span>
                </div>
                <TimePicker
                    showSeconds
                    time={stringToTime(value)}
                    setTimePicker={setShowTime}
                    setTime={handleTime as SetTime}
                    clickTimePicker={clickTimePicker}
                    setClickTimePicker={setClickTimePicker}
                    className={`table-input__time-picker__timer ${!showTime || disabled ? 'hidden' : 'block'}`}
                />
            </div>
        );
    }
);
