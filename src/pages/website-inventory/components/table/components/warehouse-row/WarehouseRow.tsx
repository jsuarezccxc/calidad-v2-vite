import React, { useContext } from 'react';
import { NumberInput, SelectSearchTableInput, TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import { buildOptions } from '@utils/Company';
import { IWarehouseRow } from '.';
import { MAX_FIELD_QUANTITY_LENGTH } from '@pages/website-inventory';
import usePermissions from '@hooks/usePermissions';

const WarehouseRow: React.FC<IWarehouseRow> = ({ idBatch, warehouse }) => {
    const { handleChangeField, warehousesList, getWarehousesExcluded, handleChangeWarehouse, validate } = useContext(
        WebsiteInventoryContext
    );
    const { disabledInputs } = usePermissions();

    const warehousesOptionsRender = buildOptions(getWarehousesExcluded(idBatch) ?? []).map(item => ({
        ...item,
        name: item.value,
        value: item.value,
        id: item.id,
    }));

    return (
        <div className="flex custom-border">
            <div
                className={`w-150 flex items-center h-10 ${
                    (!Number(warehouse.quantity) ||
                        (warehouse?.originalValue && Number(warehouse.quantity) > warehouse?.originalValue)) &&
                    validate
                        ? 'required-field'
                        : ''
                } `}
            >
                <NumberInput
                    classesWrapper="w-7 p-0 flex-1"
                    classesWrapperInput="border-none"
                    classesInput="text-left"
                    value={warehouse.quantity}
                    name="quantity"
                    integerNumbers
                    placeholder="..."
                    onChange={({ target: { name, value } }): void => {
                        handleChangeField(value, name, idBatch, warehouse.id);
                    }}
                    maxLength={MAX_FIELD_QUANTITY_LENGTH}
                    disabled={disabledInputs}
                />
            </div>
            <div className={`flex items-center h-10 w-160 ${!warehouse.name && validate ? 'required-field' : ''}`}>
                {!warehouse?.is_editable ? (
                    <TextInput
                        classesWrapper="w-full p-0 flex-1"
                        classesWrapperInput="border-none"
                        classesInput="text-left"
                        value={warehousesList?.find(option => option.id === warehouse.id)?.name || warehouse.name}
                        disabled={!warehouse.is_editable || disabledInputs}
                        placeholder="..."
                        onChange={(): void => {}}
                    />
                ) : (
                    <SelectSearchTableInput
                        classesWrapperInput="border-none"
                        valueSelect={warehousesList?.find(option => option.id === warehouse.id)?.name || warehouse.name}
                        optionSelect={warehousesOptionsRender}
                        onChangeSelect={(_, option): void => handleChangeWarehouse(option, idBatch, warehouse.id)}
                        placeholder="Seleccionar"
                        isTable
                        isTransparent
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-full"
                        selectTextClass="text-left"
                        disabled={disabledInputs}
                    />
                )}
            </div>
            <div className="h-10 gird place-content-center w-28">
                <Checkbox
                    classContainer="ml-1.5 p-0"
                    checked={warehouse?.checked}
                    onChange={(): void => {
                        handleChangeField(!warehouse?.checked, 'checked', idBatch, warehouse.id);
                    }}
                    disabled={disabledInputs}
                />
            </div>
        </div>
    );
};

export default WarehouseRow;
