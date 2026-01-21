import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { RootState } from '@redux/rootReducer';
import { getWarehousesData, validateDeletion } from '@redux/warehouses/actions';
import { ProductDatabaseContext, UNIQUE_PRODUCT_INDEX } from '@pages/product-database/context';
import { TWO } from '@pages/purchasing-process/components/summary-table';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IOption, SelectSearch } from '@components/select-search';
import { DatePickerBase } from '@components/date-picker';
import { ModalCustom, ModalErrorDeleteInventory } from '@components/modal-custom';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Button, Link } from '@components/button';
import { Text } from '@components/table-input';
import { NumberInput } from '@components/input';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { ADD_INVENTORY } from '@information-texts/ProductDatabase';
import { IGenericRecord } from '@models/GenericRecord';
import { getUnixFromDate } from '@utils/Date';
import { getRouteName } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { ZERO } from '@constants/UtilsConstants';
import usePopper from '@hooks/usePopper';
import { InventoryTable, TableHeader } from './components';
import {
    IS_PERISHABLE_OPTIONS,
    MIN_QUANTITY,
    NO_ELEMENTS_TO_REMOVE,
    ONE_POSITION,
    UNIQUE_BATCH_INDEX,
    initialDataBatch,
    initialStateNonPerishable,
    initialStatePerishable,
    routes,
    rowWarehouse,
    rowsBatch,
} from '.';

import './AddInventory.scss';

export const AddInventory: React.FC<IGenericRecord> = ({ showCatalog }) => {
    const dispatch = useDispatch();

    const { toggleSection, data, setData, setDataTable, dataTable, edit, productEdit } = useContext(ProductDatabaseContext);

    const { warehouseList: warehouses } = useSelector((state: RootState) => state.warehouses);

    const warehouseList = warehouses?.data ?? [];

    const [listWarehousesDelete, setListWarehousesDelete] = useState<IGenericRecord>([]);
    const [listBatchesDelete, setListBatchesDelete] = useState<string[]>([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalWarningData, setShowModalWarningData] = useState<boolean>(false);
    const [newValuePerishable, setNewValuePerishable] = useState<boolean>(false);
    const [nonRemovableProducts, setNonRemovableProducts] = useState<IGenericRecord[]>([]);
    const [showModalErrorDelete, setShowModalErrorDelete] = useState(false);
    const [validation, setValidation] = useState(false);
    const [includesValidations, setIncludesValidations] = useState(false);

    const includesInventory = useMemo(
        () => productEdit.unique_products?.some((variant: IGenericRecord) => variant.initial_inventory.batches.length),
        [productEdit]
    );

    const { anchorEl: anchorDescription, mouseProps: mouseDescription } = usePopper();

    const searchBatchName = (id: string): string => {
        const batches = productEdit.unique_products.map((product: IGenericRecord) => product.initial_inventory.batches).flat();
        const nameBatch = batches?.find((batch: IGenericRecord) => batch.id === id)?.number;
        return nameBatch ?? '';
    };

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getWarehousesData(true))]);
        })();
    }, []);

    useEffect(() => {
        if (!data.unique_products?.[UNIQUE_PRODUCT_INDEX].batches?.length) {
            const dataWithBatches = data.unique_products.map((variant: IGenericRecord) => ({
                ...variant,
                batches: initialDataBatch(uuid(), uuid()),
            }));

            setData(data => ({ ...data, unique_products: dataWithBatches }));

            const newDataTable =
                dataWithBatches?.flatMap((variant: IGenericRecord) => {
                    return variant.is_perishable ? initialStatePerishable(variant) : initialStateNonPerishable(variant);
                }) || [];
            setDataTable(newDataTable);
        }
    }, []);

    useEffect(() => {
        setIncludesValidations(edit);
    }, [edit]);

    const toggleDeleteWarehouses = ({ variantId, warehouseId }: IGenericRecord): void => {
        setIncludesValidations(true);
        setListWarehousesDelete((listBatchesDelete: IGenericRecord) => {
            const currentBatches = listBatchesDelete[variantId] || [];
            return currentBatches.includes(warehouseId)
                ? {
                      ...listBatchesDelete,
                      [variantId]: currentBatches.filter((id: string) => id !== warehouseId),
                  }
                : {
                      ...listBatchesDelete,
                      [variantId]: [...currentBatches, warehouseId],
                  };
        });
    };

    const toggleDeleteBatches = ({ batchesId }: IGenericRecord): void => {
        setListBatchesDelete((listBatchesDelete: string[]) =>
            listBatchesDelete.includes(batchesId)
                ? listBatchesDelete?.filter((id: string) => id !== batchesId)
                : [...listBatchesDelete, batchesId]
        );
    };

    const togglePerishable = (value: boolean): void => {
        const newVariants = data.unique_products?.map((variant: IGenericRecord) => ({
            ...variant,
            is_perishable: value,
            batches: initialDataBatch(uuid(), uuid()),
        }));
        setData((data: IGenericRecord) => ({ ...data, unique_products: newVariants }));
        const newDataTable = newVariants.flatMap((uniqueProduct: IGenericRecord) =>
            value ? initialStatePerishable(uniqueProduct) : initialStateNonPerishable(uniqueProduct)
        );
        setIncludesValidations(!includesValidations);
        setDataTable(newDataTable);
        setShowModalWarningData(false);
    };

    const hoverVariants = {
        mouseProps: { ...mouseDescription },
        anchorElTitle: anchorDescription,
        description: ADD_INVENTORY.SUB_TITLE_DESCRIPTION,
    };

    const addWarehouse = (indexPosition: number, variant: IGenericRecord): void => {
        const newWarehouseId = uuid();
        const countByVariantsId = dataTable.filter(item => item.variantId === variant.variantId).length;
        const newArray = [...dataTable];
        newArray.splice(indexPosition, NO_ELEMENTS_TO_REMOVE, rowWarehouse(variant, newWarehouseId));
        const formattedData = newArray.map(item =>
            item.variantId === variant.variantId
                ? { ...item, totalRows: countByVariantsId + ONE_POSITION, rowBatches: item.rowBatches + ONE_POSITION }
                : item
        );

        setDataTable(formatData(formattedData));

        const newData = data.unique_products.map((item: IGenericRecord) =>
            variant.variantId === item.id
                ? {
                      ...item,
                      batches: item.batches.map((batch: IGenericRecord) =>
                          batch.id === variant.batchesId
                              ? {
                                    ...batch,
                                    warehouses: [
                                        ...batch.warehouses,
                                        {
                                            date: '',
                                            id: '',
                                            idReference: newWarehouseId,
                                            name: '',
                                            quantity: ZERO,
                                            rowWarehouse: ONE_POSITION,
                                            batch_detail_id: null,
                                            purchase_detail_id: null,
                                            inventory_transaction_detail_id: null,
                                            is_editable: true,
                                        },
                                    ],
                                }
                              : batch
                      ),
                  }
                : item
        );

        setData(data => ({ ...data, unique_products: newData }));
        setIncludesValidations(true);
    };

    const handleChangeWarehouses = (
        value: string,
        name: string,
        position: number,
        variantId: string,
        batchesId: string,
        warehouseId: string
    ): void => {
        setIncludesValidations(true);
        setDataTable(dataTable =>
            dataTable.map((row: IGenericRecord, index: number) => (position === index ? { ...row, [name]: value } : row))
        );

        const warehouseData = warehouseList?.find(item => item.id === value);

        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((variant: IGenericRecord) =>
                variant.id === variantId
                    ? {
                          ...variant,
                          batches: variant.batches.map((batches: IGenericRecord) =>
                              batches.id === batchesId
                                  ? {
                                        ...batches,
                                        warehouses: batches.warehouses.map((warehouse: IGenericRecord) =>
                                            warehouse.idReference === warehouseId
                                                ? {
                                                      ...warehouse,
                                                      [name]: value,
                                                      ...(name === 'id' && warehouseData ? { name: warehouseData.name } : {}),
                                                  }
                                                : warehouse
                                        ),
                                    }
                                  : batches
                          ),
                      }
                    : variant
            ),
        }));
    };

    const handleChangeBatches = (value: IGenericRecord, variantId: string, batchesId: string): void => {
        setIncludesValidations(true);
        setDataTable(dataTable =>
            dataTable.map((row: IGenericRecord) =>
                row.variantId === variantId && row.batchesId === batchesId ? { ...row, lot: value } : row
            )
        );
        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((item: IGenericRecord) =>
                item.id === variantId
                    ? {
                          ...item,
                          batches: item.batches.map((batch: IGenericRecord) =>
                              batch.id === batchesId ? { ...batch, number: value } : batch
                          ),
                      }
                    : item
            ),
        }));
    };

    const formatData = (data: IGenericRecord[]): IGenericRecord[] => {
        const groupedData = data.reduce((acc, item) => {
            if (!acc[item.variantId]) {
                acc[item.variantId] = [];
            }
            acc[item.variantId].push(item);
            return acc;
        }, {});

        const quantityBatches: Record<string, number> = {};

        data.forEach(item => {
            if (!item.addBatch && item.batchesId) {
                quantityBatches[item.batchesId] = (quantityBatches[item.batchesId] || 0) + 1;
            }
        });
        const reformedData = Object.values(groupedData).flatMap(group => {
            return group.map((item: IGenericRecord, index: number) => {
                if (index === 0) {
                    return {
                        ...item,
                        render: true,
                        renderBatch: true,
                        totalRows: group.length,
                        rowBatches: quantityBatches?.[item.batchesId],
                    };
                }
                return {
                    ...item,
                    render: false,
                    renderBatch: false,
                    rowBatches: quantityBatches?.[item.batchesId],
                };
            });
        });

        const updatedBatches: Record<string, boolean> = {};

        const updateRenderBatch = reformedData.map(item => {
            if (Object.keys(quantityBatches)?.includes(item.batchesId) && !updatedBatches[item.batchesId]) {
                updatedBatches[item.batchesId] = true;
                return {
                    ...item,
                    renderBatch: true,
                };
            }
            return item;
        });

        return updateRenderBatch;
    };

    const validateProductDeletion = (): IGenericRecord[] => {
        const dataRequest: Record<string, IGenericRecord> = {};
        data.unique_products.forEach((variant: IGenericRecord) => {
            variant.batches.forEach((batch: IGenericRecord) => {
                const dataWarehouses = batch.warehouses
                    ?.filter((warehouse: IGenericRecord) => listWarehousesSelected.includes(warehouse.idReference))
                    ?.map((warehouse: IGenericRecord) => warehouse.id);
                if (listBatchesDelete.includes(batch.id)) {
                    if (dataRequest[variant.id]) {
                        dataRequest[variant.id] = {
                            ...dataRequest[variant.id],
                            [batch.id]: dataWarehouses,
                        };
                    } else {
                        dataRequest[variant.id] = {
                            [batch.id]: dataWarehouses,
                        };
                    }
                }
                if (dataWarehouses.length) {
                    if (dataRequest[variant.id]) {
                        dataRequest[variant.id] = {
                            ...dataRequest[variant.id],
                            noBatch: dataWarehouses,
                        };
                    } else {
                        dataRequest[variant.id] = {
                            noBatch: dataWarehouses,
                        };
                    }
                }
            });
        });

        const newData = Object.keys(dataRequest)?.map(variantId => {
            const batchesId = Object.keys(dataRequest[variantId]);
            return {
                unique_product_id: variantId,
                batches: batchesId?.map((batchKey: string, index: number) => {
                    return {
                        batch_id: batchesId[index] === 'noBatch' ? null : batchesId[index],
                        batch_name: searchBatchName(batchesId[index]),
                        warehouses: dataRequest[variantId]?.[batchKey] ?? [],
                    };
                }),
            };
        });

        return newData;
    };

    const deleteWarehouses = async (): Promise<void> => {
        if (edit) {
            const request: IGenericRecord[] = validateProductDeletion();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await dispatch(validateDeletion(request));

            const errorDeletingInventory = data.filter((item: IGenericRecord) => item !== null);
            if (errorDeletingInventory.some((item: IGenericRecord) => item.invoices?.length)) {
                setNonRemovableProducts(errorDeletingInventory);
                setShowModalErrorDelete(true);

                return;
            }
        }

        updateData();
    };

    const updateData = (): void => {
        const nonRemoveWarehouseIds = nonRemovableProducts.reduce((acc, product) => {
            const { unique_product_id, invoices } = product;
            const warehouseIds = [...new Set(invoices.map((invoice: IGenericRecord) => invoice.warehouse_id))];
            acc[unique_product_id] = warehouseIds;

            return acc;
        }, {});

        const warehousesReference = dataTable
            .filter(item => nonRemoveWarehouseIds[item.variantId]?.includes(item.warehouse) && !item.addWarehouse)
            .map(item => item.warehouseId);

        const nonRemoveBatchIds = nonRemovableProducts?.flatMap((product: IGenericRecord) =>
            product.invoices.map((invoice: IGenericRecord) => invoice.batch_id).filter((batch_id: string) => batch_id !== null)
        );

        const newListWarehouses = listWarehousesSelected.filter(item => !warehousesReference.includes(item));

        const newListBatches = [...listBatchesDelete.filter(item => !nonRemoveBatchIds.includes(item))];

        const newData = dataTable.filter(item => {
            if (!item.addBatch && newListBatches.includes(item.batchesId)) {
                return false;
            }
            if (item.addWarehouse || item.addBatch || !newListWarehouses.includes(item.warehouseId)) {
                return true;
            }

            return false;
        });

        setDataTable(formatData(newData));

        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((variant: IGenericRecord) => ({
                ...variant,
                batches: variant.batches
                    .filter((batch: IGenericRecord) => !newListBatches?.includes(batch.id))
                    .map((batch: IGenericRecord) => ({
                        ...batch,
                        warehouses: batch.warehouses.filter(
                            (warehouse: IGenericRecord) => !newListWarehouses?.includes(warehouse.idReference)
                        ),
                    })),
                delete_inventory: ((): IGenericRecord[] => {
                    const deletedBatches = variant.batches
                        .filter(
                            (batch: IGenericRecord) =>
                                newListBatches?.includes(batch.id) ||
                                batch.warehouses.some((warehouse: IGenericRecord) =>
                                    newListWarehouses?.includes(warehouse.idReference)
                                )
                        )
                        .map((batch: IGenericRecord) => ({
                            ...batch,
                            ...(newListBatches?.includes(batch.id) ? { is_delete: true } : {}),
                            warehouses: newListBatches?.includes(batch.id)
                                ? batch.warehouses.map((item: IGenericRecord) => ({ ...item, is_delete: true }))
                                : batch.warehouses
                                      .filter((warehouse: IGenericRecord) => newListWarehouses?.includes(warehouse.idReference))
                                      .map((item: IGenericRecord) => ({ ...item, is_delete: true })),
                        }));
                    return deletedBatches.length > 0 ? deletedBatches : [];
                })(),
            })),
        }));

        setListWarehousesDelete([]);
        setListBatchesDelete([]);
        setShowModalErrorDelete(false);
        setShowModalDelete(false);
    };

    const listWarehousesSelected = useMemo(() => {
        return Object.values(listWarehousesDelete).flat();
    }, [listWarehousesDelete]);

    const handleChangeData = (newDate: number, variantId: string, batchId: string): void => {
        setIncludesValidations(true);
        setDataTable(
            dataTable.map(row =>
                row.variantId === variantId && row.batchesId === batchId ? { ...row, dateBatch: newDate } : row
            )
        );
        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((item: IGenericRecord) =>
                item.id === variantId
                    ? {
                          ...item,
                          batches: item.batches.map((batch: IGenericRecord) =>
                              batch.id === batchId ? { ...batch, date_expired: newDate } : batch
                          ),
                      }
                    : item
            ),
        }));
    };

    const calculateTotalUnits = (): number => {
        return data?.unique_products?.reduce((acc: number, product: IGenericRecord) => {
            return (
                acc +
                product.batches?.reduce((batchAcc: number, batch: IGenericRecord) => {
                    return (
                        batchAcc +
                        batch.warehouses?.reduce((warehouseAcc: number, warehouse: IGenericRecord) => {
                            return warehouseAcc + Number(warehouse.quantity);
                        }, 0)
                    );
                }, 0)
            );
        }, 0);
    };

    const getWarehouseUnits = (): IGenericRecord[] => {
        const warehouseMap: Record<string, number> = {};

        const accumulateWarehouseUnits = (warehouses: IGenericRecord[]): void => {
            warehouses.forEach(warehouse => {
                const warehouseName = warehouse.name;
                const warehouseQuantity = parseInt(warehouse.quantity);

                if (warehouseMap[warehouseName]) {
                    warehouseMap[warehouseName] += warehouseQuantity;
                } else {
                    warehouseMap[warehouseName] = warehouseQuantity;
                }
            });
        };

        data.unique_products?.forEach((variant: IGenericRecord) => {
            if ('batches' in variant) {
                variant.batches?.forEach((batch: IGenericRecord) => accumulateWarehouseUnits(batch.warehouses));
            }
        });

        const result = Object.entries(warehouseMap).map(([name, units]) => ({
            name,
            units,
        }));

        return result;
    };

    const totalUnits = useMemo(() => calculateTotalUnits(), [data.unique_products]);

    const modifiedInventory = useMemo(
        () =>
            data.unique_products.some((variant: IGenericRecord) =>
                variant.batches?.some(
                    (batch: IGenericRecord) =>
                        batch.number ||
                        batch.date_expired ||
                        batch.warehouses?.some((warehouse: IGenericRecord) => warehouse.id || warehouse.quantity)
                )
            ),
        [data.unique_products]
    );

    const hasEmptyField = (): boolean => {
        const isPerishable = edit
            ? data.unique_products[UNIQUE_PRODUCT_INDEX]?.batches[UNIQUE_BATCH_INDEX]?.is_perishable
            : data.unique_products[UNIQUE_PRODUCT_INDEX]?.is_perishable ?? false;

        return data.unique_products.some((variant: IGenericRecord) =>
            variant.batches.some(
                (batch: IGenericRecord) =>
                    (isPerishable && (!batch.number || !batch.date_expired)) ||
                    batch.warehouses.length === ZERO ||
                    batch.warehouses.some((warehouse: IGenericRecord) => !warehouse.id || warehouse.quantity <= ZERO)
            )
        );
    };

    const warehouseUnits = useMemo(() => {
        const units = getWarehouseUnits();
        return units.filter(item => item.name);
    }, [data.unique_products]);

    const cleanBatchesData = (): void => {
        const emptyFields = hasEmptyField();

        if (emptyFields && includesValidations) {
            return setValidation(emptyFields);
        }
        toggleSection('inventory');
        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((variant: IGenericRecord) => ({
                ...variant,
                batches: variant.batches
                    .map((batch: IGenericRecord) => ({
                        ...batch,
                        warehouses: batch.warehouses.filter(
                            (warehouse: IGenericRecord) => warehouse.id && warehouse.quantity > MIN_QUANTITY
                        ),
                    }))
                    .filter((batch: IGenericRecord) => batch.warehouses.length > MIN_QUANTITY),
            })),
        }));
    };

    const addBatch = (indexPosition: number, variant: IGenericRecord): void => {
        const batchId = uuid();
        const WarehouseId = uuid();

        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((product: IGenericRecord) =>
                product.id === variant.variantId
                    ? {
                          ...product,
                          batches: [...product.batches, ...initialDataBatch(batchId, WarehouseId)],
                      }
                    : product
            ),
        }));

        const countByVariantsId = dataTable.filter(item => item.variantId === variant.variantId).length;
        const newArray = [...dataTable];
        newArray.splice(indexPosition, NO_ELEMENTS_TO_REMOVE, ...rowsBatch(variant, batchId, WarehouseId));
        const formattedData = newArray.map(item =>
            item.variantId === variant.variantId
                ? { ...item, totalRows: countByVariantsId + ONE_POSITION, rowBatches: item.rowBatches + ONE_POSITION }
                : item
        );
        setDataTable(formatData(formattedData));
    };

    const warehousesFilter = (variant: string): IOption[] => {
        const warehousesSelected: { [key: string]: string[] } = {};
        data.unique_products?.forEach((variant: IGenericRecord) =>
            variant.batches?.forEach((batch: IGenericRecord) =>
                batch.warehouses?.forEach((warehouse: IGenericRecord) => {
                    if (warehousesSelected[variant.id]) {
                        warehousesSelected[variant.id].push(warehouse.id);
                    } else {
                        warehousesSelected[variant.id] = [warehouse.id];
                    }
                })
            )
        );
        return warehouseList
            ?.filter(warehouse => !warehousesSelected[variant]?.includes(warehouse.id))
            ?.map(warehouse => ({
                name: warehouse.name,
                value: warehouse.id,
            }));
    };

    const sendWarning = (perishable: boolean): void => {
        setShowModalWarningData(true);
        setNewValuePerishable(perishable);
    };

    const idsOddPosition = useMemo(
        () =>
            data.unique_products
                .filter((_: IGenericRecord, index: number) => index % TWO !== ZERO)
                ?.map((variant: IGenericRecord) => variant.id),
        [data.unique_products]
    );

    const checkEmptyWarehousesInBatch = (id: string): boolean => {
        return data.unique_products.some(
            (variant: IGenericRecord) =>
                variant.id === id && variant.batches.some((batch: IGenericRecord) => batch.warehouses.length === ZERO)
        );
    };

    return (
        <div className="add-inventory">
            <ModalCustom
                id={generateId({
                    module: ModuleApp.MODALS,
                    submodule: 'product-service-database-inventory',
                    action: ActionElementType.ADD,
                    elementType: ElementType.MDL,
                })}
                show={showModalDelete}
                removeMinWidth
                classesModal="add-inventory__modal-wrapper"
                showModal={(): void => setShowModalDelete(!showModalDelete)}
                closeIcon={false}
            >
                <Icon name="trashMulticolor" classIcon="w-22" />
                <Information
                    title={`Eliminar ${listBatchesDelete.length ? 'lote' : 'bodega'}`}
                    description="¿Está seguro que desea eliminar la información seleccionada?"
                    classNameTitle="text-center mt-2"
                    classNameDescription="text-center mt-2"
                    classNameSubContainer="flex flex-col justify-center items-center"
                />
                <div className="flex gap-4.5 mt-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: 'product-service-database-inventory',
                            action: ActionElementType.CANCEL,
                            elementType: ElementType.BTN,
                        })}
                        text="Cancelar"
                        onClick={(): void => setShowModalDelete(!showModalDelete)}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: 'product-service-database-inventory',
                            action: ActionElementType.DELETE,
                            elementType: ElementType.BTN,
                        })}
                        text="Eliminar"
                        onClick={deleteWarehouses}
                    />
                </div>
            </ModalCustom>
            <div>
                <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-base" />
                <BreadCrumb routes={routes(showCatalog, (): void => toggleSection('inventory'))} />
                <Information title={ADD_INVENTORY.TITLE} color="blue" classNameTitle="product-management__title" />
                <Information title={ADD_INVENTORY.SUB_TITLE} color="blue" hoverIcon={hoverVariants} />
                {ADD_INVENTORY.TEXT_DESCRIPTION}
                <div className="flex justify-end add-inventory__content-thrash">
                    <Icon
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'database-inventory',
                            action: ActionElementType.TRASH,
                            elementType: ElementType.ICO,
                        })}
                        name="trashBlue"
                        onClick={(): void =>
                            setShowModalDelete(showModalDelete =>
                                listWarehousesSelected.length || listBatchesDelete.length ? !showModalDelete : showModalDelete
                            )
                        }
                        className="w-5.5 h-5.5 cursor-pointer"
                    />
                </div>
                <Table
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: 'database-inventory',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    headerRowsCustom={<TableHeader />}
                    isHeaderRowsCustom
                    customTable
                    data={[]}
                    className="add-inventory__table-container"
                >
                    {dataTable.map((variant: IGenericRecord, indexRender) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                submodule: `database-inventory-variant-${variant.variantId}-${indexRender}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={`variant-${variant.variantId}-${indexRender}`}
                            className={`${idsOddPosition.includes(variant.variantId) ? 'bg-gray-light' : 'bg-white'}`}
                        >
                            {variant.render && (
                                <td className="px-2 border-b border-gray text-gray" rowSpan={variant.totalRows}>
                                    {variant?.variant || variant?.variantName}
                                </td>
                            )}
                            {variant.render && (
                                <td className="px-2 border-b border-gray text-gray" rowSpan={variant.totalRows}>
                                    {variant?.variantName}
                                </td>
                            )}
                            {variant.render && (
                                <td className="border-b border-gray " rowSpan={variant.totalRows}>
                                    <SelectSearch
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                            submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-is-perishable`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        onChange={({ value }): void => {
                                            const newValue = value === 'perishable';
                                            if (variant.is_perishable === newValue) return;
                                            modifiedInventory ? sendWarning(newValue) : togglePerishable(newValue);
                                        }}
                                        options={IS_PERISHABLE_OPTIONS}
                                        value={variant.is_perishable ? 'perishable' : 'non-perishable'}
                                        inputClass="text-left"
                                        disabled={edit && includesInventory}
                                    />
                                </td>
                            )}
                            {variant.is_perishable ? (
                                <>
                                    {variant.addBatch ? (
                                        <td className="h-10 border-b border-gray" colSpan={4}>
                                            <Link
                                                id={generateId({
                                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                    submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-add-batch`,
                                                    action: ActionElementType.INFO,
                                                    elementType: ElementType.LNK,
                                                })}
                                                text="+ Agregar lote"
                                                href="#"
                                                classes="text-base  mt-2"
                                                onClick={(): void => addBatch(indexRender, variant)}
                                            />
                                        </td>
                                    ) : (
                                        <>
                                            {variant.renderBatch && (
                                                <td
                                                    className={`border-b border-gray ${
                                                        validation && !variant.lot ? 'border-purple' : ''
                                                    }`}
                                                    rowSpan={variant.rowBatches}
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-5 h-5 mx-auto border rounded border-gray cursor-pointer ${
                                                                listBatchesDelete.includes(variant.batchesId)
                                                                    ? 'bg-blue'
                                                                    : 'bg-transparent'
                                                            }`}
                                                            onClick={(): void => toggleDeleteBatches(variant)}
                                                        />
                                                        <Text
                                                            text={variant.lot}
                                                            editTable
                                                            className="add-inventory__table-input-batch"
                                                            onChange={({ target: { value } }: IGenericRecord): void => {
                                                                handleChangeBatches(value, variant.variantId, variant.batchesId);
                                                            }}
                                                            placeholder="..."
                                                        />
                                                    </div>
                                                </td>
                                            )}
                                            {variant.renderBatch && (
                                                <td
                                                    className={`border-b border-gray ${
                                                        validation && !variant.dateBatch ? 'border-purple' : ''
                                                    }`}
                                                    rowSpan={variant.rowBatches}
                                                >
                                                    <div className="flex flex-row justify-center w-full h-full">
                                                        <DatePickerBase
                                                            id={generateId({
                                                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                                submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-date-batch`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.TXT,
                                                            })}
                                                            dateFormat="dd/MM/yyyy"
                                                            className={`'date-picker__text' ${
                                                                idsOddPosition.includes(variant.variantId)
                                                                    ? 'bg-gray-light'
                                                                    : 'bg-white'
                                                            }`}
                                                            onChangeDate={(date: Date): void => {
                                                                handleChangeData(
                                                                    getUnixFromDate(date),
                                                                    variant.variantId,
                                                                    variant.batchesId
                                                                );
                                                            }}
                                                            selected={variant.dateBatch}
                                                            showPlaceHolderDate={true}
                                                        />
                                                        <Icon name="calendarGreen" alt="calendar" className="w-6" />
                                                    </div>
                                                </td>
                                            )}
                                            {variant.addWarehouse ? (
                                                <td
                                                    className={`h-10 border-b border-gray ${
                                                        validation && checkEmptyWarehousesInBatch(variant.variantId)
                                                            ? 'border-purple'
                                                            : ''
                                                    }`}
                                                    colSpan={2}
                                                >
                                                    <Link
                                                        id={generateId({
                                                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                            submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-add-warehouse`,
                                                            action: ActionElementType.ADD,
                                                            elementType: ElementType.LNK,
                                                        })}
                                                        text="+ Agregar bodega"
                                                        href="#"
                                                        classes="text-base mt-2"
                                                        onClick={(): void => addWarehouse(indexRender, variant)}
                                                    />
                                                </td>
                                            ) : (
                                                <>
                                                    <td
                                                        className={`h-10 border-b border-gray ${
                                                            validation && !Number(variant.quantity) ? 'border-purple' : ''
                                                        }`}
                                                    >
                                                        <NumberInput
                                                            id={generateId({
                                                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                                submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-quantity`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.TXT,
                                                            })}
                                                            classesWrapper="w-26"
                                                            isTransparent
                                                            classesWrapperInput="border-none"
                                                            value={variant.quantity}
                                                            name="quantity"
                                                            integerNumbers
                                                            placeholder="..."
                                                            onChange={({ target: { value } }: IGenericRecord): void => {
                                                                handleChangeWarehouses(
                                                                    value,
                                                                    'quantity',
                                                                    indexRender,
                                                                    variant.variantId,
                                                                    variant.batchesId,
                                                                    variant.warehouseId
                                                                );
                                                            }}
                                                            classesInput="add-inventory__table-units-warehouse"
                                                        />
                                                    </td>
                                                    <td
                                                        className={`h-10 border-b border-gray ${
                                                            validation && !variant.id ? 'border-purple' : ''
                                                        }`}
                                                    >
                                                        <SelectSearch
                                                            id={generateId({
                                                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                                submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-select-warehouse`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.DRP,
                                                            })}
                                                            onChange={({ value }): void => {
                                                                handleChangeWarehouses(
                                                                    value,
                                                                    'id',
                                                                    indexRender,
                                                                    variant.variantId,
                                                                    variant.batchesId,
                                                                    variant.warehouseId
                                                                );
                                                            }}
                                                            options={warehousesFilter(variant.variantId)}
                                                            allOptions={warehousesFilter('')}
                                                            value={variant.id}
                                                            inputClass="text-left"
                                                        />
                                                    </td>

                                                    <td className="h-10 bg-gray-transparent">
                                                        <div
                                                            className={`w-5 h-5 mx-auto border rounded border-gray cursor-pointer ${
                                                                listWarehousesSelected.includes(variant.warehouseId)
                                                                    ? 'bg-blue'
                                                                    : 'bg-transparent'
                                                            }`}
                                                            onClick={(): void => toggleDeleteWarehouses(variant)}
                                                        />
                                                    </td>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {variant.render && (
                                        <td className="border-b border-gray " rowSpan={variant.totalRows}>
                                            <Text text="N/A" editTable={false} className="text-gray" />
                                        </td>
                                    )}
                                    {variant.render && (
                                        <td className="border-b border-gray" rowSpan={variant.totalRows}>
                                            <Text text="N/A" editTable={false} className="text-gray" />
                                        </td>
                                    )}
                                    {variant.addWarehouse ? (
                                        <td
                                            className={`h-10 border-b border-gray ${
                                                validation && checkEmptyWarehousesInBatch(variant.variantId)
                                                    ? 'border-purple'
                                                    : ''
                                            }`}
                                            colSpan={2}
                                        >
                                            <Link
                                                id={generateId({
                                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                    submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-warehouse`,
                                                    action: ActionElementType.ADD,
                                                    elementType: ElementType.LNK,
                                                })}
                                                text="+ Agregar bodega"
                                                href="#"
                                                classes="text-base mt-2"
                                                onClick={(): void => {
                                                    addWarehouse(indexRender, variant);
                                                }}
                                            />
                                        </td>
                                    ) : (
                                        <>
                                            <td
                                                className={`h-10 border-b border-gray ${
                                                    validation && !Number(variant.quantity) ? 'border-purple' : ''
                                                }`}
                                            >
                                                <NumberInput
                                                    id={generateId({
                                                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                        submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-quantity`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    classesWrapper="w-26"
                                                    isTransparent
                                                    classesWrapperInput="border-none"
                                                    value={variant.quantity}
                                                    name="quantity"
                                                    integerNumbers
                                                    placeholder="..."
                                                    onChange={({ target: { value } }: IGenericRecord): void => {
                                                        handleChangeWarehouses(
                                                            value,
                                                            'quantity',
                                                            indexRender,
                                                            variant.variantId,
                                                            variant.batchesId,
                                                            variant.warehouseId
                                                        );
                                                    }}
                                                    classesInput="add-inventory__table-units-warehouse"
                                                />
                                            </td>
                                            <td
                                                className={`h-10 border-b border-gray ${
                                                    validation && !variant.id ? 'border-purple' : ''
                                                }`}
                                            >
                                                <SelectSearch
                                                    id={generateId({
                                                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                                        submodule: `database-inventory-variant-${variant.variantId}-${indexRender}-select-variant`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    onChange={({ value }): void => {
                                                        handleChangeWarehouses(
                                                            value,
                                                            'id',
                                                            indexRender,
                                                            variant.variantId,
                                                            variant.batchesId,
                                                            variant.warehouseId
                                                        );
                                                    }}
                                                    options={warehousesFilter(variant.variantId)}
                                                    allOptions={warehousesFilter('')}
                                                    value={variant.id}
                                                    inputClass="text-left"
                                                />
                                            </td>
                                            <td className="h-10 bg-gray-transparent">
                                                <div
                                                    className={`cursor-pointer w-5 h-5 mx-auto border rounded border-gray ${
                                                        listWarehousesSelected.includes(variant.warehouseId)
                                                            ? 'bg-blue'
                                                            : 'bg-transparent'
                                                    }`}
                                                    onClick={(): void => toggleDeleteWarehouses(variant)}
                                                />
                                            </td>
                                        </>
                                    )}
                                </>
                            )}
                        </tr>
                    ))}
                </Table>
                {validation && hasEmptyField() && (
                    <label className="self-end text-tiny text-purple mr-1.5 ml-7 text-right leading-xtiny mt-1">
                        *Campo obligatorio
                    </label>
                )}
            </div>
            <InventoryTable totalUnits={totalUnits} warehouseUnits={warehouseUnits} />
            <ModalCustom
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: `database-inventory-warning`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={!!showModalWarningData}
                removeMinWidth
                classesModal="add-inventory__modal-wrapper"
                showModal={(): void => setShowModalWarningData(false)}
                closeIcon={false}
            >
                <Icon name="triangleInfoMulticolor" classIcon="w-22" />
                <Information
                    title="Información"
                    description="Si realiza este cambio se borrara la información agregada."
                    classNameTitle="text-center mt-2"
                    classNameDescription="text-center mt-2"
                    classNameSubContainer="flex flex-col justify-center items-center"
                />
                <div className="flex gap-4.5 mt-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `database-inventory-warning`,
                            action: ActionElementType.CANCEL,
                            elementType: ElementType.BTN,
                        })}
                        text="Cancelar"
                        onClick={(): void => setShowModalWarningData(false)}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `database-inventory-warning`,
                            action: ActionElementType.DELETE,
                            elementType: ElementType.BTN,
                        })}
                        text="Eliminar"
                        onClick={(): void => togglePerishable(newValuePerishable)}
                    />
                </div>
            </ModalCustom>
            <ModalErrorDeleteInventory
                data={nonRemovableProducts}
                showModalError={showModalErrorDelete}
                closeModal={(): void => setShowModalErrorDelete(!showModalErrorDelete)}
                accept={updateData}
            />
            <PageButtonsFooter
                moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                titleButtonLeft="Atras"
                onClickButtonLeft={(): void => {
                    cleanBatchesData();
                }}
            />
        </div>
    );
};
