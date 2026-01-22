import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BreadCrumb } from '@components/bread-crumb';
import { DatePickerBase } from '@components/date-picker';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { DownloadIcons } from '@components/icon/Icon';
import { DatePickerDayInput, IOptionSelect, SelectSearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IPaginatorBackend } from '@components/paginator-backend';
import { DATE_OPTION, SELECT_KEY_REPORT } from '@components/sales-and-purchase-accounting-report';
import { Table } from '@components/table';
import { Tooltip } from '@components/tooltip';
import { Routes } from '@constants/Paths';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import useDate from '@hooks/useDate';
import usePopper from '@hooks/usePopper';
import { IGenericRecord } from '@models/GenericRecord';
import { IFinalInventoryDay } from '@models/InvoiceWebsite';
import { getInvoiceWebsite, setFinalInventoryDay } from '@redux/invoice-website/action';
import { getProductServices } from '@redux/product-catalog/actions';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { buttonsFooterProps } from '@utils/Button';
import { currentDateInUnix, getDateCreated, getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { ACTION_TYPE } from '@utils/InvoiceWebsite';
import { lengthEqualToZero, lengthLastItem } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { getWordLimit } from '@utils/Text';
import { getThousands } from '@utils/Value';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { headersTable, routes } from '.';
import './DailyEndingInventory.scss';

const DailyEndingInventory: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        information,
        productServices: { data: productServices },
        finalInventoryDay,
        loader: loaderState,
    } = useSelector(({ productCatalog, invoiceWebsite, company, loader }: RootState) => ({
        ...productCatalog,
        ...invoiceWebsite,
        ...company,
        ...loader,
    }));

    const { dates } = useDate();
    const { anchorEl, mouseProps } = usePopper();
    const { anchorEl: anchorElQuestion, togglePopper } = usePopper();

    const [filterData, setFilterData] = useState({ product: '', date: currentDateInUnix(), productName: '' });
    const [productOptions, setProductOptions] = useState<IOptionSelect[]>([]);
    const [data, setData] = useState<IPaginatorBackend<IFinalInventoryDay>>(finalInventoryDay);

    useEffect(() => {
        createProductOptions();
    }, [productServices]);

    useEffect(() => {
        dispatch(getProductServices(true));
    }, []);

    useEffect(() => {
        setData(finalInventoryDay);
    }, [finalInventoryDay]);

    useEffect(() => {
        if (filterData.product) {
            dispatch(
                getInvoiceWebsite(
                    {
                        product_id: filterData.product,
                        start_date: filterData.date,
                    },
                    ACTION_TYPE.FINAL_INVENTORY_DAY
                )
            );
        } else {
            dispatch(setFinalInventoryDay([]));
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
                key: index.toString(),
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
                    module: SELECT_KEY_REPORT[ACTION_TYPE.FINAL_INVENTORY_DAY],
                    date: dates.start_date,
                    product_name: filterData.productName,
                    data: data?.data,
                },
                'Inventario final diario'
            )
        );
    };

    window.addEventListener('mouseup', (e): void => {
        anchorElQuestion && togglePopper((e as unknown) as React.MouseEvent<HTMLElement, MouseEvent>);
    });

    const productOptionsRender = productOptions.map(item => ({ ...item, name: item.value, type: 'product' }));

    return (
        <>
            <div className="h-full mt-7">
                <p className="text-base title-daily text-blue font-allerbold">{WEBSITE_DESIGN_AND_ADMINISTRATION}</p>
                <BreadCrumb routes={routes()} className="mb-7" />

                <h1 className="text-center text-blue font-allerbold text-26lg mb-4.5 xs:text-xl">
                    Consulte los reportes contables
                </h1>

                <p className="flex items-center mb-4.5">
                    <span {...mouseProps}>
                        <Icon name="infoGreen" classIcon="w-5.5 h-5.5 mr-2 cursor-pointer" />
                    </span>
                    <span className="text-lg text-blue font-allerbold xs:text-base">Inventario final diario</span>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `daily-ending-inventory`,
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

                <p className="mb-4 text-base font-aller text-gray-dark xs:text-sm">
                    Visualice su inventario final que incluye todas las unidades disponibles para la venta al cierre diario.
                </p>

                <Form sendWithEnter className="flex flex-col md:flex-row flex-wrap md:items-center justify-between mb-4.5">
                    <div className="flex flex-col xs:gap-4.5 mb-2 md:flex-row md:mb-0 xs:mb-4.5">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `daily-ending-inventory-products`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Producto:"
                            placeholder="Seleccionar"
                            classesWrapperInput="w-38 xs:w-full"
                            classesWrapper="md:mr-4.5"
                            selectIconType="arrowDownGreen"
                            onChangeSelect={(_, e): void => handleFilters(e)}
                            optionSelect={productOptionsRender}
                            valueSelect={getWordLimit(filterData.productName)}
                        />
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `daily-ending-inventory-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="date"
                            selected={filterData.date}
                            labelText="Fecha:"
                            classesWrapper="w-38 xs:w-full"
                            classesWrapperInput="bg-white"
                            onChangeDate={(e: Date): void => handleFilters({ value: e, name: 'date' })}
                            maxDate={new Date()}
                            limitMinDate={false}
                            selectIconType="calendarGreen"
                            minDate={getDateCreated(information?.created_at || 0)}
                        />
                    </div>
                    <DownloadIcons
                        {...downloadIconsProps(downloadFile, ModuleApp.ANALYTICAL_REPORTS)}
                        withoutText
                        className="downloadIcons"
                    />
                </Form>

                <Table
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `daily-ending-inventory`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={loaderState}
                    data={[]}
                    customTable
                    headersTable={headersTable}
                    wrapperClassName="ending-inventory__table"
                    isNew
                    paginatorBackendData={{
                        ...data,
                        setData: (newData?: IGenericRecord): void => setData(newData as IPaginatorBackend<IFinalInventoryDay>),
                    }}
                >
                    {data?.data?.map?.((item, index) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `daily-ending-inventory-${index}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            className={`h-10 border-b border-gray ${!(index % 2) ? 'tr-white' : 'tr-gray'}`}
                            key={index}
                        >
                            <td>
                                <div className="flex items-center p-2 ending-inventory__header-first">
                                    <DatePickerBase
                                        dateFormat="dd/MM/yyyy"
                                        disabled
                                        className={`date-picker__text ending-inventory__date text-gray ${
                                            !(index % 2) ? 'tr-white' : 'tr-gray'
                                        }`}
                                        showPlaceHolderDate={true}
                                        selected={item?.date}
                                    />
                                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center ending-inventory__header ending-inventory__header-second">
                                    <p className="my-auto text-sm text-gray">{item.operation}</p>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center ending-inventory__header ending-inventory__header-third">
                                    <p className="text-sm text-gray">{item.unit_measurements_name}</p>
                                </div>
                            </td>
                            <td colSpan={3}>
                                <div className="flex flex-col ending-inventory__header-quantities">
                                    {item?.quantities.map((warehouse, indexWarehouse) => (
                                        <div
                                            className={`flex xs:h-8.75  border-gray ${
                                                lengthLastItem(item.quantities) === indexWarehouse
                                                    ? 'border-b-0 h-10'
                                                    : 'border-b ending-inventory__td-body'
                                            }`}
                                            key={indexWarehouse}
                                        >
                                            <p className="ending-inventory__td-quantity ending-inventory__header-second">
                                                {getThousands(warehouse.quantity.toString())}
                                            </p>
                                            <p className="ending-inventory__td-quantity ending-inventory__header-four">
                                                {warehouse.warehouse}
                                            </p>
                                            <p className="ending-inventory__td-quantity ending-inventory__header-first">
                                                {warehouse.daily_final_inventory.toString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center ending-inventory__header ending-inventory__header-five font-allerbold">
                                    <p className="text-sm text-blue">{getThousands(item.quantity_total.toString())}</p>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ANALYTICAL_REPORTS,
                    history,
                    getRoute(Routes.ENDING_INVENTORY_ACCOUNTING_MONTH),
                    {
                        name: '#',
                        moduleName: getRouteName(Routes.WEBSITE_MENU),
                    }
                )}
            />
        </>
    );
};

export default DailyEndingInventory;
