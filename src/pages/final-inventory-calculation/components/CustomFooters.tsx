import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Text, NumberFormatInput } from '@components/table-input';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { DAY_UNIX } from '@pages/ending-inventory-accounting-month';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

export const CppFooterTop: React.FC<IGenericRecord> = ({ data = {} }) => {
    return (
        <tr className="space-x-2 bg-white border-t h-10 xs:h-8.2 br-gray-dark">
            <td colSpan={2} className=" bg-green-bgLight">
                <Text
                    text="Cantidad adquirida"
                    type="text"
                    disabled
                    onChange={(): void => {}}
                    editTable={false}
                    className="pl-1 total footers__height text-blue"
                />
            </td>
            <td>
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-cpp-footer-total-quantity`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="total cppTable__inputs_orientation cppTable__footer h:10 xs:8.2"
                    value={data?.total_quantity || 0}
                    disabled
                    withIcon={false}
                    containerClass="footers__money"
                />
            </td>
            <td></td>
            <td>
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-cpp-footer-total-purchase`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="total cppTable__inputs_orientation cppTable__footer"
                    value={data?.total_purchases || 0}
                    disabled
                    containerClass="footers__money"
                />
            </td>
            <td>
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-cpp-footer-total-average-cost`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="total cppTable__inputs_orientation cppTable__footer"
                    value={data?.total_average_cost || 0}
                    disabled
                    containerClass="footers__money"
                />
            </td>
        </tr>
    );
};

export const CppFooterBottom: React.FC<IGenericRecord> = ({ data = {}, date }) => {
    const { final_inventory_month, total_cost_of_sale } = data;
    return (
        <>
            <tr className="space-x-2 bg-white border-t h-10 xs:h-8.2">
                <td colSpan={2} className=" bg-green-bgLight">
                    <Text
                        text="Costo total de venta"
                        type="text"
                        disabled
                        onChange={(): void => {}}
                        editTable={false}
                        className="pl-1 total footers__height text-blue"
                    />
                </td>
                <td className="w-37">
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation-cpp-footer-total-cost-sale-quantity`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="total cppTable__inputs_orientation cppTable__footer total-height"
                        value={total_cost_of_sale?.total_quantity || 0}
                        disabled
                        withIcon={false}
                        containerClass="footers__money"
                    />
                </td>
                <td className="w-37">
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation-cpp-footer-total-cost-sale-purchase`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="total cppTable__inputs_orientation  cppTable__footer total-height"
                        value={total_cost_of_sale?.total_purchases || 0}
                        disabled
                        containerClass="footers__money"
                    />
                </td>

                <td className="w-37">
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation-cpp-footer-total-cost-sale-average`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="total cppTable__inputs_orientation cppTable__footer total-height"
                        value={total_cost_of_sale?.total_average_cost || 0}
                        disabled
                        containerClass="footers__money"
                    />
                </td>
                <td className="w-37 footers__height" />
            </tr>
            <tr className="space-x-2 bg-white border-t">
                <td colSpan={2} className=" bg-green-bgLight">
                    <Text
                        text={`Inventario final ${date}`}
                        type="text"
                        disabled
                        onChange={(): void => {}}
                        editTable={false}
                        className="pl-1 total footers__height text-blue"
                    />
                </td>
                <td className="w-37">
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation-cpp-footer-total-month-quantity`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="total cppTable__inputs_orientation cppTable__footer total-height"
                        value={final_inventory_month?.total_quantity || 0}
                        disabled
                        withIcon={false}
                        containerClass="footers__money"
                    />
                </td>
                <td className="w-37 footers__height" />
                <td className="w-37">
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation-cpp-footer-total-month-purchase`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="total cppTable__inputs_orientation cppTable__footer total-height"
                        value={final_inventory_month?.total_purchases || 0}
                        disabled
                        containerClass="footers__money"
                    />
                </td>

                <td className="w-37 footers__height" />
            </tr>
        </>
    );
};

export const PepsFooter: React.FC<IGenericRecord> = ({ data = {}, date }) => {
    return (
        <tr className="bg-white border-t h-10 xs:h-8.2">
            <td className=" bg-green-bgLight w-29">
                <Text
                    text={`Inventario final ${date}`}
                    type="text"
                    disabled
                    onChange={(): void => {}}
                    editTable={false}
                    className="pl-2 total footers__height text-blue"
                />
            </td>
            <td className="h-10 xs:8.2 w-29">
                <div className="flex flex-row items-center justify-center w-29">
                    <DatePickerBase
                        dateFormat="dd/MM/yyyy"
                        className="bg-white text-gray"
                        selected={data?.operation_date - DAY_UNIX}
                        disabled
                    />
                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                </div>
            </td>
            <td colSpan={3} />
            <td className="w-37">
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-peps-footer-quantity-available`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="total cppTable__inputs_orientation total-height text-blue font-allerbold"
                    value={data?.quantity_available_sale || 0}
                    disabled
                    withIcon={false}
                    containerClass="footers__money"
                />
            </td>
            <td className="w-45">
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-peps-footer-quantity-available-sale`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="total cppTable__inputs_orientation total-height text-blue font-allerbold"
                    value={data?.total_cost_quantity_available_for_sale || 0}
                    disabled
                    containerClass="footers__money"
                    withIcon={true}
                />
            </td>
        </tr>
    );
};
