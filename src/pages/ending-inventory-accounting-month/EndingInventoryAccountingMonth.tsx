import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import useDate from '@hooks/useDate';
import usePopper from '@hooks/usePopper';

import { ACTION_TYPE } from '@utils/InvoiceWebsite';
import { getWordLimit } from '@utils/Text';
import { getThousands } from '@utils/Value';
import { lengthEqualToZero } from '@utils/Length';
import { buttonsFooterProps } from '@utils/Button';
import { downloadIconsProps } from '@utils/DownloadFile';
import { getRoute, getRouteName } from '@utils/Paths';
import { currentDateInUnix, getDateForMonth, getUnixFromDate } from '@utils/Date';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import { Routes } from '@constants/Paths';

import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { DownloadIcons, Icon } from '@components/icon';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { DatePickerDayInput, DatePickerMonthInput, IOptionSelect, SelectSearchInput } from '@components/input';
import { Form } from '@components/form';
import { Table } from '@components/table';
import { Tooltip } from '@components/tooltip';
import { ZERO as ZERO_VALUE } from '@constants/Numbers';
import { DATE_OPTION, SELECT_KEY_REPORT } from '@components/sales-and-purchase-accounting-report';

import { getFile } from '@redux/user/actions';
import { RootState } from '@redux/rootReducer';
import { getProductServices } from '@redux/product-catalog/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getInvoiceWebsite, setFinalInventoryMonth } from '@redux/invoice-website/action';

import { IGenericRecord } from '@models/GenericRecord';
import { IFinalInventoryDay } from '@models/InvoiceWebsite';

import { DAY_UNIX, DEFAULT_DATA_REPORT, headersTable, routes } from '.';
import './EndingInventoryAccountingMonth.scss';

const EndingInventoryAccountingMonth: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { dates } = useDate();

    const {
        information,
        productServices: { data: productServices },
        finalInventoryMonth,
        loader: loaderState,
    } = useSelector(({ company, productCatalog, invoiceWebsite, loader }: RootState) => ({
        ...company,
        ...productCatalog,
        ...invoiceWebsite,
        ...loader,
    }));

    const { anchorEl, mouseProps } = usePopper();
    const { anchorEl: anchorElLight, togglePopper } = usePopper();
    const [dataTable, setDataTable] = useState<IFinalInventoryDay>();
    const [filterData, setFilterData] = useState({ product: '', date: currentDateInUnix(), productName: '' });
    const [productOptions, setProductOptions] = useState<IOptionSelect[]>([]);

    const creationDate = useMemo(() => Number(information?.created_at), [information]);

    useEffect(() => {
        finalInventoryMonth && setDataTable(finalInventoryMonth);
    }, [finalInventoryMonth]);

    useEffect(() => {
        dispatch(getProductServices(true));
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        createProductOptions();
    }, [productServices]);

    useEffect(() => {
        if (filterData.product) {
            dispatch(
                getInvoiceWebsite(
                    {
                        product_id: filterData.product,
                        start_date: filterData.date,
                    },
                    ACTION_TYPE.FINAL_INVENTORY_MONTH
                )
            );
        } else {
            dispatch(setFinalInventoryMonth(DEFAULT_DATA_REPORT));
        }
    }, [filterData]);

    const createProductOptions = (): void => {
        if (lengthEqualToZero(productServices) && !Array.isArray(productServices)) {
            setProductOptions([]);
            return;
        }

        const products = productServices.filter(product => product.is_product);
        const options: IOptionSelect[] = [];
        products.forEach((product, index) => {
            options.push({
                key: index?.toString(),
                id: product.id,
                value: product.name,
                type: 'product',
            });
        });
        setProductOptions(options);
    };

    const handleFilters = (option: IOptionSelect | IGenericRecord): void => {
        setFilterData({
            ...filterData,
            [option.type]: option.type === DATE_OPTION ? getUnixFromDate(option.value) : option.id,
            productName: option.type === DATE_OPTION ? filterData.productName : option.value,
        });
    };

    const downloadFile = (type: string): void => {
        dispatch(
            getFile(
                {
                    type,
                    module: SELECT_KEY_REPORT[ACTION_TYPE.FINAL_INVENTORY_MONTH],
                    date: dates.start_date,
                    product_name: filterData.productName,
                    data: dataTable,
                },
                'Inventario final al cierre del mes contable'
            )
        );
    };

    window.addEventListener('mouseup', (e): void => {
        anchorElLight && togglePopper((e as unknown) as React.MouseEvent<HTMLElement, MouseEvent>);
    });

    const getQuantityTable = (quantity: number, value: string): string => {
        if (quantity < ZERO_VALUE) {
            return value.replace('$', '-');
        }
        return value;
    };

    const productsOptionsRender = productOptions.map(item => ({ ...item, name: item.value, type: 'product' }));

    return (
        <>
            <main className="ending-inventory-month">
                <PageTitle classTitle="text-base" title={getRouteName(Routes.WEBSITE_MENU)} />
                <BreadCrumb routes={routes()} />
                <h2 className="mt-8 text-center text-26lg text-blue font-allerbold mb-7 xs:text-xl">
                    Consulte los reportes contables{' '}
                </h2>
                <p className="flex items-center mb-4.5">
                    <span {...mouseProps}>
                        <Icon name="infoGreen" className="w-5.5 h-5.5 mr-2 cursor-pointer" />
                    </span>
                    <span className="text-lg text-blue font-allerbold xs:test-base">
                        Inventario final al cierre del mes contable
                    </span>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `ending-inventory-month`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        anchorEl={anchorEl}
                        iconName="infoBlue"
                        description="El inventario final es el stock de bienes que una empresa posee al final de un ejercicio contable. 
                        Este inventario incluye todos los productos, desde materias primas hasta artículos terminados, que no han sido vendidos. 
                        Es una herramienta fundamental para el control y la gestión de recursos dentro de cualquier negocio."
                        placement="bottom-start"
                        wrapperClassName="rounded"
                    />
                </p>
                <p className="mb-4 text-gray-dark xs:text-sm">
                    Visualice su inventario final que incluye todas las unidades disponibles para la venta al cierre diario.
                </p>
                <Form sendWithEnter className="flex flex-wrap justify-between mb-7 xs:justify-end xs:gap-4.5 xs:mb-4.5">
                    <div className="flex w-full mb-2 md:w-auto md:mb-0 xs:flex-col xs:gap-2">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `ending-inventory-month-product`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Producto:"
                            placeholder="Seleccionar"
                            classesWrapperInput="w-38 xs:w-full"
                            classesWrapper="mr-4.5 xs:w-full"
                            selectIconType="arrowDownGreen"
                            onChangeSelect={(_, e): void => handleFilters(e)}
                            optionSelect={productsOptionsRender}
                            valueSelect={getWordLimit(filterData.productName)}
                            selected={filterData.product}
                        />
                        <DatePickerMonthInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `ending-inventory-month-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="date"
                            labelText="Fecha:"
                            classesWrapper="w-38 xs:w-full"
                            classesWrapperInput="bg-white xs:w-full"
                            selectIconType="calendarGreen"
                            selected={filterData.date}
                            onChangeDate={(e): void => handleFilters({ value: e, name: 'date' })}
                            maxDate={new Date()}
                            minDate={new Date(getDateForMonth(creationDate))}
                        />
                    </div>
                    <DownloadIcons
                        {...downloadIconsProps(downloadFile, ModuleApp.ANALYTICAL_REPORTS)}
                        withoutText
                        className="downloadIcons mr-2.5"
                    />
                </Form>
                <Table
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `ending-inventory-month`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={loaderState}
                    data={[]}
                    customTable
                    headersTable={headersTable}
                    wrapperClassName="ending-inventory-month__table mb-4.5"
                    isNew
                >
                    {!!dataTable?.quantities?.length && (
                        <tr
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `ending-inventory-month`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            className="h-9.75 xs:h-8.75 bg-white border-t border-b border-gray"
                        >
                            <td>
                                <DatePickerDayInput
                                    id={generateId({
                                        module: ModuleApp.ANALYTICAL_REPORTS,
                                        submodule: `ending-inventory-month-date`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ROW,
                                    })}
                                    classesWrapper="w-full"
                                    iconClassName="hidden"
                                    selectIconType="calendarGray"
                                    classesWrapperInput="border-none bg-white flex justify-between"
                                    classesInput="text-gray text-sm p-0 ending-inventory-month__input"
                                    selected={(Number(dataTable?.date) - DAY_UNIX)?.toString()}
                                    disabled
                                />
                            </td>
                            <td>
                                <div className="mx-2">
                                    <p className="text-sm text-gray">{dataTable.operation}</p>
                                </div>
                            </td>
                            <td>
                                <div className="mx-2">
                                    <p className="text-sm text-gray">{dataTable.unit_measurements_name}</p>
                                </div>
                            </td>
                            <td colSpan={2}>
                                {dataTable?.quantities?.map((quantity, index) => (
                                    <div
                                        key={uuid()}
                                        className={`flex ${
                                            dataTable?.quantities.length === index + 1
                                                ? 'border-b-0 h-10'
                                                : 'border-b ending-inventory-month__td-body'
                                        }`}
                                    >
                                        <div className="w-25.5 xs:h-8.75 flex items-center">
                                            <p className="px-2 text-sm text-gray">
                                                {getQuantityTable(
                                                    quantity?.daily_final_inventory,
                                                    getThousands(quantity?.daily_final_inventory?.toString())
                                                )}
                                            </p>
                                        </div>
                                        <div className="w-37 xs:h-8.75 flex items-center">
                                            <p className="px-2 text-sm text-gray">{quantity.warehouse}</p>
                                        </div>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    )}
                </Table>
                <div className="ending-inventory-month__container-total">
                    <p className="ending-inventory-month__text-total">Total inventario final cantidad disponible para la venta</p>
                    <p className="flex items-center w-32 h-10 border-b border-gray xs:h-8.75 px-2 py-3 text-sm bg-white text-blue font-allerbold">
                        {getQuantityTable(
                            dataTable?.quantity_total || 0,
                            getThousands(dataTable?.quantity_total?.toString() || '0')
                        )}
                    </p>
                </div>
            </main>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ANALYTICAL_REPORTS, history, getRoute(Routes.FINAL_INVENTORY_CALCULATION), {
                    name: '#',
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};

export default EndingInventoryAccountingMonth;
