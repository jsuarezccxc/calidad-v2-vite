import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { IOptionSelect } from '@components/input';
import { IPaginatorBackendObj } from '@components/paginator-backend';
import {
    DATE_OPTION,
    DEFAULT_DATA,
    ITableCustom,
    ITableTotal,
    PRODUCT_OPTION,
    SELECT_KEY_REPORT,
    SalesAndPurchaseAccountingReport,
    WAREHOUSE_OPTION,
    createWarehouseOptions,
} from '@components/sales-and-purchase-accounting-report';
import { paginationDataFormat } from '@constants/PaginationBack';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getInvoiceWebsite, setShoppingWebsite } from '@redux/invoice-website/action';
import { ISalesData } from '@redux/invoice-website/types';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { currentDateInUnix, getUnixFromDate } from '@utils/Date';
import { getQuantities, getTotalWarehouse } from '@utils/InvoiceWebsite';
import { getRoute } from '@utils/Paths';
import { INITIAL_ITEM_TOTAL, QUANTITY_TYPE, TOOLTIP_INFORMATION, dataTableTotal, headersTable, routes } from '.';

const ShoppingReportProductWarehouse: React.FC = () => {
    const dispatch = useDispatch();

    const { shopping } = useSelector((state: RootState) => state.invoiceWebsite);
    const {
        warehouseList: { data: warehouseList },
    } = useSelector((state: RootState) => state.warehouses);

    const [filterWarehouse, setFilterWarehouse] = useState({ warehouseId: '', warehouseName: 'Todas' });
    const [filterData, setFilterData] = useState({ product: '', productName: '', date: currentDateInUnix() });
    const [warehouseOptions, setWarehouseOptions] = useState<IOptionSelect[]>([]);
    const [data, setData] = useState<IPaginatorBackendObj<ISalesData>>(shopping);
    useEffect(() => {
        if (filterData.product) {
            dispatch(
                getInvoiceWebsite(
                    {
                        product_id: filterData.product,
                        start_date: filterData.date,
                    },
                    'shopping'
                )
            );
        } else {
            dispatch(setShoppingWebsite({ ...paginationDataFormat, data: DEFAULT_DATA }));
        }
    }, [filterData]);

    const handleFilters = (option: IOptionSelect | IGenericRecord): void => {
        if (option.type === WAREHOUSE_OPTION) {
            setFilterWarehouse({ ...filterWarehouse, warehouseId: option?.id, warehouseName: option?.value });
            return;
        }
        setFilterData({
            ...filterData,
            [option.type]: option.type === DATE_OPTION ? getUnixFromDate(option.value) : option.id,
            productName: option.type === DATE_OPTION ? filterData.productName : option.value,
        });

        option.type === PRODUCT_OPTION && setFilterWarehouse({ ...filterWarehouse, warehouseId: '', warehouseName: '' });
    };

    const getDataProducts = (): ITableCustom[] => {
        return (
            data?.data?.details
                ?.filter(item =>
                    item.quantities.some(
                        warehouse => !filterWarehouse.warehouseId || warehouse.warehouse_id === filterWarehouse.warehouseId
                    )
                )
                .map(item => ({
                    ...item,
                    id: uuid(),
                    quantities: getQuantities(item?.quantities, filterWarehouse.warehouseId),
                    productId: filterData.product,
                })) || []
        );
    };

    useEffect(() => {
        setWarehouseOptions(createWarehouseOptions(warehouseList, getDataProducts()));
        setData(shopping);
    }, [shopping, filterData]);

    const getDataTotal = (): ITableTotal[] => {
        if (!getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId)?.warehouseTotals?.length) return [];
        const { quantity_total, quantity_sold, quantity_return, warehouseTotals } = getTotalWarehouse(
            data?.data?.totals,
            filterWarehouse?.warehouseId
        );

        const resultQuantity = dataTableTotal.map(itemTable => {
            if (itemTable.name === QUANTITY_TYPE.NET_UNITS) {
                return { ...itemTable, total: quantity_total };
            }
            if (itemTable.name === QUANTITY_TYPE.QUANTITY_UNITS) {
                return { ...itemTable, total: quantity_sold };
            }
            if (itemTable.name === QUANTITY_TYPE.UNIT_RETURNED) {
                return { ...itemTable, total: quantity_return };
            }
            return itemTable;
        });

        warehouseTotals.forEach((item, index) => {
            const rowColor = !(index % 2) ? 'tr-white' : 'tr-gray';
            resultQuantity.push({
                ...INITIAL_ITEM_TOTAL,
                title: item.warehouse || '',
                total: item.quantity_sold,
                id: item.warehouse_id || '',
                classNameTitle: `${INITIAL_ITEM_TOTAL.classNameTitle} ${rowColor}`,
                classNameTotal: `${INITIAL_ITEM_TOTAL.classNameTotal} ${rowColor}`,
            });
        });

        return resultQuantity;
    };

    const downloadFile = (type: string): void => {
        if (getDataProducts().length && getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId).warehouseTotals.length)
            dispatch(
                getFile(
                    {
                        type,
                        module: SELECT_KEY_REPORT['shopping'],
                        date: filterData.date,
                        product_name: filterData.productName,
                        warehouse_name: filterWarehouse.warehouseName || 'Todas',
                        data: {
                            details: getDataProducts(),
                            totals: getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId),
                        },
                    },
                    'Compras netas por tipo de producto y bodega'
                )
            );
    };

    return (
        <SalesAndPurchaseAccountingReport
            routes={routes()}
            title="Compras netas por tipo de producto y bodega"
            description="A continuación visualice todas las compras netas por producto y bodega."
            headersTableProduct={headersTable}
            dataTableProduct={getDataProducts()}
            dataTableTotal={getDataTotal()}
            tooltipInformation={TOOLTIP_INFORMATION}
            onChangeOption={handleFilters}
            nextPage={getRoute(Routes.DAILY_ENDING_INVENTORY)}
            downloadFile={downloadFile}
            warehouseOptions={warehouseOptions}
            paginatorBackend={{ ...data, setData: setData } as IPaginatorBackendObj<ISalesData>}
        />
    );
};

export default ShoppingReportProductWarehouse;
