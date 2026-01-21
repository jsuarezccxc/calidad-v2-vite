import React, { useContext } from 'react';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import { MAX_FIELD_BATCH_LENGTH } from '@pages/website-inventory';
import { Checkbox } from '@components/checkbox';
import { TextInput } from '@components/input';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { getUnixFromDate } from '@utils/Date';
import usePermissions from '@hooks/usePermissions';
import WarehouseRow from '../warehouse-row';
import { IBatchRow } from '.';

const BatchRow: React.FC<IBatchRow> = ({ batch }) => {
    const { disabledInputs } = usePermissions();
    const { inventoryData, validate, handleChangeField, handleAddWarehouse, warehousesList } = useContext(
        WebsiteInventoryContext
    );
    return (
        <div className="relative flex items-stretch custom-border ">
            <div
                className={`flex flex-row items-center justify-center px-2 w-150 ${
                    inventoryData.is_perishable && !batch.number && validate ? 'required-field' : ''
                }`}
            >
                {inventoryData.is_perishable && (
                    <Checkbox
                        classContainer="w-7 p-0"
                        checked={batch?.checked}
                        onChange={(): void => {
                            handleChangeField(!batch?.checked, 'checked', batch.id);
                        }}
                        disabled={!batch.is_editable || disabledInputs}
                    />
                )}
                <TextInput
                    classesWrapper="w-7 p-0 flex-1"
                    classesWrapperInput="border-none"
                    classesInput={`text-left ${!inventoryData.is_perishable ? 'text-gray' : ''}`}
                    value={inventoryData.is_perishable ? batch.number : 'N/A'}
                    name="number"
                    disabled={!batch?.is_editable || !inventoryData.is_perishable || disabledInputs}
                    placeholder="..."
                    onChange={({ target: { name, value } }): void => {
                        handleChangeField(value, name, batch.id);
                    }}
                    maxLength={MAX_FIELD_BATCH_LENGTH}
                />
            </div>
            <div
                className={`flex flex-row justify-center items-center w-150 ${batch.is_editable ? 'px-3.5' : 'pr-2 pl-4.5'} ${
                    inventoryData.is_perishable && !batch.date_expired && validate ? 'required-field' : ''
                } `}
            >
                {inventoryData.is_perishable ? (
                    <DatePickerBase
                        className="bg-transparent mr-0.5 outline-none"
                        selected={batch.date_expired}
                        disabled={!batch.is_editable || disabledInputs}
                        onChangeDate={(date: Date): void => {
                            handleChangeField(getUnixFromDate(date), 'date_expired', batch.id);
                        }}
                        showPlaceHolderDate={true}
                    />
                ) : (
                    <TextInput
                        classesWrapper="w-7 p-0 flex-1"
                        classesWrapperInput="border-none"
                        classesInput="text-left text-gray"
                        value={batch.date_expired ?? 'N/A'}
                        name="quantity"
                        type="text"
                        placeholder="..."
                        disabled
                    />
                )}
                <Icon
                    name={batch.is_editable && inventoryData.is_perishable ? 'calendarGreen' : 'calendarGray'}
                    alt="calendar"
                    classIcon={batch.is_editable ? 'w-5.5' : 'w-7'}
                />
            </div>
            <div className="flex flex-col">
                {batch?.warehouses?.map(
                    (warehouse: IGenericRecord, indexWarehouse: number) =>
                        !warehouse.is_delete && <WarehouseRow key={indexWarehouse} warehouse={warehouse} idBatch={batch.id} />
                )}
                <div className="flex flex-row">
                    <p
                        onClick={(): void => {
                            warehousesList.length > batch.warehouses.length && !disabledInputs
                                ? handleAddWarehouse(batch.id)
                                : undefined;
                        }}
                        className={`flex items-center h-10 text-sm underline cursor-pointer w-310 ${
                            warehousesList.length <= batch.warehouses.length || disabledInputs ? 'text-gray' : 'text-green'
                        } pl-2 ${
                            !batch.warehouses.filter((warehouse: IGenericRecord) => !warehouse.is_delete).length && validate
                                ? 'required-field'
                                : ''
                        }`}
                    >
                        + Agregar bodega
                    </p>
                    <p className="h-10 w-28" />
                </div>
            </div>
        </div>
    );
};

export default BatchRow;
