import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DomProps, OptionSnapshot, SelectedOption, SelectSearchOption } from 'react-select-search';
import { v4 as uuid } from 'uuid';
import { Checkbox } from '@components/checkbox/Checkbox';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { SelectSearchInput, TextInput } from '@components/input';
import { ONE } from '@constants/Numbers';
import { VALUE_ZERO_NUMBER } from '@components/free-month-disclaimer';
import { ZERO } from '@constants/UtilsConstants';
import { NA } from '@constants/ElectronicInvoice';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { EMPTY_BATCH, EMPTY_WAREHOUSE } from '@pages/website-inventory';
import { ADD_INVENTORY, availableWarehouseQuantity } from '@pages/website-inventory-movement';
import { RootState } from '@redux/rootReducer';
import { buildOptionsSearch } from '@utils/Company';
import { getUnixFromDate } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { IValidations } from '../..';
import { ADD_BATCH, BATCH, NO, WAREHOUSE, YES } from '.';

export const DynamicBody: React.FC<{
    data: IGenericRecord;
    dataToSend: IGenericRecord[];
    setDataToSend: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    isOutput: string;
    validations: IValidations;
}> = ({ data, dataToSend, setDataToSend, isOutput, validations }) => {
    const { disabledInputs } = usePermissions();
    const [warehouseList, setWarehousesList] = useState<IGenericRecord[]>([]);
    const [isOutputBoolean, setIsOutputBoolean] = useState(false);
    const {
        warehouses: { warehouses: warehouses },
    } = useSelector((state: RootState) => state);
    const { validate, quantityValidate } = validations;
    useEffect(() => {
        if (warehouses) {
            setWarehousesList(warehouses[ZERO]?.warehouses.data || []);
        }
    }, [warehouses]);

    const batchList = (selectedId?: string | number, selectedName?: string): SelectSearchOption[] => {
        const options: SelectSearchOption[] = [];
        const selectedIdStr = selectedId != null ? String(selectedId) : undefined;

        const rowBatches = dataToSend[VALUE_ZERO_NUMBER]?.batches ?? [];
        const alreadySelected = new Set(rowBatches.map((rb: IGenericRecord) => String(rb?.id)));

        data?.batches?.forEach((batch: IGenericRecord) => {
            const idStr = String(batch?.id);
            if (!alreadySelected.has(idStr) || idStr === selectedIdStr) {
                options.push({ ...batch, name: batch?.number, value: idStr });
            }
        });

        if (selectedIdStr && !options.some(o => String(o.value) === selectedIdStr)) {
            options.unshift({ name: selectedName ?? selectedIdStr, value: selectedIdStr });
        }

        !isOutputBoolean && options.push({ name: ADD_BATCH, value: ADD_BATCH });
        return options.filter(item => item?.name);
    };

    const setIsCustomField = (type: string, idBatch: string, idWarehouse = ''): void => {
        setDataToSend(
            dataToSend?.map(row => ({
                ...row,
                batches: row?.batches?.map((batch: IGenericRecord) => {
                    if (idBatch === batch?.id) {
                        return {
                            ...batch,
                            isCustom: type === BATCH,
                            id: type === BATCH ? uuid() : batch?.id,
                            number: type === BATCH ? '' : batch?.number,
                            warehouses: batch?.warehouses?.map((warehouse: IGenericRecord) => {
                                if (idWarehouse === warehouse?.id) {
                                    return {
                                        ...warehouse,
                                        isCustom: type === WAREHOUSE,
                                    };
                                }
                                return {
                                    ...warehouse,
                                };
                            }),
                        };
                    }
                    return {
                        ...batch,
                    };
                }),
            }))
        );
    };

    const onChangeText = (type: string, value: string, idBatch: string, idWarehouse: string, isQuantity: boolean): void => {
        setDataToSend(
            dataToSend.map(row => {
                return {
                    ...row,
                    batches: row?.batches?.map((batch: IGenericRecord) => {
                        if (batch.id === idBatch) {
                            return {
                                ...batch,
                                number: type === BATCH ? value : batch?.number,
                                warehouses: batch?.warehouses?.map((warehouse: IGenericRecord) => {
                                    if (warehouse.id === idWarehouse) {
                                        return {
                                            ...warehouse,
                                            name: type === WAREHOUSE && !isQuantity ? value : warehouse?.name,
                                            quantity: isQuantity ? value : warehouse?.quantity,
                                        };
                                    }
                                    return {
                                        ...warehouse,
                                    };
                                }),
                            };
                        }
                        return { ...batch };
                    }),
                };
            })
        );
    };

    const formatData = (isOutputBool = false): IGenericRecord[] => [
        {
            ...data,
            batches: [
                {
                    ...EMPTY_BATCH,
                    id: isOutputBoolean ? data?.batch?.at(0)?.id : uuid(),
                    number: '',
                    date_expired: data?.is_perishable ? getUnixFromDate(new Date()) : null,
                    isChecked: false,
                    is_output: isOutputBool,
                    warehouses: [
                        {
                            ...EMPTY_WAREHOUSE,
                            id: uuid(),
                            name: '',
                            quantity: 0,
                            isChecked: false,
                            is_output: isOutputBool,
                        },
                    ],
                },
            ],
        },
    ];

    useEffect(() => {
        setDataToSend(formatData(isOutput !== ADD_INVENTORY));
        setIsOutputBoolean(isOutput !== ADD_INVENTORY);
    }, [data, isOutput]);

    const updateRows = useCallback(
        (rowId: string, updater: (row: IGenericRecord) => IGenericRecord) => {
            setDataToSend(r => r.map(row => (row.id === rowId ? updater(row) : row)));
        },
        [data]
    );

    const addLot = useCallback(
        (rowId: string) =>
            updateRows(rowId, row => ({
                ...row,
                batches: [
                    ...row.batches,
                    {
                        ...EMPTY_BATCH,
                        id: uuid(),
                        number: '',
                        date_expired: getUnixFromDate(new Date()),
                        is_output: isOutputBoolean,
                        warehouses: [{ ...EMPTY_WAREHOUSE, id: uuid(), name: '', quantity: '', is_output: isOutputBoolean }],
                    },
                ],
            })),
        [updateRows]
    );

    const onChecked = (type: string, idBatch: string, idWarehouse: string): void => {
        setDataToSend(
            dataToSend.map(row => {
                return {
                    ...row,
                    batches: row?.batches?.map((batch: IGenericRecord) => {
                        if (batch.id === idBatch) {
                            return {
                                ...batch,
                                isChecked: type === BATCH ? !batch?.isChecked : batch?.isChecked,
                                warehouses: batch?.warehouses?.map((warehouse: IGenericRecord) => {
                                    if (warehouse.id === idWarehouse) {
                                        return {
                                            ...warehouse,
                                            isChecked: type === WAREHOUSE ? !warehouse?.isChecked : warehouse?.isChecked,
                                        };
                                    }
                                    return {
                                        ...warehouse,
                                    };
                                }),
                            };
                        }
                        return { ...batch };
                    }),
                };
            })
        );
    };

    const addWarehouseToLot = useCallback(
        (rowId: string, lotId: string) =>
            updateRows(rowId, row => ({
                ...row,
                batches: row.batches.map((lot: IGenericRecord) =>
                    lot.id === lotId
                        ? {
                              ...lot,
                              warehouses: [
                                  ...lot.warehouses,
                                  { ...EMPTY_WAREHOUSE, id: uuid(), name: '', quantity: '', is_output: isOutputBoolean },
                              ],
                          }
                        : lot
                ),
            })),
        [updateRows]
    );

    const onChangeSelect = (type: string, idBatch: string, idWarehouse: string, value: IGenericRecord): void => {
        const currentBatch = data?.batches?.find((item: IGenericRecord) => item?.id === idBatch);
        setDataToSend(
            dataToSend.map(row => {
                return {
                    ...row,
                    batches: row?.batches?.map((batch: IGenericRecord) => {
                        const batchToUse = type === BATCH ? currentBatch : batch;
                        if (batch.id === idBatch) {
                            return {
                                ...batch,
                                date_expired: batchToUse?.date_expired,
                                inventory_transaction_detail_id: batchToUse?.inventory_transaction_detail_id || null,
                                inventory_transaction_id: batchToUse?.inventory_transaction_id || null,
                                purchase_detail_id: batchToUse?.purchase_detail_id || null,
                                number: type === BATCH ? value?.name : batch?.number,
                                id: type === BATCH ? String(value?.value) : String(batch?.id),
                                warehouses: batch?.warehouses?.map((warehouse: IGenericRecord) => {
                                    const currentWarehouse =
                                        WAREHOUSE && isOutputBoolean
                                            ? currentBatch?.warehouses?.find((item: IGenericRecord) => item?.id === value?.value)
                                            : warehouse;
                                    if (warehouse.id === idWarehouse) {
                                        return {
                                            ...warehouse,
                                            purchase_detail_id: currentWarehouse?.purchase_detail_id || null,
                                            inventory_transaction_detail_id:
                                                currentWarehouse?.inventory_transaction_detail_id || null,
                                            inventory_transaction_id: currentWarehouse?.inventory_transaction_id || null,
                                            originalValue: currentWarehouse?.quantity || 0,
                                            name: type === WAREHOUSE ? value?.name : warehouse?.name,
                                            id: type === WAREHOUSE ? value?.value : warehouse?.id,
                                        };
                                    }
                                    return {
                                        ...warehouse,
                                    };
                                }),
                            };
                        }
                        return { ...batch };
                    }),
                };
            })
        );
    };

    const renderOption = (
        option: SelectedOption,
        className: string,
        type: string,
        idBatch: string,
        idWarehouse: string
    ): React.ReactNode => (
        <button
            className={`text-gray-dark ${className} ${option.value === type ? 'underline text-green' : ''}`}
            style={{ zIndex: 100000 }}
            onClick={(event): void => {
                event.preventDefault();
                onChangeSelect(type === ADD_BATCH ? BATCH : WAREHOUSE, idBatch, idWarehouse, {
                    name: option?.name,
                    value: option?.value,
                });
                if (option.value === type) {
                    setIsCustomField(type === ADD_BATCH ? BATCH : WAREHOUSE, idBatch, idWarehouse);
                }
            }}
            key={option?.value}
        >
            {option?.name}
        </button>
    );

    const onChangeBatchDate = (e: Date, idBatch: string): void => {
        const batches = dataToSend[VALUE_ZERO_NUMBER];
        setDataToSend([
            {
                ...batches,
                batches: batches?.batches?.map?.((item: IGenericRecord) => {
                    if (item?.id === idBatch) {
                        return {
                            ...item,
                            date_expired: getUnixFromDate(e),
                        };
                    }
                }),
            },
        ]);
    };

    const warehouseOptions = (
        rowWarehouses: IGenericRecord[],
        idBatch: string,
        currentId?: string,
        currentName?: string
    ): SelectSearchOption[] => {
        const warehouseFromBatch =
            isOutputBoolean && !data?.is_perishable
                ? availableWarehouseQuantity(data, data?.is_perishable)
                : data?.batches?.find((item: IGenericRecord) => item?.id === idBatch)?.warehouses || [];
        const source = isOutputBoolean ? warehouseFromBatch : warehouseList;
        const filtered = source.filter(
            (w: IGenericRecord) =>
                !rowWarehouses.some(lw => String(lw?.id) === String(w?.id) && String(w?.id) !== String(currentId))
        );

        const opts = buildOptionsSearch(Array.from(filtered.values())).map(option => ({
            ...option,
            value: String(option.value),
        }));
        if (currentId && !opts.some(option => String(option.value) === String(currentId))) {
            opts.unshift({ name: currentName ?? String(currentId), value: String(currentId) });
        }

        return opts.filter(item => item?.name);
    };

    const dataWarehouseLength = (data: IGenericRecord, id: string): number =>
        data?.batches?.find((item: IGenericRecord) => item?.id === id)?.warehouses?.length || VALUE_ZERO_NUMBER;

    const disableAddWarehouse = (id: string): boolean => {
        const dataObj = dataToSend[VALUE_ZERO_NUMBER];
        return dataWarehouseLength(dataObj, id) < dataWarehouseLength(data, id);
    };

    return (
        <>
            {data?.id?.length ? (
                dataToSend?.map(row => {
                    const totalLotRows =
                        row?.batches?.reduce((acc: number, batch: IGenericRecord) => acc + batch.warehouses.length + ONE, ZERO) +
                        ONE;
                    return (
                        <React.Fragment key={row.id}>
                            {row?.batches?.map?.((batch: IGenericRecord, batchIndex: number) => {
                                const rowSpanLot = batch.warehouses.length + ONE;

                                return (
                                    <React.Fragment key={batch.id}>
                                        {batch?.warehouses?.map?.((warehouse: IGenericRecord, warehouseIndex: number) => (
                                            <tr
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `website-inventory-movement-${warehouse.id}`,
                                                    action: ActionElementType.TABLE,
                                                    elementType: ElementType.ROW,
                                                })}
                                                key={warehouse.id}
                                            >
                                                {batchIndex === ZERO && warehouseIndex === ZERO && (
                                                    <>
                                                        <td rowSpan={totalLotRows} className="h-10 w-120 custom-border__full">
                                                            <div className="flex">
                                                                <DatePickerBase
                                                                    className="bg-transparent mr-0.5 outline-none text-gray"
                                                                    selected={getUnixFromDate(data?.created_at)}
                                                                    disabled
                                                                    showPlaceHolderDate={true}
                                                                />
                                                                <Icon name="calendarGray" alt="calendar" classIcon="w-7" />
                                                            </div>
                                                        </td>
                                                        <td rowSpan={totalLotRows} className="h-10 w-120 custom-border__full">
                                                            <TextInput
                                                                id={generateId({
                                                                    module: ModuleApp.WEBSITE,
                                                                    submodule: `website-inventory-movement-${warehouse.id}-unit-measurement`,
                                                                    action: ActionElementType.INPUT,
                                                                    elementType: ElementType.TXT,
                                                                })}
                                                                value={data?.unit_measurement || 'N/A'}
                                                                type="text"
                                                                classesInput="text-left text-gray"
                                                                classesWrapperInput="border-none"
                                                                disabled
                                                            />
                                                        </td>
                                                        <td rowSpan={totalLotRows} className="h-10 w-120 custom-border__full">
                                                            <TextInput
                                                                id={generateId({
                                                                    module: ModuleApp.WEBSITE,
                                                                    submodule: `website-inventory-movement-${warehouse.id}-perishable`,
                                                                    action: ActionElementType.INPUT,
                                                                    elementType: ElementType.TXT,
                                                                })}
                                                                value={data.is_perishable ? YES : NO}
                                                                type="text"
                                                                classesInput="text-left text-gray"
                                                                classesWrapperInput="border-none"
                                                                disabled
                                                            />
                                                        </td>
                                                    </>
                                                )}
                                                {warehouseIndex === ZERO && (
                                                    <>
                                                        <td
                                                            rowSpan={rowSpanLot}
                                                            className={` ${
                                                                validate && !batch?.number && row?.is_perishable
                                                                    ? 'required-field'
                                                                    : 'custom-border__full'
                                                            } h-10  w-37`}
                                                        >
                                                            <div className="flex">
                                                                <Checkbox
                                                                    classLabel="!bg-transparent"
                                                                    classContainer={`${
                                                                        !row?.is_perishable ? 'hidden' : ''
                                                                    }  !bg-transparent ml-2`}
                                                                    checked={batch?.isChecked}
                                                                    onChange={(): void => {
                                                                        onChecked(BATCH, batch?.id, '');
                                                                    }}
                                                                    disabled={disabledInputs}
                                                                />
                                                                {batch?.isCustom || !row?.is_perishable ? (
                                                                    <TextInput
                                                                        id={generateId({
                                                                            module: ModuleApp.WEBSITE,
                                                                            submodule: `website-inventory-movement-${warehouse.id}-batch`,
                                                                            action: ActionElementType.INPUT,
                                                                            elementType: ElementType.TXT,
                                                                        })}
                                                                        value={!row?.is_perishable ? NA : batch?.number}
                                                                        type="text"
                                                                        classesInput={`text-left ${
                                                                            row?.is_perishable ? 'text-gray-dark' : 'text-gray'
                                                                        }`}
                                                                        classesWrapper="w-37 -ml-4"
                                                                        classesWrapperInput="border-none"
                                                                        disabled={!row?.is_perishable}
                                                                        onChange={(event): void => {
                                                                            onChangeText(
                                                                                BATCH,
                                                                                event?.target?.value,
                                                                                batch?.id,
                                                                                '',
                                                                                false
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <SelectSearchInput
                                                                        id={generateId({
                                                                            module: ModuleApp.WEBSITE,
                                                                            submodule: `website-inventory-movement-${warehouse.id}-batch`,
                                                                            action: ActionElementType.INPUT,
                                                                            elementType: ElementType.DRP,
                                                                        })}
                                                                        valueSelect={batch?.id ? String(batch.id) : ''}
                                                                        isTableSearch
                                                                        classesWrapperInput="border-none w-2/4 xs-h-auto"
                                                                        classesWrapper="select-table"
                                                                        classNameMain="ml-4"
                                                                        optionSelect={batchList(batch?.id, batch?.number)}
                                                                        isNew
                                                                        selectIconType="arrowDownGreen"
                                                                        renderOption={(
                                                                            _domProps: DomProps,
                                                                            option: SelectedOption,
                                                                            _: OptionSnapshot,
                                                                            className: string
                                                                        ): React.ReactNode =>
                                                                            renderOption(
                                                                                option,
                                                                                className,
                                                                                ADD_BATCH,
                                                                                batch?.id,
                                                                                ''
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td
                                                            rowSpan={rowSpanLot}
                                                            className={`h-10 w-120 ${
                                                                validate && !batch?.date_expired && row?.is_perishable
                                                                    ? 'required-field'
                                                                    : 'custom-border__full'
                                                            }`}
                                                        >
                                                            {!row?.is_perishable ? (
                                                                <TextInput
                                                                    id={generateId({
                                                                        module: ModuleApp.WEBSITE,
                                                                        submodule: `website-inventory-movement-${warehouse.id}-date-expiration`,
                                                                        action: ActionElementType.INPUT,
                                                                        elementType: ElementType.TXT,
                                                                    })}
                                                                    value="N/A"
                                                                    type="text"
                                                                    classesInput="text-left text-gray"
                                                                    classesWrapperInput="border-none"
                                                                    disabled
                                                                />
                                                            ) : (
                                                                <div className="flex">
                                                                    <DatePickerBase
                                                                        id={generateId({
                                                                            module: ModuleApp.WEBSITE,
                                                                            submodule: `website-inventory-movement-${warehouse.id}-date-expiration`,
                                                                            action: ActionElementType.INPUT,
                                                                            elementType: ElementType.TXT,
                                                                        })}
                                                                        className="bg-transparent mr-0.5 outline-none text-gray"
                                                                        selected={batch?.date_expired}
                                                                        showPlaceHolderDate={true}
                                                                        name="input_date_expiration"
                                                                        dateFormat="dd/MM/yyyy"
                                                                        disabled={
                                                                            isOutputBoolean || disabledInputs || !batch?.isCustom
                                                                        }
                                                                        onChangeDate={(e): void => {
                                                                            onChangeBatchDate(e, batch?.id);
                                                                        }}
                                                                    />
                                                                    <Icon
                                                                        name={`${
                                                                            isOutputBoolean || disabledInputs || !batch?.isCustom
                                                                                ? 'calendarGray'
                                                                                : 'calendarGreen'
                                                                        }`}
                                                                        alt="calendar"
                                                                        classIcon="w-7"
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </>
                                                )}

                                                <td
                                                    className={`h-10 w-120 ${
                                                        (quantityValidate && warehouse?.quantity > warehouse?.originalValue) ||
                                                        (validate && !warehouse?.quantity)
                                                            ? 'required-field'
                                                            : 'custom-border__full'
                                                    }`}
                                                >
                                                    <TextInput
                                                        id={generateId({
                                                            module: ModuleApp.WEBSITE,
                                                            submodule: `website-inventory-movement-${warehouse.id}-quantity`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        value={warehouse?.quantity || '0'}
                                                        type="text"
                                                        onlyNumbers
                                                        classesInput="text-left text-gray-dark"
                                                        classesWrapperInput="border-none"
                                                        onChange={(event): void => {
                                                            onChangeText(
                                                                WAREHOUSE,
                                                                event?.target?.value,
                                                                batch?.id,
                                                                warehouse?.id,
                                                                true
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td
                                                    className={`h-10 w-120 ${
                                                        validate && !warehouse?.name ? 'required-field' : 'custom-border__full'
                                                    }`}
                                                >
                                                    {!warehouse?.isCustom ? (
                                                        <SelectSearchInput
                                                            id={generateId({
                                                                module: ModuleApp.WEBSITE,
                                                                submodule: `website-inventory-movement-${warehouse.id}-warehouse`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.DRP,
                                                            })}
                                                            valueSelect={warehouse?.id ? String(warehouse.id) : ''}
                                                            optionSelect={warehouseOptions(
                                                                batch?.warehouses,
                                                                batch?.id,
                                                                warehouse?.id,
                                                                warehouse?.name
                                                            )}
                                                            isTableSearch
                                                            classesWrapperInput="border-none xs-h-auto"
                                                            classesWrapper="select-table w-3/4"
                                                            selectIconType="arrowDownGreen"
                                                            onChangeSelect={(_val, opt): void => {
                                                                onChangeSelect(
                                                                    WAREHOUSE,
                                                                    batch.id,
                                                                    warehouse.id,
                                                                    opt ?? { name: '', value: _val }
                                                                );
                                                            }}
                                                        />
                                                    ) : (
                                                        <TextInput
                                                            id={generateId({
                                                                module: ModuleApp.WEBSITE,
                                                                submodule: `website-inventory-movement-${warehouse.id}-warehouse`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.TXT,
                                                            })}
                                                            value={warehouse?.name}
                                                            type="text"
                                                            classesInput="text-left text-gray-dark"
                                                            classesWrapperInput="border-none"
                                                            onChange={(event): void => {
                                                                onChangeText(
                                                                    WAREHOUSE,
                                                                    event?.target?.value,
                                                                    batch?.id,
                                                                    warehouse?.id,
                                                                    false
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="h-10 gird place-content-center w-28">
                                                        <Checkbox
                                                            classContainer="ml-1.5 p-0"
                                                            checked={warehouse?.isChecked}
                                                            onChange={(): void => {
                                                                onChecked(WAREHOUSE, batch?.id, warehouse?.id);
                                                            }}
                                                            disabled={disabledInputs}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={2} className="h-10 w-120 custom-border__full">
                                                <p
                                                    onClick={(): void => {
                                                        if (!disableAddWarehouse(batch?.id) && isOutputBoolean) return;
                                                        addWarehouseToLot(row.id, batch.id);
                                                    }}
                                                    className={`flex items-center w-full h-10 pl-2 text-sm underline cursor-pointer ${
                                                        !disableAddWarehouse(batch?.id) && isOutputBoolean
                                                            ? 'text-gray'
                                                            : 'text-green'
                                                    }`}
                                                >
                                                    + Agregar Bodega
                                                </p>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            <tr className={`${row?.is_perishable ? '' : 'hidden'}`} key={row?.id + uuid()}>
                                <td colSpan={4} className="w-auto h-10 custom-border__full">
                                    <p
                                        onClick={
                                            isOutputBoolean && row?.batches?.length >= data?.batches?.length
                                                ? (): void => {}
                                                : (): void => addLot(row.id)
                                        }
                                        className={`flex items-center w-full h-10 pl-2 text-sm underline cursor-pointer ${
                                            isOutputBoolean && row?.batches?.length >= data?.batches?.length
                                                ? 'text-gray'
                                                : 'text-green'
                                        }`}
                                    >
                                        + Agregar Lote
                                    </p>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                })
            ) : (
                <></>
            )}
        </>
    );
};
