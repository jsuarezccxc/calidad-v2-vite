import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { getFile } from '@redux/user/actions';
import { RootState } from '@redux/rootReducer';
import { ISalesData } from '@redux/invoice-website/types';
import { getInvoiceWebsite, setSalesWebsite } from '@redux/invoice-website/action';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { paginationDataFormat } from '@constants/PaginationBack';
import { getRoute } from '@utils/Paths';
import { currentDateInUnix, getUnixFromDate } from '@utils/Date';
import { ACTION_TYPE, getQuantities, getTotalWarehouse } from '@utils/InvoiceWebsite';
import { QUANTITY_TYPE } from '@pages/shopping-report-product-warehouse';
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

import { TOOLTIP_INFORMATION, dataTableTotal, headersTable, routes, INITIAL_QUANTITY_SOLD, INITIAL_QUANTITY_RETURNED } from '.';

const SalesReportProductWarehouse: React.FC = () => {
    const dispatch = useDispatch();

    const { sales } = useSelector((state: RootState) => state.invoiceWebsite);
    const {
        warehouses: {
            warehouseList: { data: warehouseList },
        },
    } = useSelector(({ warehouses }: RootState) => ({ warehouses }));

    const [filterWarehouse, setFilterWarehouse] = useState({ warehouseId: '', warehouseName: 'Todas' });
    const [filterData, setFilterData] = useState({ product: '', productName: '', date: currentDateInUnix() });
    const [warehouseOptions, setWarehouseOptions] = useState<IOptionSelect[]>([]);
    const [data, setData] = useState<IPaginatorBackendObj<ISalesData>>(sales);

    useEffect(() => {
        if (filterData.product) {
            dispatch(
                getInvoiceWebsite(
                    {
                        product_id: filterData.product,
                        start_date: filterData.date,
                    },
                    ACTION_TYPE.SALES
                )
            );
        } else {
            dispatch(setSalesWebsite({ ...paginationDataFormat, data: DEFAULT_DATA }));
        }
    }, [filterData]);

    useEffect(() => {
        setData(sales);
    }, [sales]);

    useEffect(() => {
        getDataTotal();
    }, [filterWarehouse, filterData]);

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
                ?.map(item => ({
                    ...item,
                    id: uuid(),
                    quantities: getQuantities(item?.quantities, filterWarehouse.warehouseId),
                    productId: filterData.product,
                })) || []
        );
    };

    useEffect(() => {
        setWarehouseOptions(createWarehouseOptions(warehouseList, getDataProducts()));
    }, [sales, filterWarehouse]);

    const getDataTotal = (): ITableTotal[] => {
        const totalSales: ITableTotal[] = [];
        const totalReturned: ITableTotal[] = [];

        if (!getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId)?.warehouseTotals?.length) return [];

        const { quantity_total, quantity_sold, quantity_return, warehouseTotals } = getTotalWarehouse(
            data?.data?.totals,
            filterWarehouse?.warehouseId
        );
        warehouseTotals?.forEach((item, index) => {
            const rowColor = !(index % 2) ? 'tr-white' : 'tr-gray';
            totalSales.push({
                ...INITIAL_QUANTITY_SOLD,
                title: item.warehouse || '',
                total: item.quantity_sold,
                id: uuid(),
                classNameTitle: `${INITIAL_QUANTITY_SOLD.classNameTitle} ${rowColor}`,
                classNameTotal: `${INITIAL_QUANTITY_SOLD.classNameTotal} ${rowColor}`,
            });
            totalReturned.push({
                ...INITIAL_QUANTITY_RETURNED,
                title: item.warehouse || '',
                total: item.quantity_return,
                id: uuid(),
                classNameTitle: `${INITIAL_QUANTITY_RETURNED.classNameTitle} ${rowColor}`,
                classNameTotal: `${INITIAL_QUANTITY_RETURNED.classNameTotal} ${rowColor}`,
            });
        });

        const resultQuantity = dataTableTotal?.map(itemTable => {
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

        resultQuantity.splice(4, 0, ...[...totalSales]);

        return [...resultQuantity, ...totalReturned];
    };

    const downloadFile = (type: string): void => {
        if (
            getDataProducts()?.length &&
            getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId).warehouseTotals?.length
        )
            dispatch(
                getFile(
                    {
                        type,
                        module: SELECT_KEY_REPORT['sales'],
                        date: filterData.date,
                        product_name: filterData.productName,
                        warehouse_name: filterWarehouse.warehouseName || 'Todas',
                        data: {
                            details: getDataProducts(),
                            totals: getTotalWarehouse(data?.data?.totals, filterWarehouse.warehouseId),
                        },
                    },
                    'Ventas netas por tipo de producto y bodega'
                )
            );
    };

    return (
        <SalesAndPurchaseAccountingReport
            routes={routes()}
            title="Ventas netas por tipo de producto y bodega"
            description="A continuación visualice todas las ventas netas por producto y bodega."
            headersTableProduct={headersTable}
            dataTableProduct={getDataProducts()}
            dataTableTotal={getDataTotal()}
            tooltipInformation={TOOLTIP_INFORMATION}
            onChangeOption={handleFilters}
            nextPage={getRoute(Routes.SHOPPING_REPORT_PRODUCT_WAREHOUSE)}
            downloadFile={downloadFile}
            warehouseOptions={warehouseOptions}
            paginatorBackend={{
                ...data,
                setData: (data?: IGenericRecord): void => setData(data as IPaginatorBackendObj<ISalesData>),
            }}
        />
    );
};

export default SalesReportProductWarehouse;
