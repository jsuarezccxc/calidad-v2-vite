import React from 'react';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { NumberFormatInput, Text } from '@components/table-input';
import { IGenericRecord } from '@models/GenericRecord';
import { getEnum } from '@utils/Object';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { CppFooterBottom, CppFooterTop } from './CustomFooters';
import {
    INITIAL_INVENTORY,
    INITIAL_INVENTORY_TEXT,
    TWO_MODULE,
    TYPE_OF_OPERATION,
    fieldsBodyTableCppTop,
    headerTableCppBottom,
    headerTableCppTop,
} from '.';

export const CppTable: React.FC<IGenericRecord> = ({ data = {}, date }) => {
    const { purchases, sales, quantity_acquired, total_cost_of_sale, final_inventory_month, refunds } = data || [];
    const purchaseData = [...(purchases || []), ...(refunds || [])]?.map((e: IGenericRecord) => ({
        ...e,
        operation: getEnum(TYPE_OF_OPERATION, e?.operation === INITIAL_INVENTORY_TEXT ? INITIAL_INVENTORY : e?.operation),
    }));

    return (
        <div>
            <Table
                id={generateId({
                    module: ModuleApp.ANALYTICAL_REPORTS,
                    submodule: `final-inventory-calculation-cpp`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headersTable={headerTableCppTop}
                data={purchaseData}
                fieldsBody={fieldsBodyTableCppTop}
                className="cppTable__sales_table"
                isFooterRowsCustom
                footerRowsCustom={<CppFooterTop data={quantity_acquired} />}
                isNew
                wrapperClassName="cppTable__withScrollTable"
            />
            <Table
                id={generateId({
                    module: ModuleApp.ANALYTICAL_REPORTS,
                    submodule: `final-inventory-calculation-cpp-final`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headersTable={headerTableCppBottom}
                data={[]}
                className="cppTable__sales_table"
                fieldsBody={[]}
                isFooterRowsCustom
                isHeaderRowsCustom
                customTable
                wrapperClassName="cppTable__withScrollTable"
                headerRowsCustom={
                    <tr className="h-10 xs:h-8.2">
                        <th colSpan={6} className="items-center field-header--uneditable w-219">
                            <p className="text-sm text-center text-blue font-allerbold">Inventario final</p>
                        </th>
                    </tr>
                }
                footerRowsCustom={
                    <CppFooterBottom
                        data={{ final_inventory_month: final_inventory_month, total_cost_of_sale: total_cost_of_sale }}
                        date={date}
                    />
                }
                isNew
            >
                {!!sales?.length &&
                    sales?.map((item: IGenericRecord, index: number) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `final-inventory-calculation-cpp-${index}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={index}
                            className={`${!(index % TWO_MODULE) ? 'tr-gray' : 'tr-white'} h-10 xs:h-8.2 border-t`}
                        >
                            <td className="h-10 pl-1 w-35">
                                <Text
                                    text="Venta"
                                    type="text"
                                    disabled
                                    onChange={(): void => {}}
                                    editTable={false}
                                    className="h-10 pl-1 total w-35"
                                />
                            </td>
                            <td className="h-10 pl-1 w-35">
                                <div className="flex flex-row items-center justify-center w-35">
                                    <DatePickerBase
                                        dateFormat="dd/MM/yyyy"
                                        className={!(index % TWO_MODULE) ? 'tr-gray' : 'tr-white'}
                                        selected={item?.operation_date}
                                        disabled
                                    />
                                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                                </div>
                            </td>
                            <td className="h-10 pl-1 w-35">
                                <NumberFormatInput
                                    id={generateId({
                                        module: ModuleApp.ANALYTICAL_REPORTS,
                                        submodule: `final-inventory-calculation-cpp-${index}-quantity`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ROW,
                                    })}
                                    inputClass="total cppTable__inputs_orientation total-height w-37"
                                    value={item?.quantity}
                                    disabled
                                    withIcon={false}
                                />
                            </td>
                            <td colSpan={3} />
                        </tr>
                    ))}
            </Table>
        </div>
    );
};
