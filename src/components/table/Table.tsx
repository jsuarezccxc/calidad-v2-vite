import React, { useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import dayjs from '@utils/Dayjs';
import { useTranslation } from 'react-i18next';
import { Button, Link, LinkColor } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { NumberFormatInput, Text, Title, PercentageFormatInput, TextArea } from '@components/table-input';
import { DatePickerBase } from '@components/date-picker';
import { Rating } from '@components/rating';
import { Paginator } from '@components/paginator';
import { IOptionSelect, SelectInput, SelectSearchInput } from '@components/input';
import { Form } from '@components/form';
import { PaginatorBackend } from '@components/paginator-backend';
import usePermissions from '@hooks/usePermissions';
import usePaginator from '@hooks/usePaginator';
import { ID_CONTENT_TABLE, ITableFieldType } from '@constants/TableFieldType';
import { ITEMS_PAGE } from '@constants/Paginator';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ZERO } from '@constants/UtilsConstants';
import { ONE, TWO } from '@constants/Numbers';
import { IGenericRecord } from '@models/GenericRecord';
import { IError } from '@models/Error';
import { RootState } from '@redux/rootReducer';
import { getChecked, handleChecked } from '@utils/Checkboxs';
import { getWordWrap } from '@utils/Text';
import { CITY_ID, ITableProps, ITdProps, NOT_APPLY, NA, IFieldTypeTextComponent } from '.';
import './Table.scss';

/**
 * Creates internal IDs for table elements based on the table's main ID
 * @param tableId - The main table ID
 * @param elementType - Type of element (header, row, cell, etc.)
 * @param identifier - Additional identifier (field name, index, etc.)
 * @returns Generated ID string
 */
const createTableElementId = (tableId: string, elementType: string, identifier?: string | number): string => {
    if (!tableId) return '';
    const parts = [tableId, elementType];
    if (identifier !== undefined) {
        parts.push(String(identifier));
    }
    return parts.join('-');
};

/**
 * Table custom component
 *
 * @returns  Element to show information on table.
 */
export const Table: React.FC<ITableProps> = ({
    className,
    headersTable = [],
    fieldsBody = [],
    data,
    editable = true,
    customTable = false,
    children,
    setSelected: setSelected,
    selected = [],
    headerHidden = false,
    isHeaderRowsCustom = false,
    headerRowsCustom = [],
    isFooterRowsCustom = false,
    footerRowsCustom = [],
    footerRowsConfig = [],
    footerRows = [],
    onClickIcon,
    validate = false,
    wrapperClassName = '',
    theadClassName,
    tbodyClassName,
    disabled = false,
    withScrollTable = false,
    currentPage,
    setCurrentPage = (): void => {},
    classNamePaginator = '',
    showValue = false,
    reloadPaginator = false,
    idContentTable = ID_CONTENT_TABLE,
    setLimits = (): void => {},
    paginate = true,
    onScroll = (): void => {},
    textAddLink = '',
    onClickAddLink,
    isNew = false,
    styleInline = {},
    paginatorBackendData,
    sendFormWithEnter = false,
    isLoading = false,
    id = generateId({
        module: ModuleApp.TABLE,
        submodule: 'default',
        action: ActionElementType.INFO,
        elementType: ElementType.TBL,
    }),
}) => {
    const { paginator, getLimits } = usePaginator(data);
    const { dropdown } = useSelector((state: RootState) => state.dropdown);
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { disabledInputs } = usePermissions();

    useEffect(() => {
        if (!reloadPaginator) {
            getLimits();
            return;
        }
        paginator.setCurrentPage(0);
        paginator.setLimits({
            start: 0,
            finish: 15,
        });
    }, [data]);

    useEffect(() => {
        setCurrentPage({
            page: paginator.currentPage,
            start: paginator.limits.start,
            finish: paginator.limits.finish,
        });
        getLimits();
    }, [paginator.currentPage, paginator.limits]);

    useEffect(() => {
        setLimits(paginator.limits);
    }, [paginator.limits]);

    const classesHeader = (item: IGenericRecord): string => {
        if (item.title) {
            if (item.calculatedField) {
                return 'field-header--calculated';
            }

            if (item.recommendationBlue) {
                return 'field-header--recommendation-blue';
            }

            if (item.hidden) {
                return 'field-header--hidden';
            }

            if (item.editableField) {
                return 'field-header--editable';
            }

            return editable && item.editableField ? '' : 'field-header--uneditable';
        }
        return '';
    };

    const classesBody = (field: IGenericRecord, item?: IGenericRecord): string => {
        if (
            field.type !== ITableFieldType.ICON &&
            field.type !== ITableFieldType.BUTTON &&
            field.type !== ITableFieldType.CHECKBOX
        ) {
            if (field.calculatedField) {
                return 'field-body--calculated';
            }

            if (field.hidden) {
                return 'field-body--hidden';
            }

            if (editable) {
                if (item?.disabled) {
                    return 'field-body--uneditable';
                }

                if (field.editableField) {
                    return 'field-body--editable';
                }

                return 'field-body--uneditable total';
            }

            if (!editable) {
                return 'field-body--uneditable';
            }
        }

        return '';
    };

    const renderFooter = (footerRowsConfig.length && footerRows.length) || (footerRowsCustom && isFooterRowsCustom);

    return (
        <>
            <Form
                sendWithEnter={sendFormWithEnter}
                id={idContentTable}
                className={`${
                    ((!dropdown || withScrollTable) && 'overflow-y-auto') || ''
                } bg-green-scrollbar xs:min-w-0 sm:w-full ${wrapperClassName}`}
                onScroll={onScroll}
            >
                <table
                    id={id}
                    cellSpacing={0}
                    cellPadding={0}
                    className={`w-full ${className} ${isNew ? 'table-custom-new' : 'table-custom'}`}
                    style={styleInline}
                >
                    {!headerHidden && (
                        <thead className={theadClassName}>
                            {isHeaderRowsCustom ? (
                                headerRowsCustom
                            ) : (
                                <tr className="md:h-10 xs:h-auto">
                                    {headersTable?.map(({ translationKey = '', ...item }: IGenericRecord, index) => {
                                        return (
                                            <th
                                                key={index}
                                                id={createTableElementId(id, 'header', index)}
                                                className={`${classesHeader(item)} ${
                                                    item.wrapperClassName ? item.wrapperClassName : ''
                                                }`}
                                            >
                                                {item.title ? (
                                                    <Title
                                                        id={createTableElementId(id, 'header-title', index)}
                                                        text={
                                                            translationKey
                                                                ? translate(`fields.${translationKey}`)
                                                                : item.title || ''
                                                        }
                                                        disabled={!editable}
                                                        color={item.calculatedField || item.recommendationBlue ? 'white' : 'blue'}
                                                        className={item.className}
                                                        isNew={isNew}
                                                    />
                                                ) : (
                                                    <div className={`${item.className}`}>
                                                        {item.icon && (
                                                            <Icon
                                                                id={createTableElementId(id, 'header-icon', index)}
                                                                name={item.icon}
                                                                className="my-auto cursor-pointer"
                                                                onClick={(): void => item.iconOnClick()}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            )}
                        </thead>
                    )}
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        <tbody className={tbodyClassName}>
                            {customTable ? (
                                <>{children}</>
                            ) : (
                                (paginate
                                    ? data?.slice(
                                          currentPage?.page > ZERO ? currentPage?.start : paginator?.limits.start,
                                          currentPage?.page > ZERO ? currentPage?.finish : paginator?.limits.finish
                                      )
                                    : data
                                )?.map((item: IGenericRecord, index) => (
                                    <tr
                                        key={index}
                                        id={createTableElementId(id, 'row', index)}
                                        className={!(index % TWO) && isNew ? 'tr-white' : 'tr-gray'}
                                    >
                                        {fieldsBody?.map((field, idx) => {
                                            let tdClasses = classesBody(field, item);
                                            tdClasses += ' ' + field.wrapperClassName;
                                            return (
                                                <Td
                                                    key={idx}
                                                    tableId={id}
                                                    editable={editable}
                                                    tdClasses={tdClasses}
                                                    field={field}
                                                    item={{ ...item, index }}
                                                    onClickIcon={onClickIcon}
                                                    validate={validate}
                                                    disabled={disabled || disabledInputs}
                                                    selected={selected}
                                                    setSelected={setSelected}
                                                    index={index}
                                                    customEditable={item?.this_field_is_disabled}
                                                    showValue={showValue}
                                                    isNew={isNew}
                                                />
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    )}
                    {renderFooter && (
                        <tfoot>
                            {isFooterRowsCustom
                                ? footerRowsCustom
                                : footerRows?.map((row, index) => {
                                      return (
                                          <tr key={index} id={createTableElementId(id, 'footer-row', index)}>
                                              {footerRowsConfig.map((config, idx) => {
                                                  let tdClasses = classesBody(row);
                                                  tdClasses += ' ' + config.wrapperClassName;

                                                  return (
                                                      <Td
                                                          key={idx}
                                                          tableId={id}
                                                          editable={editable}
                                                          tdClasses={tdClasses}
                                                          field={config}
                                                          item={row}
                                                          onClickIcon={onClickIcon}
                                                          index={index}
                                                          disabled={disabledInputs}
                                                      />
                                                  );
                                              })}
                                          </tr>
                                      );
                                  })}
                            {textAddLink && (
                                <tr id={createTableElementId(id, 'footer-add-link-row')}>
                                    <td></td>
                                    <td
                                        className="field-body--editable h-10 xs:h-8.2 text-left-link items-start"
                                        colSpan={headersTable.length - 1}
                                    >
                                        <Link
                                            id={createTableElementId(id, 'footer-add-link')}
                                            disabled={!onClickAddLink}
                                            onClick={onClickAddLink}
                                            href="#"
                                            text={textAddLink}
                                            classes="text-sm ml-5 float-left"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tfoot>
                    )}
                </table>
            </Form>
            {paginatorBackendData && paginatorBackendData?.data?.length ? (
                <PaginatorBackend {...paginatorBackendData} />
            ) : (
                data?.length > ITEMS_PAGE &&
                !customTable && (
                    <Paginator
                        reload={reloadPaginator}
                        {...paginator}
                        currentPage={currentPage?.page > ZERO ? currentPage?.page : paginator.currentPage}
                        limits={
                            currentPage?.page > ZERO
                                ? { start: currentPage?.start, finish: currentPage?.finish }
                                : paginator.limits
                        }
                        wrapperClassName={`margin-paginator ${classNamePaginator}`}
                        isGroupPaginator
                    />
                )
            )}
        </>
    );
};

export const Td: React.FC<ITdProps> = ({
    tableId = '',
    tdClasses,
    field,
    item,
    editable = false,
    onClickIcon,
    validate,
    disabled = false,
    selected = [],
    setSelected,
    index,
    customEditable = false,
    showValue = false,
    isNew = false,
}) => {
    const cellId = createTableElementId(tableId, `cell-${field.field}`, index);
    const history = useHistory();
    const { disabledInputs } = usePermissions();
    const error =
        item?.errors?.some((error: IError) => error.field === field.field) || item?.fieldsWithError?.includes(field.field);

    const classesValidation = (fieldValidation: IGenericRecord, value: IGenericRecord): string => {
        if (fieldValidation.type === ITableFieldType.CHECKBOX) {
            return 'td-checkbox';
        }
        if (
            String(value) === NA ||
            (String(value) === 'No hay cantidades disponibles' && field.className === 'w-full electonicCreate')
        ) {
            return 'field-body--uneditable';
        }
        return '';
    };

    const isUrlValidation = (): boolean => item.domain !== NA;

    const classTagP = (className = ''): string => {
        const style = `${className} text-sm text-gray-dark`;
        return isNew ? style.concat('items-start text-left') : style;
    };

    return (
        <td
            id={cellId}
            className={`${tdClasses} ${field && field.classNameTd} ${classesValidation(field, item[field.field])} ${
                error && validate ? 'border-purple' : ''
            } ${isNew ? 'text-left' : ''} `}
        >
            {field.type === ITableFieldType.OBJECT &&
                Array.isArray(item?.modules) &&
                item.modules.map(
                    (moduleItem, moduleIndex) =>
                        moduleItem && (
                            <FieldTypeTextComponent
                                key={moduleIndex}
                                tableId={tableId}
                                field={field}
                                index={moduleIndex}
                                customEditable={customEditable}
                                item={moduleItem}
                                editable
                                isMultipleModules={item.isMultipleModules}
                                classesMultipleModules={
                                    moduleIndex === item.modules.length - ONE ? 'h-12 py-2' : field.classesMultipleModules || ''
                                }
                            />
                        )
                )}
            {field.type === ITableFieldType.TEXT && (
                <FieldTypeTextComponent
                    tableId={tableId}
                    field={field}
                    index={index}
                    customEditable={customEditable}
                    item={item}
                    editable
                />
            )}
            {field.type === ITableFieldType.NUMBER && (
                <Text
                    id={createTableElementId(tableId, `${field.field}-text`, index)}
                    className={`${field.className} ${isNew ? 'items-start xs:text-left sm:text-left text-left' : ''}`}
                    text={item[field.field] ? item[field.field].toString() : field.notApply ? NA : '0'}
                    disabled={!editable || !field.editableField || disabledInputs}
                    color={field.calculatedField ? 'white' : 'gray-dark'}
                    type={'number'}
                    editTable={field.editableField}
                    name={field.field}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => field.onChange && field.onChange(e, item, field.field)}
                />
            )}
            {field.type === ITableFieldType.CHECKBOX && getChecked && handleChecked && (
                <Checkbox
                    id={createTableElementId(tableId, `${field.field}-checkbox`, index)}
                    checked={item.check ? item.check : getChecked(String(item.id || item.unique_product_id), selected)}
                    name={String(item[field.field])}
                    onChange={(e): void =>
                        field.onChange ? field.onChange(e, item) : handleChecked(item, selected, setSelected)
                    }
                    classContainer={`w-max -ml-0 p-0 ${field.className}`}
                    disabled={field.disabled || disabled || disabledInputs}
                />
            )}
            {field.type === ITableFieldType.CHECKBOX_INSIDE && getChecked && handleChecked && (
                <Checkbox
                    id={createTableElementId(tableId, `${field.field}-checkbox-inside`, index)}
                    checked={item.check ? item.check : getChecked(String(item.id || item.unique_product_id), selected)}
                    name={String(item[field.field])}
                    onChange={(): void => handleChecked(item, selected, setSelected)}
                    classContainer={`w-max mx-auto  ${field.className}`}
                    disabled={field.disabled || disabled || disabledInputs}
                />
            )}
            {field.type === ITableFieldType.TITLE && (
                <Title
                    id={createTableElementId(tableId, `${field.field}-title`, index)}
                    className={`${field.className} ${isNew ? 'items-start text-left' : ''}`}
                    text={item[field.field].toString()}
                    disabled={editable || field.editableField || disabledInputs}
                    color={'blue'}
                />
            )}
            {field.type === ITableFieldType.BUTTON && field?.button && (
                <Button
                    id={createTableElementId(tableId, `${field.field}-button`, index)}
                    background={'gray-light'}
                    classes={`${field.className || ''} ml-4.5 xs:ml-2 font-allerbold ${
                        item && field.hideButtons ? field.hideButtons(item) : null
                    } ${isNew ? 'items-start text-left' : ''}`}
                    onClick={(): void => {
                        field.button?.route ? history.push(field.button.route) : field.button?.onClick(item);
                    }}
                    text={field.button.text}
                    disabled={disabledInputs}
                />
            )}
            {field.type === ITableFieldType.LINK &&
                (!isUrlValidation() ? (
                    <FieldTypeTextComponent
                        tableId={tableId}
                        field={field}
                        index={index}
                        customEditable={customEditable}
                        item={item}
                        editable
                    />
                ) : (
                    <Link
                        id={createTableElementId(tableId, `${field.field}-link`, index)}
                        classes={`min-w-max xs:text-tiny ${field.className}`}
                        text={item[field.field]?.toString()}
                        href={field.href ? field.href(item) : '#'}
                        onClick={(): void => {
                            field.onClick ? field.onClick(item) : (): void => {};
                        }}
                        disabled={item[field.field]?.toString() === NA}
                        linkColor={field.color ? field.color : LinkColor.GREEN}
                    />
                ))}
            {field.type === ITableFieldType.VALUE &&
                (item.message && field.message ? (
                    <p className={classTagP(field.inputClass)}>{item[field.field]}</p>
                ) : (
                    <NumberFormatInput
                        id={createTableElementId(tableId, `${field.field}-number`, index)}
                        allowNegative={field.allowNegative}
                        allowLeadingZeros={field.allowLeadingZeros}
                        withIcon={field.withIcon}
                        value={!field.allowInitZeros && item[field?.field]}
                        disabled={!editable || !field.editableField || disabledInputs}
                        handleChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            field.onChange ? field.onChange(e, item, field.field) : '';
                        }}
                        name={field.field}
                        inputClass={`${field.inputClass} ${isNew ? 'items-start text-left' : ''}`}
                        containerClass={field.containerClass}
                        subContainerClass={`${field.subContainerClass} ${isNew ? 'items-start text-left' : ''}`}
                        maxLength={field.maxLength}
                        isTable={field.isTable}
                        isCopTxt={field.isCopTxt || false}
                        fixedDecimalScale={field.fixedDecimalScale}
                        decimals={2}
                    />
                ))}
            {field.type === ITableFieldType.PERCENTAGE && (
                <PercentageFormatInput
                    id={createTableElementId(tableId, `${field.field}-percentage`, index)}
                    allowNegative={field.allowNegative}
                    allowLeadingZeros={field.allowLeadingZeros}
                    value={item[field.field]}
                    disabled={!editable || !field.editableField || disabledInputs}
                    handleChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        field.onChange ? field.onChange(e, item) : '';
                    }}
                    name={field.name ? field.name : ''}
                    inputClass={`${field.inputClass} ${isNew && 'date-picker__text'}`}
                    containerClass={field.containerClass}
                />
            )}
            {field.type === ITableFieldType.TEXT_AREA && (
                <TextArea
                    id={createTableElementId(tableId, `${field.field}-textarea`, index)}
                    classesWrapper={`${field.className}`}
                    classesInput={`${field.inputClass} ${isNew && 'date-picker__text'}`}
                    value={item[field.field] ? item[field.field].toString() : ''}
                    disabled={!editable || !field.editableField || disabledInputs}
                    name={field.field}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => field.onChange && field.onChange(e, item, field.field)}
                    maxLength={field.maxLength}
                    required={false}
                    isTable={true}
                />
            )}
            {field.type === ITableFieldType.ICON && (
                <div className="flex justify-start xs:w-6">
                    <Icon
                        id={createTableElementId(tableId, `${field.field}-icon`, index)}
                        name={field.iconName ? field.iconName : 'pdf'}
                        alt="icon-table"
                        className={`block ml-auto cursor-pointer ${field.className || ''} ${
                            item && field.hideIcons ? field.hideIcons(item) : null
                        }`}
                        hoverIcon={field?.hoverIcon}
                        onClick={(): void => {
                            !disabled
                                ? onClickIcon
                                    ? onClickIcon(item)
                                    : field.onClick
                                    ? field.onClick(item)
                                    : (): void => {}
                                : undefined;
                        }}
                    />
                </div>
            )}
            {field.type === ITableFieldType.DATE && (
                <div className="flex justify-center">
                    {(field.doubleDate && (editable || field.editableField)) ||
                    item[field.field] === NA ||
                    item[field.field] === NOT_APPLY ||
                    (item.messageDate && field.message) ? (
                        <div className="flex flex-row items-center justify-center w-full h-full">
                            <p
                                className={`double-date ${
                                    item[field.field] === NA || item[field.field] === NOT_APPLY ? 'mx-auto' : ''
                                }`}
                            >
                                {item[field.field]}
                            </p>
                            {!item.messageDate && (
                                <Icon
                                    id={createTableElementId(tableId, `${field.field}-calendar-icon`, index)}
                                    name="calendarGray"
                                    alt="calendar"
                                    className="w-5.5"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-row justify-center w-full h-full">
                            <DatePickerBase
                                id={createTableElementId(tableId, `${field.field}-calendar`, index)}
                                dateFormat="dd/MM/yyyy"
                                disabled={!editable || !field.editableField || disabledInputs}
                                className={`${field.className}  ${isNew && 'date-picker__text'} ${
                                    !(index % 2) && isNew ? 'tr-white' : 'tr-gray'
                                }`}
                                selected={field.field && item[field.field] ? item[field.field] : item.date}
                                onChangeDate={(date: Date): void => {
                                    field.onChangeDate ? field.onChangeDate(date) : '';
                                    field.onChangeDate && field.onChangeDate(date, item, field.field);
                                }}
                                minDate={
                                    field.fieldMinDate && item[field.fieldMinDate]
                                        ? dayjs.unix(item[field.fieldMinDate]).add(1, 'day').utc().toDate()
                                        : field.minDate
                                }
                                maxDate={field.maxDate}
                                showPlaceHolderDate={true}
                            />
                            <Icon
                                id={createTableElementId(tableId, `${field.field}-calendar-icon`, index)}
                                name="calendarGray"
                                alt="calendar"
                                className="w-6"
                            />
                        </div>
                    )}
                </div>
            )}
            {field.type === ITableFieldType.RATING && <Rating qualification={item.qualification} />}
            {field.type === ITableFieldType.SELECT && (
                <SelectInput
                    id={createTableElementId(tableId, `${field.field}-select`, index)}
                    name={item[field.field] ? item[field.field].toString() : null}
                    classesWrapperInput={`border-none ${field.wrapperClassName}`}
                    value={item[field.field] || ''}
                    classesInput={`text-gray-dark text-sm ${field.inputClass}`}
                    options={field?.multipleOptions ? field.multipleOptions[index] : field.options}
                    disabled={
                        !editable || !field.editableField || String(item[field.field]) === NA || item?.disabled || disabledInputs
                    }
                    optionSelected={(option: IOptionSelect): void => {
                        field.onChangeSelect && field.onChangeSelect(option, item, field.field);
                    }}
                    isTable
                    showValue={showValue}
                    classesWrapper={field.className || ''}
                    classListSelect={field.classListSelect}
                    selectIconType={field.selectIconType}
                    placeholder={field.placeholder}
                    contectSelect={field.containerClass || ''}
                />
            )}
            {field.type === ITableFieldType.SELECT_SEARCH && (
                <SelectSearchInput
                    id={createTableElementId(tableId, `${field.field}-select-search`, index)}
                    name={field.field}
                    classesWrapperInput={`border-none ${field.wrapperClassName}`}
                    valueSelect={field.field === CITY_ID ? item?.value : item[field.field] || ''}
                    classesInput={`text-gray-dark text-sm ${field.inputClass}`}
                    optionSelect={field.optionsSearch}
                    onChangeSelect={(selectedValue, selectedOption): void => {
                        field.onChangeSelectSearch && field.onChangeSelectSearch(selectedOption, item, field.field);
                    }}
                    isTableSearch
                    classesWrapper={`${field.className || ''} select-table`}
                    classListSelect={field.classListSelect}
                    classIconSearch={field.classIconSearch || ''}
                    disabled={disabledInputs}
                />
            )}

            {field.type === ITableFieldType.TEXT_ACTION && (
                <Text
                    id={createTableElementId(tableId, `${field.id}-text-action`, index)}
                    className={`${customEditable ? 'bg-gray-light' : ''} ${field.className} ${
                        field.emailWrap ? getWordWrap(item.email) : ''
                    } ${isNew ? 'items-start xs:text-left sm:text-left text-left' : ''}`}
                    text={item[field.field] ? item[field.field].toString() : ''}
                    disabled={!editable || !field.editableField || disabledInputs}
                    type="text"
                    editTable={customEditable ? false : field.editableField}
                    name={field.field}
                    handleClick={(): void => field?.onClick && field?.onClick(item)}
                    alphanumeric={field.alphanumeric}
                    integerNumbers={field.integerNumbers}
                    alphanumericNoWhitespace={field.alphanumericNoWhitespace}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => field.onChange && field.onChange(e, item, field.field)}
                    maxLength={field.maxLength}
                    withFinalLink={field?.withFinalLink}
                    redirectionPathLink={field?.redirectionPathLink}
                    textLink={field?.textLink}
                />
            )}
        </td>
    );
};

const FieldTypeTextComponent: React.FC<IFieldTypeTextComponent> = ({
    tableId = '',
    field,
    index,
    customEditable,
    item,
    editable,
    isMultipleModules,
    classesMultipleModules,
}) => {
    return (
        <Text
            id={createTableElementId(tableId, `${field.field}-text`, index)}
            className={`${customEditable ? 'bg-gray-light' : ''} ${field.className} ${
                isMultipleModules && classesMultipleModules
            } ${field.emailWrap ? getWordWrap(item.email) : ''}`}
            text={item[field.field] ? item[field.field].toString() : ''}
            disabled={!editable || !field.editableField}
            type="text"
            editTable={customEditable ? false : field.editableField}
            name={field.field}
            alphanumeric={field.alphanumeric}
            integerNumbers={field.integerNumbers}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => field.onChange && field.onChange(e, item, field.field)}
            maxLength={field.maxLength}
            withFinalLink={field?.withFinalLink}
            redirectionPathLink={field?.redirectionPathLink}
            textLink={field?.textLink}
        />
    );
};

const SkeletonTable: React.FC = () => {
    return (
        <tbody>
            <tr>
                <td colSpan={100}>
                    <div className="w-full p-4 space-y-4">
                        <div className="flex gap-4">
                            <div className="relative w-1/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-1/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-3/6 h-4 bg-gray-200 rounded skeleton-loader" />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative w-2/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-2/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-2/6 h-4 bg-gray-200 rounded skeleton-loader" />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative w-2/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-1/6 h-4 bg-gray-200 rounded skeleton-loader" />
                            <div className="relative w-2/6 h-4 bg-gray-200 rounded skeleton-loader" />
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    );
};
