import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BreadCrumb, Section } from '@components/bread-crumb';
import { Button } from '@components/button';
import { Form } from '@components/form';
import { DownloadIcons, Icon, IconsNames } from '@components/icon';
import { Information } from '@components/information';
import { DatePickerDayInput, SearchInput, SelectSearchInput } from '@components/input';
import { InvoiceViewer } from '@components/invoice-viewer';
import { NotFindElements } from '@components/not-find-elements';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitleCustom } from '@components/page-title';
import { IPaginatorBackend } from '@components/paginator-backend';
import { Table } from '@components/table';
import { FINISH_DATE, START_DATE } from '@constants/Date';
import { URL_DASHBOARD } from '@constants/Domain';
import { CUSTOMER_RESPONSE, DIAN_RESPONSE, DOCUMENT_TYPE_REQUIRE, VOUCHER_PURCHASE } from '@constants/ElectronicInvoice';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { Routes } from '@constants/Paths';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import useDate from '@hooks/useDate';
import useParam from '@hooks/useParam';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';
import { IGenericRecord } from '@models/GenericRecord';
import { IProofPurchase } from '@models/Website';
import { getEnum } from '@utils/Object';
import { downloadXml } from '@redux/electronic-invoice/actions';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { getVirtualStoreVouchersList } from '@redux/website/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated, getMaxDate } from '@utils/Date';
import { downloadIconsProps, getRequestFile } from '@utils/DownloadFile';
import { getRoute, getRouteName } from '@utils/Paths';
import { lowerCase, removeSpecialCharacters } from '@utils/Text';
import { getDateFromUnix } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { CustomFooter } from './components/custom-footer/CustomFooter';
import { SendEmail } from './components/send-email/SendEmail';
import {
    BASE_FILTER,
    BUTTONS_INVOICE,
    dataFieldsBody,
    DESCRIPTION_INFORMATION,
    FILE_NAME,
    headerTable,
    IDisplayProofPaymentProps,
    INVOICE,
    MAIL,
    MODULE,
    ORDER_OPTIONS,
    routes,
    STATE_DOCUMENT,
    THREE,
    TWO,
} from '.';
import './virtualStoreSalesReceipts.scss';

const virtualStoreSalesReceipts: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { queryParam } = useParam('email-template');
    const { queryParam: backQuery } = useParam('back');
    const { information, virtualStoreVouchersList, planWebsiteActive, loader: loaderState } = useSelector(
        ({ website, company, membership, loader }: RootState) => ({
            ...website,
            ...company,
            ...membership,
            ...loader,
        })
    );

    const { dates, changeDate } = useDate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(BASE_FILTER);
    const [data, setData] = useState<IPaginatorBackend<IProofPurchase>>();

    const [displayProofPayment, setDisplayProofPayment] = useState({
        proof: '',
        urlProofPayment: '',
    });

    const creationDate = useMemo(() => information?.created_at, [information]);

    const handleSalesReceipts = (option: IGenericRecord): void => {
        setDisplayProofPayment({
            ...displayProofPayment,
            proof: option.number,
            urlProofPayment: option.invoice_pdf_url,
            ...option,
        });
    };

    useEffect(() => {
        if ([WEBSITE_PLANS.BASIC_PLAN, WEBSITE_PLANS.ADVANCED_PLAN].includes(planWebsiteActive || ''))
            history.push(URL_DASHBOARD);
        if (search.length >= THREE || !search)
            dispatch(
                getVirtualStoreVouchersList(
                    dates,
                    false,
                    search,
                    filter?.key ? [filter?.key] : [INVOICE_TYPE?.INVOICE, VOUCHER_PURCHASE]
                )
            );
    }, [dates, search, filter]);

    useEffect(() => {
        setData(virtualStoreVouchersList);
    }, [virtualStoreVouchersList]);

    const downloadFile = (type: string): void => {
        dispatch(getFile(getRequestFile(type, MODULE, data?.data as IGenericRecord[], dates, false), FILE_NAME));
    };

    const resetFilter = (): void => {
        setSearch('');
        setFilter(BASE_FILTER);
    };

    const orderOptionsRender = ORDER_OPTIONS.map(item => ({ ...item, name: item.value }));

    return (
        <>
            {queryParam ? (
                <SendEmail data={displayProofPayment} />
            ) : displayProofPayment.urlProofPayment && !backQuery ? (
                <DisplayProofPayment
                    proof={displayProofPayment.proof}
                    onClickBack={(): void => {
                        setFilter(BASE_FILTER);
                        setDisplayProofPayment({ ...displayProofPayment, urlProofPayment: '' });
                    }}
                    urlProofPayment={displayProofPayment.urlProofPayment}
                    data={displayProofPayment}
                />
            ) : (
                <>
                    <PageTitleCustom title={getRouteName(Routes.WEBSITE_MENU)} classTitle="text-base" />
                    <BreadCrumb routes={routes()} />
                    <div className="flex items-center justify-center mb-2 -mt-4.5 align-middle">
                        <PageTitleCustom classTitle="text-26lg" title={WEBSITE_DASHBOARD.TITLE} />
                    </div>
                    <div className="flex justify-between mb-4 xs:flex-col">
                        <Information
                            color="blue"
                            title="Listado de ventas de su tienda diggital"
                            description={DESCRIPTION_INFORMATION}
                            classNameTitle="mt-2.5 mb-4"
                        />
                        <DownloadIcons
                            moduleId={ModuleApp.VIRTUAL_STORE}
                            className="-mr-2 xs:-mb-2 xs:mt-4 xs:self-end"
                            download={downloadIconsProps(downloadFile, ModuleApp.VIRTUAL_STORE).download}
                            withoutText
                        />
                    </div>

                    <Form sendWithEnter className="flex flex-row items-center justify-between xs:flex-col">
                        <div className="flex flex-row w-full xs:flex-col">
                            <SearchInput
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-search`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Buscar por:"
                                classesWrapper="w-57.5 xs:w-full"
                                classesWrapperInput="h-8 bg-white"
                                classesInput="text-tiny text-placeholder"
                                placeholder="Cliente"
                                value={search}
                                isNew
                                onChange={(e): void => {
                                    setSearch(removeSpecialCharacters(lowerCase(e.target.value)));
                                }}
                            />
                            <DatePickerDayInput
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-start-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Fecha inicial:"
                                classesLabel="font-allerbold"
                                classesWrapper="lg:w-38 xs:w-full xs:ml-0 ml-4.5"
                                classesWrapperInput="bg-white"
                                selected={dates.start_date}
                                onChangeDate={(date: Date): void => {
                                    resetFilter();
                                    changeDate(date, START_DATE);
                                }}
                                minDate={getDateCreated(creationDate || 0)}
                                maxDate={getMaxDate(START_DATE, dates.finish_date)}
                            />
                            <DatePickerDayInput
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-finish-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Fecha final:"
                                classesLabel="font-boallerboldld"
                                classesWrapper="lg:w-38 xs:w-full ml-4.5 xs:ml-0 xs:mt-2"
                                classesWrapperInput="bg-white"
                                selected={dates.finish_date}
                                onChangeDate={(date: Date): void => {
                                    resetFilter();
                                    changeDate(date, FINISH_DATE);
                                }}
                                minDate={getDateCreated(creationDate || 0)}
                                maxDate={getMaxDate(FINISH_DATE, dates.finish_date)}
                            />
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-order-by`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="order_by"
                                placeholder="Seleccionar"
                                classesInput="md:w-38"
                                classesWrapper="md:w-38 ml-4.5 xs:ml-0  w-full"
                                classesWrapperInput="bg-white"
                                labelText="Ordenar por:"
                                optionSelect={orderOptionsRender}
                                onChangeSelect={(_, option): void => {
                                    setFilter(option);
                                }}
                                valueSelect={filter?.value}
                            />
                        </div>
                    </Form>
                    <Table
                        id={generateId({
                            module: ModuleApp.VIRTUAL_STORE,
                            submodule: `virtual-store-sales`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        isLoading={loaderState}
                        headersTable={headerTable}
                        data={data?.data as IGenericRecord[]}
                        fieldsBody={dataFieldsBody(handleSalesReceipts)}
                        className="w-max"
                        wrapperClassName="container-table"
                        isFooterRowsCustom
                        footerRowsCustom={<CustomFooter data={data?.data as IGenericRecord[]} />}
                        paginatorBackendData={{ ...data, setData: setData }}
                        isNew
                    />
                    {Boolean(data?.data?.length) && search && <NotFindElements />}
                    <div className="mt-auto">
                        <PageButtonsFooter
                            {...buttonsFooterProps(ModuleApp.VIRTUAL_STORE, history, getRoute(Routes.ACCOUNTING_REPORTS_MENU), {
                                name: getRouteName(Routes.ACCOUNTING_REPORTS_MENU),
                                moduleName: getRouteName(Routes.WEBSITE_MENU),
                            })}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default virtualStoreSalesReceipts;

const DisplayProofPayment: React.FC<IDisplayProofPaymentProps> = ({ proof, onClickBack, urlProofPayment, data }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [documentResponse, setDocumentResponse] = useState({ dian: '', client: '' });
    const iconResponse = {
        dian: { ACCEPTED: 'checkBlue', REJECTED_DIAN: 'rejectedBlue', null: 'revision', PENDING_DIAN: 'revision' },
        client: { REJECTED_CLIENT: 'rejectedBlue', IN_VERIFICATION: 'revision', ACCEPTED: 'checkBlue', null: 'revision' },
    };
    const getRoutes = (): Section[] => {
        const resultRoutes = routes(onClickBack);
        resultRoutes.splice(resultRoutes.length, 0, {
            name: data?.invoice_type === INVOICE ? STATE_DOCUMENT : data?.invoice_type,
            route: '#',
        });
        return resultRoutes;
    };
    useEffect(() => {
        setDocumentResponse({
            dian: getEnum(DIAN_RESPONSE, data?.answer_dian),
            client: getEnum(CUSTOMER_RESPONSE, data?.answer_client),
        });
    }, [data]);

    const actions: IGenericRecord = {
        pdf: urlProofPayment,
        xml: '',
        print: urlProofPayment,
        mail: '',
    };

    return (
        <>
            <div className="h-full overflow-hidden">
                <PageTitleCustom title={getRouteName(Routes.WEBSITE_MENU)} classTitle="text-base" />
                <BreadCrumb routes={getRoutes()} />
                <div className="flex items-center justify-center mb-2 -mt-4.5 align-middle">
                    <PageTitleCustom classTitle="text-26lg" title="Consulte los reportes del sitio web" />
                </div>
                <h4 className="font-allerbold text-blue mb-4.5 text-lg">
                    {data?.invoice_type === INVOICE ? STATE_DOCUMENT : data?.invoice_type}
                </h4>
                <p className="text-base text-gray-dark font-aller">
                    A continuación, conozca a detalle el estado de su documento y haga click en la acción que necesite
                </p>
                <div className="flex md:flex-row flex-col  space-x-0 space-y-4 md:space-y-0 items-center md:items-start md:space-x-4 mt-4.5">
                    {BUTTONS_INVOICE.filter(item =>
                        data?.invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE && documentResponse.dian === DIAN_RESPONSE.ACCEPTED
                            ? item
                            : item.id !== TWO
                    ).map(item => {
                        return item?.identifier !== MAIL ? (
                            <a
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-detail-status-${item?.icon}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                key={item.id}
                                href={actions[item?.identifier]}
                                className="no-underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button
                                    onClick={(): void => {
                                        item.id === TWO && dispatch(downloadXml(data?.file_name_extension));
                                    }}
                                    className={`flex items-center ${
                                        item.id === THREE ? 'justify-center space-x-9' : 'justify-center space-x-2'
                                    } pl-1 pr-2 align-middle bg-white rounded custom-button`}
                                >
                                    <Icon name={item?.icon} className="cursor-pointer w-7.5 h-8.2" />
                                    <p className="break-words letter-size">{item.text}</p>
                                </button>
                            </a>
                        ) : (
                            <button
                                id={generateId({
                                    module: ModuleApp.VIRTUAL_STORE,
                                    submodule: `virtual-store-sales-detail-status-${item.id}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                key={item.id}
                                onClick={(): void => {
                                    history.push('?email-template=true');
                                }}
                                className="flex items-center justify-center pl-1 pr-1 align-middle bg-white rounded custom-button"
                            >
                                <Icon name={item?.icon} className="cursor-pointer w-7.5 h-8.2" />
                                <p className="ml-1 break-words letter-size">{item.text}</p>
                            </button>
                        );
                    })}
                </div>
                <div className="border-sm mt-4.5 bg-white xs:pr-2">
                    <div className="flex justify-between w-full">
                        <div className="mt-7">
                            <p className="ml-4 xs:mb-2 text-blue font-allerbold">
                                Número de documento: <span className="mt-1 ml-1 xs: text-purple font-aller">{proof}</span>
                            </p>
                            {data?.invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE && (
                                <div>
                                    <span className="flex ml-4 text-blue font-allerbold">
                                        Prefijo: <p className="mt-1 ml-1 text-purple font-aller">{data?.prefix ?? proof}</p>
                                    </span>
                                    <p className="text-blue mt-5.5 ml-4 font-allerbold xs:break-all text-base">
                                        Estado de la transmisión y envío a cliente
                                    </p>
                                    <div className="flex flex-col ml-4 mt-5.5">
                                        <div className="flex">
                                            <div className="flex items-center justify-center w-10 h-10 align-middle border border-green-400 rounded-full border-lg">
                                                <Icon
                                                    name={getEnum(iconResponse.dian, data?.answer_dian) as IconsNames}
                                                    className="w-5.5 h-5.5"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center align-middle">
                                                <span className="flex ml-4 xs:flex-col text-blue">
                                                    1. Respuesta DIAN:
                                                    <p className="mt-1 ml-1 text-purple">{documentResponse.dian}</p>
                                                </span>
                                                <p className="ml-4 text-blue font-allerbold">
                                                    {data?.answer_dian_date &&
                                                        getDateFromUnix(data?.answer_dian_date ?? '')?.dateFormat}
                                                </p>

                                                {documentResponse.dian === DIAN_RESPONSE.REJECTED_DIAN && (
                                                    <button
                                                        id={generateId({
                                                            module: ModuleApp.VIRTUAL_STORE,
                                                            submodule: `virtual-store-sales-review-rejected-dian`,
                                                            action: ActionElementType.INFO,
                                                            elementType: ElementType.BTN,
                                                        })}
                                                        onClick={(): void => {
                                                            history.push(
                                                                `${getRoute(
                                                                    Routes.CORRECTION_BUSINESS_DOCUMENT
                                                                )}?component=invoice-correction&id=${data?.id}`
                                                            );
                                                        }}
                                                        className="ml-4 w-37 mb-1 rounded items-center mt-1 flex shadow-templateDesign pl-2 pr-2 h-8.2 bg-white "
                                                    >
                                                        <Icon name="infoGreen" classIcon="w-5.5 h-5.5" />
                                                        <p className="ml-2 text-sm text-blue">Revisar rechazo</p>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {documentResponse.dian !== DIAN_RESPONSE.REJECTED_DIAN && (
                                            <div className="h-5 bg-green w-0.25 ml-4.5 xs:hidden" />
                                        )}
                                        {documentResponse.dian !== DIAN_RESPONSE.REJECTED_DIAN && (
                                            <div className="flex">
                                                <div className="flex items-center justify-center w-10 h-10 align-middle border border-green-400 rounded-full border-lg">
                                                    <Icon
                                                        name={getEnum(iconResponse?.client, data?.answer_client) as IconsNames}
                                                        className="w-5.5 h-5.5"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center align-middle">
                                                    <span className="flex ml-4 xs:flex-col text-blue">
                                                        2. Respuesta cliente:
                                                        <p className="mt-1 ml-1 text-purple">{documentResponse.client}</p>
                                                    </span>
                                                    <p className="ml-4 text-blue font-allerbold">
                                                        {data?.answer_client_date &&
                                                            getDateFromUnix(data?.answer_client_date ?? '')?.dateFormat}
                                                    </p>
                                                    {documentResponse.client === CUSTOMER_RESPONSE.REJECTED_CLIENT && (
                                                        <button
                                                            id={generateId({
                                                                module: ModuleApp.VIRTUAL_STORE,
                                                                submodule: `virtual-store-sales-review-rejected-client`,
                                                                action: ActionElementType.INFO,
                                                                elementType: ElementType.BTN,
                                                            })}
                                                            onClick={(): void =>
                                                                history.push(
                                                                    `${getRoute(
                                                                        Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER
                                                                    )}?invoice_id=${data?.id}`
                                                                )
                                                            }
                                                            className="ml-4 w-37  rounded items-center mt-1 flex shadow-templateDesign pl-2 pr-2 h-8.2 bg-white "
                                                        >
                                                            <Icon name="infoGreen" className="w-5.5 h-5.5" />
                                                            <p className="ml-2 text-sm text-blue">Revisar rechazo</p>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center justify-center w-6/12 pb-2 align-middle xs:hidden mt-7 border-sm mb-7 shadow-templateDesign mr-7 bg-green-extraLight">
                            <InvoiceViewer noIcons invoicePDFUrl={urlProofPayment} isPDF />
                        </div>
                    </div>
                    {data?.invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE && (
                        <div className="ml-4 overflow-hidden xs:mt-4.5 pb-4">
                            <p className="mr-4">
                                Para consultar en el portal de la DIAN la información de la factura electrónica y los eventos
                                asociados a ella, haga click en el link del CUFE.
                            </p>
                            <a className="mt-2 text-base break-words" href={data?.dian_url}>
                                {data?.cufe || 'cufe'}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <Button
                id={generateId({
                    module: ModuleApp.VIRTUAL_STORE,
                    submodule: `virtual-store-sales`,
                    action: ActionElementType.BACK,
                    elementType: ElementType.BTN,
                })}
                text="Atrás"
                background="white"
                onClick={onClickBack}
                classes="ml-auto back-button  shadow-templateDesign mt-7 xs:mr-auto xs:mb-4.5 xs:mt-5"
            />
        </>
    );
};
