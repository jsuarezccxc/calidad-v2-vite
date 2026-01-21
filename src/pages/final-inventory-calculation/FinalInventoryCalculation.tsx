import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Form } from '@components/form';
import { Tooltip } from '@components/tooltip';
import { CppTable } from './components/CppTable';
import { PageTitle } from '@components/page-title';
import { PepsTable } from './components/PepsTable';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SELECT_KEY_REPORT } from '@components/sales-and-purchase-accounting-report';
import { DownloadIcons, Icon } from '@components/icon';
import { DatePickerMonthInput, IOptionSelect, SelectSearchInput } from '@components/input';

import { Routes } from '@constants/Paths';
import { START_DATE } from '@constants/Date';

import useDate from '@hooks/useDate';
import usePopper from '@hooks/usePopper';

import { HOW_CALCULATE, WHICH_IS_THE_BASE } from '@information-texts/FinalInventoryCalculation';

import { getWordLimit } from '@utils/Text';
import { buttonsFooterProps } from '@utils/Button';
import { downloadIconsProps } from '@utils/DownloadFile';
import { getRoute, getRouteName } from '@utils/Paths';
import { currentDateInUnix, getDateForMonth, getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import { getFile } from '@redux/user/actions';
import { RootState } from '@redux/rootReducer';
import { getProductServices } from '@redux/product-catalog/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getFinalInventorySales } from '@redux/final-inventory/action';

import { IGenericRecord } from '@models/GenericRecord';

import { CPP, extraRoutes, methodOptions } from './components';
import { DATE_KEY, getRoutes } from '.';
import './FinalInventoryCalculation.scss';

const FinalInventoryCalculation: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { anchorEl, togglePopper, mouseProps: mousePropsPopUp } = usePopper();
    const { anchorEl: anchorElSecond, togglePopper: togglePopperSecond, mouseProps: mousePropsSecond } = usePopper();
    const { anchorEl: anchorElInformation, mouseProps } = usePopper();

    const { dates, changeDate } = useDate();

    const [methodSelected, setMethodSelected] = useState({ key: CPP, value: 'Método CCP por producto' });
    const [productOptions, setProductOptions] = useState<IOptionSelect[]>([]);
    const [productSelected, setProductSelected] = useState<IOptionSelect>({ id: '', key: '', value: '' });
    const [dateSelect, setDateSelect] = useState(currentDateInUnix());
    const [dateCcpPeps, setDateCcpPeps] = useState('');
    const {
        company: { information },
        productCatalog: {
            productServices: { data: productServices },
        },
        finalInventorySales: { data },
    } = useSelector(({ company, productCatalog, finalInventorySales }: RootState) => ({
        company,
        productCatalog,
        finalInventorySales,
    }));

    const creationDate = useMemo(() => Number(information?.created_at), [information]);

    useEffect(() => {
        dispatch(getProductServices(true));
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        createProductOptions();
    }, [productServices]);

    useEffect(() => {
        setDateCcpPeps(DATE_KEY[getDateFromUnix(dates.start_date).month]);
        dispatch(
            getFinalInventorySales({
                unique_product_id: productSelected?.id,
                month: dateSelect,
                method: methodSelected.key,
            })
        );
    }, [dates?.start_date, productSelected, methodSelected, dateSelect]);

    const createProductOptions = (): void => {
        const products = productServices?.filter((product: IGenericRecord) => product?.is_product && product?.name);
        const options: IOptionSelect[] = [];
        products.forEach((product: IGenericRecord, index: number) => {
            options.push({
                key: (index + 1).toString(),
                id: product.id,
                value: product.name,
                type: 'product',
            });
        });
        setProductOptions(options);
    };

    const downloadFile = (type: string): void => {
        dispatch(
            getFile(
                {
                    type,
                    module: SELECT_KEY_REPORT[methodSelected?.key],
                    date: dates.start_date,
                    product_name: productSelected.value,
                    method: methodSelected.value,
                    data: data,
                },
                methodSelected.value
            )
        );
    };

    window.addEventListener('mouseup', (e): void => {
        (anchorElSecond && togglePopperSecond((e as unknown) as React.MouseEvent<HTMLElement, MouseEvent>)) ||
            (anchorEl && togglePopper((e as unknown) as React.MouseEvent<HTMLElement, MouseEvent>));
    });

    const productOptionsRender = productOptions.map(item => ({
        ...item,
        name: item.value,
        value: item.value,
        type: 'product',
    }));

    const methodOptionsRender = methodOptions.map(item => ({ ...item, name: item.value }));

    return (
        <>
            <div className="flex flex-col h-full">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} classContainer="accounting-report__title" />
                <BreadCrumb routes={[...getRoutes(), ...extraRoutes]} />
                <h1 className="text-center text-blue font-allerbold text-26lg mt-2.5 mb-4.5 xs:text-xl">
                    Consulte los reportes contables
                </h1>
                <p className="flex items-center">
                    <span {...mouseProps}>
                        <Icon name="infoGreen" className="w-5.5 h-5.5 mr-2 cursor-pointer" />
                    </span>
                    <span className="text-lg text-blue font-allerbold xs:test-base">Cálculo total de inventario final</span>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.ANALYTICAL_REPORTS,
                            submodule: `final-inventory-calculation`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        anchorEl={anchorElInformation}
                        iconName="infoBlue"
                        description="El inventario final es el stock de bienes que una empresa posee al final de un ejercicio contable. 
                        Este inventario incluye todos los productos, desde materias primas hasta artículos terminados, que no han sido vendidos. 
                        Es una herramienta fundamental para el control y la gestión de recursos dentro de cualquier negocio."
                        placement="bottom-start"
                        wrapperClassName="rounded"
                    />
                </p>
                <p className="text-gray-dark mt-4.5 xs:text-sm">Seleccione el método para calcular el inventario final</p>
                <div className="flex items-center w-76 gap-x-3 mb-4.5 mt-2" onClick={togglePopper}>
                    <Icon name="lightPurple" classIcon="w-5.5 h-5.5 cursor-pointer" />
                    <p {...mousePropsPopUp} className="text-base underline cursor-pointer text-purple font-aller xs:text-sm">
                        {HOW_CALCULATE.TITLE}
                    </p>
                </div>
                <Tooltip
                    id={generateId({
                        module: ModuleApp.ANALYTICAL_REPORTS,
                        submodule: `final-inventory-calculation-how`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TOOL,
                    })}
                    placement="bottom-start"
                    anchorEl={anchorEl}
                    iconName="lightBlue"
                    description={HOW_CALCULATE.DESCRIPTION}
                    wrapperClassName="rounded content-tooltip"
                />

                <Form sendWithEnter className="flex justify-between xs:flex-col xs:mb-4">
                    <div className="flex xs:flex-col xs:gap-4.5">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `final-inventory-calculation-product`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            name="product"
                            placeholder="Seleccionar"
                            classesInput="md:w-38"
                            classesWrapper="md:w-38  xs:ml-0  w-full"
                            classesWrapperInput="bg-white"
                            labelText="Producto:"
                            optionSelect={productOptionsRender}
                            onChangeSelect={(_, option): void => setProductSelected(option)}
                            valueSelect={getWordLimit(productSelected?.value)}
                            selectIconType="arrowDownGreen"
                        />
                        <DatePickerMonthInput
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `final-inventory-calculation-date`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Fecha:"
                            classesLabel="font-allerbold"
                            classesWrapper="lg:w-38 xs:w-full xs:ml-0 ml-4.5"
                            classesWrapperInput="bg-white"
                            onChangeDate={(date: Date): void => {
                                changeDate(date, START_DATE);
                                setDateSelect(getUnixFromDate(date));
                            }}
                            minDate={new Date(getDateForMonth(creationDate))}
                            selected={dates.start_date}
                            selectIconType="calendarGreen"
                        />
                        <div>
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.ANALYTICAL_REPORTS,
                                    submodule: `final-inventory-calculation-method`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                valueSelect={methodSelected?.value}
                                name="order_by"
                                placeholder="Seleccionar"
                                classesInput="md:w-73"
                                classesWrapper="md:w-73 ml-4.5 xs:ml-0  w-full"
                                classesWrapperInput="bg-white"
                                labelText="Método para calcular el inventario final:"
                                optionSelect={methodOptionsRender}
                                onChangeSelect={(_, option): void => {
                                    setMethodSelected(option);
                                }}
                                selectIconType="arrowDownGreen"
                            />
                            <div className="flex items-center mt-2 mb-2 ml-4 gap-x-3" {...mousePropsSecond}>
                                <Icon name="lightPurple" classIcon="w-5.5 h-5.5 cursor-pointer" />
                                <p className="text-base underline cursor-pointer text-purple font-aller xs:text-sm">
                                    {WHICH_IS_THE_BASE[methodSelected?.key === CPP ? 'CPP_TITLE' : 'PEPS_TITLE']}
                                </p>
                            </div>
                            <Tooltip
                                id={generateId({
                                    module: ModuleApp.ANALYTICAL_REPORTS,
                                    submodule: `final-inventory-calculation-which-base`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.TOOL,
                                })}
                                placement="bottom-start"
                                anchorEl={anchorElSecond}
                                iconName="lightBlue"
                                description={
                                    WHICH_IS_THE_BASE[methodSelected?.key === CPP ? 'CPP_DESCRIPTION' : 'PEPS_DESCRIPTION']
                                }
                                wrapperClassName="rounded content-tooltip"
                            />
                        </div>
                    </div>
                    <DownloadIcons
                        {...downloadIconsProps(downloadFile, ModuleApp.ANALYTICAL_REPORTS)}
                        className="mt-2 -mr-2 xs:mb-2 xs:mt-4 xs:self-end downloadIcons"
                        withoutText
                    />
                </Form>
                {methodSelected?.key === CPP ? (
                    <CppTable data={data} date={dateCcpPeps} />
                ) : (
                    <PepsTable data={data} date={dateCcpPeps} />
                )}
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ANALYTICAL_REPORTS, history, getRoute(Routes.ELECTRONIC_INVOICE), {
                    name: '#',
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};

export default FinalInventoryCalculation;
