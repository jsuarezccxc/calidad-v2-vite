import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import { IOptionSelect } from '@components/input';
import { ZERO } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { getProductServices } from '@redux/product-catalog/actions';
import { RootState } from '@redux/rootReducer';
import {
    getWarehouseInitialInventory,
    getWarehousesData,
    saveWarehouseInitialInventory,
    validateDeletion,
} from '@redux/warehouses/actions';
import { currentDateInUnix } from '@utils/Date';
import { EMPTY_BATCH, EMPTY_WAREHOUSE, NA_BATCH } from '..';
import { ADD_OUTPUT, NO_ELEMENT, WebsiteInventoryContext } from '.';

export const WebsiteInventoryProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch();

    const {
        productCatalog: {
            productServices: { data: productServices },
        },
        warehouses: { warehouses },
    } = useSelector((state: RootState) => state);

    const [warehousesList, setWarehousesList] = useState<IGenericRecord[]>([]);
    const [validate, setValidate] = useState(false);
    const [inventoryData, setInventoryData] = useState<IGenericRecord>({});
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
    const [countCheckedElements, setCountCheckedElements] = useState<number>(0);
    const [blockIsPerishable, setBlockIsPerishable] = useState(false);
    const [showModalErrorDelete, setShowModalErrorDelete] = useState(false);
    const [nonRemovableInventory, setNonRemovableInventory] = useState<IGenericRecord[]>([]);
    const [showPerishableModal, setShowPerishableModal] = useState(false);
    const [isOutputInitial, setIsOutputInitial] = useState(false);
    const [originalData, setOriginalData] = useState<IGenericRecord>({});
    const [quantityValidate, setQuantityValidate] = useState(false);
    const includesBatchesToDelete = useMemo(() => inventoryData.batches?.some((batch: IGenericRecord) => batch.checked), [
        countCheckedElements,
    ]);

    useEffect(() => {
        dispatch(getProductServices(true));
        dispatch(getWarehousesData(true));
    }, []);

    useEffect(() => {
        dispatch(getProductServices(true));
        dispatch(getWarehousesData(true));
    }, [showConfirmDeleteModal]);

    useEffect(() => {
        if (warehouses) {
            setWarehousesList(warehouses[ZERO]?.warehouses.data || []);
        }
    }, [warehouses]);

    const deletedElementsVerify = (): IGenericRecord => {
        const batches: IGenericRecord[] =
            inventoryData?.batches
                ?.map(
                    (batch: IGenericRecord): IGenericRecord => {
                        return {
                            ...batch,
                            warehouses: batch?.warehouses?.filter(
                                (item: IGenericRecord): boolean => !item?.isNew && !item?.is_delete
                            ),
                        };
                    }
                )
                ?.map((batch: IGenericRecord): IGenericRecord => ({ ...batch, is_delete: !!batch.checked })) || [];
        return { ...inventoryData, batches };
    };

    const handleSelectProduct = async (idProduct: string): Promise<void> => {
        const previousData: IGenericRecord = await dispatch(getWarehouseInitialInventory(idProduct));
        const dataWithWarehousesValue: IGenericRecord = {
            ...previousData,
            batches: previousData?.batches?.map((batch: IGenericRecord) => ({
                ...batch,
                warehouses: batch?.warehouses?.map((warehouse: IGenericRecord) => ({
                    ...warehouse,
                    originalValue: warehouse?.quantity,
                })),
            })),
        };
        if (dataWithWarehousesValue?.batches?.length) {
            setOriginalData(dataWithWarehousesValue);
            setInventoryData(dataWithWarehousesValue);
            return;
        }
        setBlockIsPerishable(dataWithWarehousesValue.validation_status);
        dataWithWarehousesValue.batches = [{ ...NA_BATCH }];
        setOriginalData(dataWithWarehousesValue);
        setInventoryData(dataWithWarehousesValue);
    };

    const handleShowModalSuccess = (): void => {
        setShowSaveSuccess(!showSaveSuccess);
    };

    const handleShowConfirmDeleteModal = (): void => {
        setShowConfirmDeleteModal(!showConfirmDeleteModal);
    };

    const handleChangeIsOutput = (value: string): void => {
        const isOutput = value === ADD_OUTPUT;
        const modifiedBatches = originalData.batches.map((batch: IGenericRecord) => {
            return {
                ...batch,
                is_output: isOutput,
            };
        });
        setInventoryData({ ...inventoryData, batches: modifiedBatches });
        setIsOutputInitial(isOutput);
    };

    const handleChangeIsPerishable = (): void => {
        setInventoryData(inventoryData => ({
            ...inventoryData,
            is_perishable: !inventoryData.is_perishable,
            batches: !inventoryData.is_perishable ? [] : [{ id: uuid(), ...NA_BATCH }],
        }));
        setShowPerishableModal(false);
    };

    const handleAddWarehouse = (idBatch: string): void => {
        const modifiedBatches = inventoryData.batches.map((batch: IGenericRecord) => {
            const currentWarehouses = cloneDeep(batch.id === idBatch ? batch.warehouses : []);
            currentWarehouses?.push({ id: uuid(), ...EMPTY_WAREHOUSE });
            return {
                ...batch,
                ...(batch.id === idBatch && {
                    warehouses: currentWarehouses,
                }),
            };
        });
        setInventoryData({ ...inventoryData, batches: modifiedBatches });
    };

    const handleAddBatch = (): void => {
        const copyBatches = cloneDeep(inventoryData?.batches ?? []);
        copyBatches.push({ id: uuid(), ...EMPTY_BATCH });
        setInventoryData({ ...inventoryData, batches: copyBatches });
    };

    const countCheckedNotDeleted = (batches: IGenericRecord[]): number => {
        let count = 0;
        batches.forEach((batch: IGenericRecord) => {
            if (!batch.is_delete) {
                if (batch.checked) {
                    count++;
                }
                batch.warehouses.forEach((warehouse: IGenericRecord) => {
                    if (warehouse.checked && !warehouse.is_delete) {
                        count++;
                    }
                });
            }
        });
        return count;
    };

    const handleChangeField = (value: string | number | boolean, name: string, idBatch: string, idWarehouse = ''): void => {
        const modifiedBatches = inventoryData.batches.map((batch: IGenericRecord) => {
            if (idWarehouse)
                return {
                    ...batch,
                    ...(batch.id === idBatch && {
                        warehouses: batch.warehouses.map((warehouse: IGenericRecord) => ({
                            ...warehouse,
                            ...(warehouse.id === idWarehouse && { [name]: value, is_output: isOutputInitial }),
                        })),
                    }),
                };
            return { ...batch, ...(batch.id === idBatch && { [name]: value, is_editable: true }) };
        });
        setCountCheckedElements(countCheckedNotDeleted(modifiedBatches));
        setInventoryData({ ...inventoryData, batches: modifiedBatches });
    };

    const handleChangeWarehouse = (option: IOptionSelect, idBatch: string, idWarehouse = ''): void => {
        const modifiedBatches = inventoryData.batches.map((batch: IGenericRecord) => {
            let copyWarehouses: IGenericRecord[] = [];
            if (idWarehouse && batch.id === idBatch) {
                const prevWarehouse = batch.warehouses.find((warehouse: IGenericRecord) => warehouse.id === idWarehouse);
                const foundWarehouse = warehousesList.find(warehouse => warehouse.id === option.id);
                const updateWarehouse = foundWarehouse
                    ? {
                          ...prevWarehouse,
                          id: foundWarehouse.id,
                          name: foundWarehouse.name,
                          date: currentDateInUnix(),
                          is_editable: true,
                          is_output: isOutputInitial,
                      }
                    : null;
                copyWarehouses = cloneDeep(batch.warehouses).map((warehouse: IGenericRecord) => ({
                    ...warehouse,
                    ...(warehouse.id === idWarehouse && { ...updateWarehouse }),
                }));

                if (!prevWarehouse.isNew) copyWarehouses.push({ ...prevWarehouse, is_delete: true });
            }
            return {
                ...batch,
                ...(batch.id === idBatch && {
                    warehouses: copyWarehouses,
                }),
            };
        });
        setInventoryData({ ...inventoryData, batches: modifiedBatches });
    };

    const getWarehousesExcluded = (idBatch: string): IGenericRecord[] => {
        const batch = inventoryData.batches.find((batch: IGenericRecord) => batch?.id === idBatch);
        const usedWarehouseIds = new Set(batch.warehouses.map((warehouse: IGenericRecord) => warehouse.id));
        const availableWarehouses = warehousesList?.filter(warehouse => {
            return !(usedWarehouseIds.has(warehouse.id) && !warehouse.is_delete);
        });

        return availableWarehouses;
    };

    const handleTrash = async (): Promise<void> => {
        const dataRequest = {
            unique_product_id: inventoryData.id,
            batches: inventoryData.batches.map((batch: IGenericRecord) => ({
                batch_id: batch.checked ? batch.id : null,
                batch_name: batch.checked ? batch.number : null,
                warehouses: batch.warehouses
                    .filter((warehouse: IGenericRecord) => warehouse.checked)
                    ?.map((warehouse: IGenericRecord) => warehouse.id),
            })),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await dispatch(validateDeletion([dataRequest]));

        const allInvoices = data
            .filter((item: IGenericRecord) => item.invoices.length)
            .map((product: IGenericRecord) => product.invoices)
            .flat();

        if (allInvoices.length) {
            setNonRemovableInventory(data);
            setShowConfirmDeleteModal(false);
            setShowModalErrorDelete(true);
            return;
        }
        updateData();
        setShowConfirmDeleteModal(false);
        setCountCheckedElements(NO_ELEMENT);
    };

    const updateData = (): void => {
        const allInvoices = nonRemovableInventory
            .filter((item: IGenericRecord) => item.invoices.length)
            .map((product: IGenericRecord) => product.invoices)
            .flat();

        const undeletedBatches = allInvoices
            .map((item: IGenericRecord) => item.batch_id)
            .filter((item: IGenericRecord) => !!item);
        const undeletedWarehouses = allInvoices.map((item: IGenericRecord) => item.warehouse_id);

        const modifiedBatches = inventoryData.batches.map((batch: IGenericRecord) => {
            if (batch.checked) {
                return {
                    ...batch,
                    ...(!undeletedBatches.includes(batch.id) && batch.checked ? { is_delete: true } : { is_delete: false }),
                    ...(batch.checked && undeletedBatches.includes(batch.id)
                        ? { checked: false }
                        : !undeletedBatches.includes(batch.id) && batch.checked
                        ? { checked: true }
                        : { checked: false }),
                };
            }
            return {
                ...batch,
                warehouses: batch.warehouses.map((warehouse: IGenericRecord) => ({
                    ...warehouse,
                    ...(warehouse.checked && undeletedWarehouses.includes(warehouse.id)
                        ? { checked: false }
                        : !undeletedWarehouses.includes(warehouse.id) && warehouse.checked
                        ? { checked: true }
                        : { checked: false }),
                    ...{ is_delete: !undeletedWarehouses.includes(warehouse.id) && warehouse.checked },
                })),
            };
        });

        const purgeBatches = modifiedBatches.filter((batch: IGenericRecord) => {
            if (batch.isNew === undefined || (batch.isNew && !batch.is_delete))
                return {
                    ...batch,
                    warehouses: batch.warehouses.filter(
                        (warehouse: IGenericRecord) => warehouse.isNew === undefined || (!warehouse.isNew && !warehouse.is_delete)
                    ),
                };
        });
        setInventoryData({ ...inventoryData, batches: purgeBatches });
        setInventoryData(deletedElementsVerify());
    };

    const validateRequiredFields = (): boolean => {
        setQuantityValidate(false);
        if (inventoryData.batches.filter((batch: IGenericRecord) => batch.is_delete).length === inventoryData.batches.length)
            return true;
        if (!inventoryData.batches.filter((batch: IGenericRecord) => !batch.is_delete).length) return false;
        for (const batch of inventoryData.batches) {
            if (
                inventoryData.is_perishable &&
                (!batch.number ||
                    !batch.date_expired ||
                    !batch.warehouses.filter((warehouse: IGenericRecord) => !warehouse.is_delete).length)
            ) {
                return false;
            }
            for (const warehouse of batch.warehouses) {
                if (!warehouse.name || !Number(warehouse.quantity)) {
                    return false;
                }
                if (warehouse?.originalValue && warehouse?.quantity > warehouse?.originalValue && isOutputInitial) {
                    setQuantityValidate(true);
                    return false;
                }
            }
        }
        setQuantityValidate(false);
        return true;
    };

    const handleSaveWebsiteInventory = (): void => {
        if (!validateRequiredFields()) {
            setValidate(true);
            return;
        }
        const dataToSend: IGenericRecord = {
            ...inventoryData,
        };

        if (!dataToSend.is_perishable) {
            const [first] = dataToSend.batches;
            const { warehouses } = first;
            dataToSend.batches = [{ ...EMPTY_BATCH, warehouses }];
        }
        if (dispatch(saveWarehouseInitialInventory(dataToSend))) {
            dataToSend.batches.map((batch: IGenericRecord) => {
                if (batch?.is_delete) {
                    batch.warehouses = batch.warehouses.map((warehouse: IGenericRecord) => ({
                        ...warehouse,
                        is_delete: batch?.is_delete,
                    }));
                }
            });
            handleShowModalSuccess();
            setBlockIsPerishable(true);
            if (dataToSend.batches.filter((batch: IGenericRecord) => batch?.is_delete).length === dataToSend.batches.length) {
                setBlockIsPerishable(false);
            }
        }
    };

    const totalsQuantities = useMemo(() => {
        const dataToUse = !isOutputInitial ? inventoryData : originalData;
        const totalAvailableForSale = dataToUse?.batches?.reduce((acc: number, batch: IGenericRecord) => {
            if (!batch.is_delete) {
                const batchTotal = batch?.warehouses?.reduce((batchAcc: number, warehouse: IGenericRecord) => {
                    if (!warehouse.is_delete && warehouse.name) {
                        const parsedQuantity = parseInt(warehouse.quantity) || 0;
                        return batchAcc + parsedQuantity;
                    }
                    return batchAcc;
                }, 0);
                return acc + batchTotal;
            }
            return acc;
        }, 0);

        const availablePerWarehouse = dataToUse?.batches?.reduce((acc: Record<string, number>, batch: IGenericRecord) => {
            if (!batch.is_delete) {
                batch.warehouses.forEach((warehouse: IGenericRecord) => {
                    if (!warehouse.is_delete && warehouse.name) {
                        const parsedQuantity = parseInt(warehouse.quantity) || 0;
                        acc[warehouse.name] = (acc[warehouse.name] || 0) + parsedQuantity;
                    }
                });
            }
            return acc;
        }, {});

        return {
            totalAvailableForSale,
            availablePerWarehouse,
        };
    }, [inventoryData.batches]);

    const toggleModalErrorDelete = (): void => {
        setShowModalErrorDelete(!showModalErrorDelete);
    };

    const togglePerishableModal = (): void => {
        setShowPerishableModal(!showPerishableModal);
    };

    const closeModalErrorDelete = (): void => {
        updateData();
        setShowConfirmDeleteModal(false);
        setShowModalErrorDelete(false);
    };
    return (
        <WebsiteInventoryContext.Provider
            value={{
                productServices,
                warehousesList,
                inventoryData,
                countCheckedElements,
                validate,
                blockIsPerishable,
                showSaveSuccess,
                showConfirmDeleteModal,
                handleChangeIsOutput,
                handleChangeIsPerishable,
                handleAddWarehouse,
                handleAddBatch,
                handleChangeField,
                handleChangeWarehouse,
                getWarehousesExcluded,
                handleTrash,
                handleSaveWebsiteInventory,
                handleShowModalSuccess,
                handleShowConfirmDeleteModal,
                handleSelectProduct,
                totalsQuantities,
                showModalErrorDelete,
                nonRemovableInventory,
                toggleModalErrorDelete,
                closeModalErrorDelete,
                includesBatchesToDelete,
                showPerishableModal,
                togglePerishableModal,
                originalData,
                quantityValidate,
            }}
        >
            {children}
        </WebsiteInventoryContext.Provider>
    );
};
