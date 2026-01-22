import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BreadCrumb } from '@components/bread-crumb';
import { DatePickerBase } from '@components/date-picker';
import { Form } from '@components/form';
import { DownloadIcons, Icon } from '@components/icon';
import { DatePickerDayInput, IOptionSelect, SelectSearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Paginator } from '@components/paginator';
import { IPaginatorBackend } from '@components/paginator-backend';
import { Table } from '@components/table';
import { Tooltip } from '@components/tooltip';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Routes } from '@constants/Paths';
import usePaginator from '@hooks/usePaginator';
import usePopper from '@hooks/usePopper';
import { IGenericRecord } from '@models/GenericRecord';
import { getProductServices } from '@redux/product-catalog/actions';
import { RootState } from '@redux/rootReducer';
import { getWarehousesData } from '@redux/warehouses/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated, getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { lengthLastItem } from '@utils/Length';
import { getRouteName } from '@utils/Paths';
import { getWordLimit } from '@utils/Text';
import { getThousands } from '@utils/Value';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { INDEX_WAREHOUSE, ISalesAndPurchaseReportProps, WITHOUT_ITEM } from '.';
import './SalesAndPurchaseAccountingReport.scss';

export const SalesAndPurchaseAccountingReport: React.FC<ISalesAndPurchaseReportProps> = ({
    routes,
    title,
    description,
    headersTableProduct,
    dataTableProduct,
    dataTableTotal,
    tooltipInformation,
    onChangeOption,
    nextPage,
    downloadFile,
    warehouseOptions,
    paginatorBackend,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { anchorEl, mouseProps } = usePopper();
    const { paginator, getLimits } = usePaginator(dataTableProduct);
    const {
        information,
        productServices: { data: productServices },
        warehouseList: { data: warehouseList },
        loader: loaderState,
    } = useSelector(({ company, productCatalog, warehouses, loader }: RootState) => ({
        ...company,
        ...productCatalog,
        ...warehouses,
        ...loader,
    }));

    const [productOptions, setProductOptions] = useState<IOptionSelect[]>([]);
    const [dateValue, setDateValue] = useState(0);
    const [selectValue, setSelectValue] = useState({ product: '', warehouse: '' });

    const creationDate = useMemo(() => information?.created_at, [information]);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getWarehousesData(true)), dispatch(getProductServices(true))]);
        })();
    }, []);

    useEffect(() => {
        getLimits();
    }, [dataTableProduct]);

    useEffect(() => {
        createProductOptions();
    }, [productServices, warehouseList, dataTableProduct]);

    const createProductOptions = (): void => {
        const products = productServices.filter(product => product.is_product);
        const options: IOptionSelect[] = [];
        products.forEach((product, index) => {
            options.push({
                key: index.toString(),
                id: product.id,
                value: product.name,
                type: 'product',
            });
        });
        setProductOptions(options);
    };

    const productsOptionsRender = productOptions.map(item => ({ ...item, name: item.value, type: 'product' }));
    const warehouseOptionsRender = warehouseOptions.map(item => ({ ...item, name: item.value, type: 'warehouse' }));

    return (
        <>
            <div className="sales-report">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} classContainer="sales-report__title" />
                <BreadCrumb routes={routes} />
                <h1 className="text-center text-26lg font-allerbold mb-4.5 mt-2.5 xs:text-xl text-blue">
                    Consulte los reportes contables
                </h1>
                <p className="flex items-center mb-4.5">
                    <span {...mouseProps}>
                        <Icon name="infoGreen" className="w-5.5 h-5.5 mr-2 cursor-pointer" />
                    </span>
                    <span className="text-lg text-blue font-allerbold xs:text-base xs:leading-4">{title}</span>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `sales-purchase-accounting`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        anchorEl={anchorEl}
                        iconName="infoBlue"
                        description={tooltipInformation}
                        placement="bottom-start"
                        wrapperClassName="rounded"
                    />
                </p>
                <p className="text-gray-dark xs:text-sm">{description}</p>
                <Form sendWithEnter className="flex mt-4.5 xs:mt-2 justify-between xs:flex-col">
                    <div className="flex flex-wrap gap-7 xs:gap-4.5">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `sales-purchase-accounting-product`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Producto:"
                            placeholder="Seleccionar"
                            optionSelect={productsOptionsRender}
                            classesWrapper="w-38 xs:w-full"
                            classesWrapperInput="bg-white"
                            name="product"
                            onChangeSelect={(_, option): void => {
                                onChangeOption(option);
                                setSelectValue({ ...selectValue, product: option.value, warehouse: '' });
                            }}
                            selectIconType="arrowDownGreen"
                            valueSelect={getWordLimit(selectValue.product)}
                            selectTextClass="sales-report__select"
                        />
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `sales-purchase-accounting-warehouse`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Bodega:"
                            placeholder="Seleccionar"
                            optionSelect={warehouseOptionsRender}
                            classesWrapper="w-38 xs:w-full "
                            classesWrapperInput="bg-white"
                            name="warehouse"
                            onChangeSelect={(_, option): void => {
                                onChangeOption(option);
                                setSelectValue({ ...selectValue, warehouse: option.value });
                            }}
                            selectIconType="arrowDownGreen"
                            valueSelect={getWordLimit(selectValue.warehouse)}
                            selectTextClass="sales-report__select"
                        />
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `sales-purchase-accounting-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="date"
                            selected={dateValue}
                            labelText="Fecha:"
                            classesWrapper="w-38 xs:w-full"
                            classesWrapperInput="bg-white"
                            onChangeDate={(e): void => {
                                onChangeOption({ value: e, type: 'date' });
                                setDateValue(getUnixFromDate(e));
                            }}
                            minDate={getDateCreated(creationDate || 0)}
                            maxDate={new Date()}
                            selectIconType="calendarGreen"
                        />
                    </div>
                    <DownloadIcons
                        {...downloadIconsProps(downloadFile, ModuleApp.ANALYTICAL_REPORTS)}
                        withoutText
                        className="items-end sales-report__icon"
                    />
                </Form>
                <Table
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `sales-purchase-accounting-products`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={loaderState}
                    headersTable={headersTableProduct}
                    fieldsBody={[]}
                    data={[]}
                    editable={false}
                    customTable
                    className="table-product"
                    isNew
                    wrapperClassName="mt-4.5"
                    paginatorBackendData={
                        {
                            ...paginatorBackend,
                            data: (paginatorBackend?.data as unknown) as IGenericRecord[],
                        } as IPaginatorBackend<IGenericRecord>
                    }
                >
                    {dataTableProduct?.slice(paginator.limits.start, paginator.limits.finish).map((item, index) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `sales-purchase-accounting-${item.id}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={item.id}
                            className={`border-b border-gray h-10 xs:h-8.75 ${!(index % 2) ? 'tr-white' : 'tr-gray'}`}
                        >
                            <td colSpan={1}>
                                <div className="flex h-full text-sm text-gray w-44.25 items-center px-2 pt-1">
                                    <DatePickerBase
                                        dateFormat="dd/MM/yyyy"
                                        disabled
                                        className={`date-picker__text table-product__date text-gray ${
                                            !(index % 2) ? 'tr-white' : 'tr-gray'
                                        }`}
                                        showPlaceHolderDate={true}
                                        selected={item.date}
                                    />
                                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                                </div>
                            </td>
                            <td colSpan={1}>
                                <p className="px-2 pt-1 text-sm text-gray">{item.unit_measurements_name}</p>
                            </td>
                            <td colSpan={4}>
                                <div className="flex flex-wrap w-145">
                                    {item.quantities.map(
                                        ({ warehouse_id, quantity_sold, quantity_return, quantity_total, warehouse }, index) => (
                                            <Fragment key={warehouse_id}>
                                                {[quantity_sold, quantity_return, quantity_total, warehouse].map(
                                                    (warehouse, indexWarehouse) => (
                                                        <p
                                                            key={indexWarehouse}
                                                            className={`table-product__td ${
                                                                lengthLastItem(item.quantities) === index
                                                                    ? 'border-b-0 h-10'
                                                                    : 'border-b h-9.875'
                                                            }`}
                                                        >
                                                            {indexWarehouse === INDEX_WAREHOUSE
                                                                ? warehouse
                                                                : Number(warehouse) < WITHOUT_ITEM
                                                                ? `-${getThousands(warehouse?.toString().slice(1) || '0')}`
                                                                : getThousands(warehouse?.toString() || '0')}
                                                        </p>
                                                    )
                                                )}
                                            </Fragment>
                                        )
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
                {dataTableProduct.length > ITEMS_PAGE && <Paginator {...paginator} />}
                <Table
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `sales-purchase-accounting-totals`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={loaderState}
                    headersTable={[]}
                    fieldsBody={[]}
                    data={[]}
                    editable={false}
                    customTable
                    className="table-total"
                    isNew
                    wrapperClassName="mt-7"
                    headerHidden
                >
                    {dataTableTotal?.map(item => (
                        <tr key={item.id} className="border-b border-gray xs:h-8.75 h-10">
                            <td colSpan={item.colSpan}>
                                <div className={`p-2 text-sm xs:h-8.2 xs:text-tiny xs:p-1 ${item.classNameTitle}`}>
                                    {item.title}
                                </div>
                            </td>
                            {!item.isTitle && (
                                <td colSpan={1}>
                                    <div className={`p-2 text-sm xs:h-8.2 xs:text-tiny xs:p-1 ${item.classNameTotal}`}>
                                        {getThousands(item.total.toString())}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </Table>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ANALYTICAL_REPORTS, history, nextPage, {
                    name: '#',
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};
