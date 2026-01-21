import React, { useContext } from 'react';
import { SelectInput, TextInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IS_PERISHABLE_OPTIONS, StringToBool, boolToString } from '@pages/website-inventory';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import usePermissions from '@hooks/usePermissions';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { ModuleApp, ActionElementType, ElementType, generateId } from '@utils/GenerateId';
import BatchRow from '../batch-row/BatchRow';

const ProductRow: React.FC = () => {
    const { disabledInputs } = usePermissions();
    const {
        handleChangeIsPerishable,
        inventoryData,
        handleAddBatch,
        blockIsPerishable,
        validate,
        togglePerishableModal,
    } = useContext(WebsiteInventoryContext);

    return inventoryData.unit_measurement ? (
        <tr
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `inventory-product-${inventoryData.id}`,
                action: ActionElementType.TABLE,
                elementType: ElementType.ROW,
            })}
        >
            <td colSpan={1} className="h-10 w-120 custom-border__full">
                <div className="flex">
                    <DatePickerBase
                        className="bg-transparent mr-0.5 outline-none text-gray"
                        selected={inventoryData?.created_at}
                        disabled
                        showPlaceHolderDate={true}
                    />
                    <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                </div>
            </td>
            <td colSpan={1} className="h-10 w-120 custom-border__full">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `inventory-product-${inventoryData.id}-unit-measurement`,
                        action: ActionElementType.TABLE,
                        elementType: ElementType.ROW,
                    })}
                    value={inventoryData?.unit_measurement}
                    type="text"
                    classesInput="text-left text-gray"
                    classesWrapperInput="border-none"
                    disabled
                />
            </td>
            <td colSpan={1} className="w-120 custom-border__full">
                {blockIsPerishable ? (
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `inventory-product-${inventoryData.id}-perishable`,
                            action: ActionElementType.TABLE,
                            elementType: ElementType.ROW,
                        })}
                        value={
                            IS_PERISHABLE_OPTIONS?.find(option => option.value === boolToString(inventoryData?.is_perishable))
                                ?.value
                        }
                        type="text"
                        classesInput="text-left text-gray"
                        classesWrapperInput="border-none"
                        disabled
                    />
                ) : (
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `inventory-product-${inventoryData.id}-perishable-opt`,
                            action: ActionElementType.TABLE,
                            elementType: ElementType.ROW,
                        })}
                        value={
                            IS_PERISHABLE_OPTIONS?.find(option => option.value === boolToString(inventoryData?.is_perishable))
                                ?.value
                        }
                        options={IS_PERISHABLE_OPTIONS}
                        optionSelected={(option): void => {
                            if (inventoryData.is_perishable === StringToBool(option.value)) return;
                            inventoryData.has_brothers && !inventoryData.validation_status
                                ? togglePerishableModal()
                                : handleChangeIsPerishable();
                        }}
                        isTable
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-full"
                        selectTextClass="text-left"
                        disabled
                    />
                )}
            </td>
            <td colSpan={5} className="custom-border ">
                {inventoryData?.batches?.map(
                    (batch: IGenericRecord, indexBatch: number) => !batch.is_delete && <BatchRow key={indexBatch} batch={batch} />
                )}
                {inventoryData.is_perishable && (
                    <div className="flex flex-row w-full">
                        <p
                            onClick={!disabledInputs ? handleAddBatch : (): void => {}}
                            className={`flex items-center w-full h-10 pl-2 text-sm underline cursor-pointer ${
                                disabledInputs ? 'text-gray' : 'text-green'
                            } ${
                                !inventoryData.batches.filter((batch: IGenericRecord) => !batch.is_delete).length && validate
                                    ? 'required-field'
                                    : ''
                            }`}
                        >
                            + Agregar Lote
                        </p>
                        <p className="h-10 w-28" />
                    </div>
                )}
            </td>
        </tr>
    ) : (
        <></>
    );
};

export default ProductRow;
