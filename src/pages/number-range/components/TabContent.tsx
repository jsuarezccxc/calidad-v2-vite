import React, { useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Button } from '@components/button';
import { DatePickerBase } from '@components/date-picker';
import { NumberInput, TextInput } from '@components/input';
import { Paginator } from '@components/paginator';
import { TABS_PARAGRAPH } from '@information-texts/NumberRange';
import usePaginator from '@hooks/usePaginator';
import usePermissions from '@hooks/usePermissions';
import { ITEMS_PAGE } from '@constants/Paginator';
import { SUPPORTING_DOCUMENT, INVOICE } from '@constants/ElectronicInvoice';
import { ModuleApp, generateId, ActionElementType, ElementType } from '@utils/GenerateId';
import { NumberRangeContext } from '../context';
import { HEADER_COLUMN, HeaderColumn, TypeTab } from './';
import { MAXIMUM_LENGTH_FIELDS } from '..';

export const TabContent: React.FC<{ data: IGenericRecord[]; type: TypeTab }> = ({ data, type }) => {
    const documentType = type === TypeTab.FE ? INVOICE : SUPPORTING_DOCUMENT;
    const isInvoice = documentType === INVOICE;
    const { getSynchronizeNumberRanges } = useContext(NumberRangeContext);
    const { paginator, getLimits } = usePaginator(data);

    const { disabledInputs } = usePermissions();

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <div className="flex flex-col">
            <div className="text-gray-dark">{TABS_PARAGRAPH[documentType]}</div>
            <Button
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `number-range-tab-${documentType}`,
                    action: ActionElementType.SYNC,
                    elementType: ElementType.BTN,
                })}
                text="Sincronizar"
                classes="mx-auto my-7"
                onClick={getSynchronizeNumberRanges}
                disabled={disabledInputs}
            />
            <Table
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `number-range-tab-${documentType}`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isHeaderRowsCustom
                headerRowsCustom={
                    <tr>
                        {HEADER_COLUMN(isInvoice).map(header => (
                            <HeaderColumn key={uuid()} {...header} />
                        ))}
                    </tr>
                }
                fieldsBody={[]}
                data={[]}
                editable={false}
                customTable
                className="table-inventory"
                isNew
                wrapperClassName="table-inventory__container"
            >
                {data?.slice(paginator.limits.start, paginator.limits.finish).map((row, index) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `number-range-tab-${documentType}-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={uuid()}
                    >
                        {isInvoice && (
                            <td colSpan={1} className="h-10 w-181 field-body--uneditable">
                                <p className="text-left break-words text-gray">
                                    {row?.contingency ? 'Factura talonario o papel' : 'Factura electrónica de venta'}
                                </p>
                            </td>
                        )}
                        <td colSpan={1} className="h-10 w-181 field-body--uneditable">
                            <NumberInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `number-range-tab-${documentType}-${index}-resolution-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={row.resolution_number ?? '-'}
                                classesInput="text-left text-gray"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                maxLength={MAXIMUM_LENGTH_FIELDS.RESOLUTION_NUMBER}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-82 field-body--uneditable">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `number-range-tab-${documentType}-${index}-prefix`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={row?.prefix}
                                type="text"
                                classesInput="text-left text-gray"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                maxLength={MAXIMUM_LENGTH_FIELDS.PREFIX}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-136 field-body--uneditable">
                            <div className="flex flex-row justify-center items-center pr-2 pl-4.5">
                                <DatePickerBase
                                    className="bg-transparent mr-0.5 outline-none text-gray"
                                    selected={row?.initial_validity}
                                    disabled
                                    showPlaceHolderDate
                                />
                                <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                            </div>
                        </td>
                        <td colSpan={1} className="h-10 w-136 field-body--uneditable">
                            <div className="flex flex-row justify-center items-center pr-2 pl-4.5">
                                <DatePickerBase
                                    className="bg-transparent mr-0.5 outline-none text-gray"
                                    selected={row?.final_validity}
                                    disabled
                                    showPlaceHolderDate
                                />
                                <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                            </div>
                        </td>
                        <td colSpan={1} className="h-10 w-120 field-body--uneditable">
                            <NumberInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `number-range-tab-${documentType}-${index}-initial-range`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={row?.initial_authorization_range}
                                classesInput="text-left text-gray"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-120 field-body--uneditable">
                            <NumberInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `number-range-tab-${documentType}-${index}-final-range`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={row?.final_authorization_range}
                                classesInput="text-left text-gray"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                            />
                        </td>
                        <td colSpan={1} className="h-10 w-124 field-body--uneditable">
                            <NumberInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `number-range-tab-${documentType}-${index}-last-consecutive`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={row?.last_conscutive_number}
                                classesInput="text-left text-gray"
                                classesWrapper="w-full"
                                classesWrapperInput="w-fix bg-white"
                                disabled
                                maxLength={MAXIMUM_LENGTH_FIELDS.RANGE}
                                isTable
                            />
                        </td>
                    </tr>
                ))}
            </Table>
            {data?.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </div>
    );
};
