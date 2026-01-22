import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { getElectronicDocumentSalesReport } from '@redux/sales-report-sales-force/action';
import usePopper from '@hooks/usePopper';
import { formatNumber } from '@utils/Number';
import { buttonsFooterProps } from '@utils/Button';
import { SubstringText } from '@utils/SubstringText';
import { getRoute, getRouteName } from '@utils/Paths';
import { getCurrentFormattedDate, getDateFormat, getDateForMonth, getUnixFromDate } from '@utils/Date';
import { remToPx } from '@utils/Size';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { MONTHS } from '@constants/Date';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { ZERO } from '@pages/website-editor';
import { colorsPositions } from '@pages/website-analytics/pages/website-metrics';
import BreadCrumbPrint from '@pages/website-analytics/components/bread-crumb-print';
import { TopBuyerCard } from '@pages/website-analytics/pages/website-metrics/components/topBuyerCard';
import CustomBarChart from '@pages/website-analytics/pages/website-metrics/components/custom-bar-chart';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { Tooltip } from '@components/tooltip';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { DatePickerMonthInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { CustomLineChart, NUMBER_FORMAT_OPTIONS } from './components';
import { MAX_DIGITS, MONTH_NAMES, Positions, routes } from '.';
import './SalesReport.scss';

const SalesReport: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const mainRef = useRef<HTMLElement | null>(null);
    const {
        anchorEl,
        togglePopper,
        mouseProps: { onMouseLeave },
    } = usePopper();

    const { information, electronicDocumentsSalesReport } = useSelector(({ company, salesReportSalesForce }: RootState) => ({
        ...company,
        ...salesReportSalesForce,
    }));

    const [data, setData] = useState(electronicDocumentsSalesReport);
    const [date, setDate] = useState<Date>(new Date());
    const [lastMonth, setLastMonth] = useState<string>('');
    const [isPrint, setIsPrint] = useState(false);

    const creationDate = useMemo(() => Number(information?.created_at), [information]);

    useEffect(() => {
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        dispatch(
            getElectronicDocumentSalesReport({
                start_date: getDateFormat(date).dateWithDash,
            })
        );

        let indexLastMonth = date.getMonth() - 1;

        if (indexLastMonth < ZERO) indexLastMonth = 11;

        setLastMonth(MONTHS[indexLastMonth]);
    }, [date]);

    useEffect(() => {
        setData(electronicDocumentsSalesReport);
    }, [electronicDocumentsSalesReport]);

    const topProductsSold = useMemo(() => {
        return data?.most_selled_products?.map((mostSoldProduct: IGenericRecord) => ({
            id: mostSoldProduct.unique_products_id,
            producto: SubstringText(mostSoldProduct?.unique_product_name, 15),
            ventas: parseFloat(mostSoldProduct?.total_quantity),
        }));
    }, [data]);

    const topClients = useMemo(() => {
        return data?.best_buyers?.map(({ count, ...res }: IGenericRecord, index: number) => ({
            ...res,
            name: String(res.name).toLowerCase(),
            position: index + 1,
            score: count,
            height: index === Positions.First ? '28' : index === Positions.Second ? '23' : '18',
            showIcon: index === Positions.First,
        }));
    }, [data]);

    const salesForMonth = useMemo(() => {
        const months = data?.invoice_counts_by_month;
        if (months) {
            const result = Object.entries(months).map(([month, value]) => ({
                month: MONTH_NAMES[month as keyof typeof MONTH_NAMES],
                value,
            }));
            return result;
        }
        return [];
    }, [data]);

    const generatePDF = async (): Promise<void> => {
        if (mainRef.current) {
            setIsPrint(true);
            const node = mainRef.current;

            await document.fonts.ready;

            const dataUrl = await toPng(node, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                },
                width: node.scrollWidth,
                height: node.scrollHeight,
            });

            const img = new Image();
            img.src = dataUrl;
            img.onload = (): void => {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: 'a4',
                });
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                const padding = 20;

                const availableWidth = pageWidth - padding * 2;
                const availableHeight = pageHeight - padding * 2;

                const imgProps = pdf.getImageProperties(img);
                const imgRatio = imgProps.height / imgProps.width;
                const imgHeight = availableWidth * imgRatio;

                const finalImgHeight = Math.min(imgHeight, availableHeight);

                pdf.addImage(img, 'PNG', padding, padding, availableWidth, finalImgHeight);
                pdf.save('Reporte de Ventas.pdf');
                setIsPrint(false);
            };
        }
    };
    return (
        <>
            {data && (
                <main className="sales-report" id="salesReport" ref={mainRef}>
                    <PageTitle
                        pageContent={SUPPORT_DOCUMENTS_SUBTITLE}
                        title={SUPPORT_DOCUMENTS_TITLE}
                        classContainer="without-margin"
                    />

                    {!isPrint ? <BreadCrumb routes={routes()} /> : <BreadCrumbPrint routes={routes()} />}
                    {isPrint && (
                        <p className="sales-report__download-day" id="downloadDate">
                            Dia de descarga:{getCurrentFormattedDate()}
                        </p>
                    )}
                    <h3 className="sales-report__title">Consulte los reportes contables</h3>
                    <section className="sales-report__sub-title">
                        {!isPrint && (
                            <span className="mr-2" onClick={togglePopper} onMouseLeave={onMouseLeave}>
                                <Icon name="infoGreen" className="sales-report__subtitle--icon" />
                                <Tooltip
                                    anchorEl={anchorEl}
                                    iconName="infoBlue"
                                    placement="bottom-start"
                                    wrapperClassName="rounded"
                                    title="Reporte de ventas:"
                                    description="Es un informe que le permite tener una visión más completa de sus ventas"
                                />
                            </span>
                        )}
                        <h3 className="sales-report__sub-title--title">Reporte de Ventas</h3>
                    </section>
                    {!isPrint && (
                        <p className="sales-report__paragraph">
                            A continuación, encuentra un reporte con los datos más relevantes de las ventas realizadas.
                        </p>
                    )}
                    <Form
                        className={`sales-report__form ${isPrint ? 'sales-report__form--print' : 'sales-report__form--desktop'}`}
                    >
                        <>
                            <DatePickerMonthInput
                                id={generateId({
                                    module: ModuleApp.ACCOUNTING_REPORTS,
                                    submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-filter-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Fecha:"
                                onChangeDate={(newDate): void => {
                                    const sameMonth =
                                        date.getMonth() === newDate.getMonth() && date.getFullYear() === newDate.getFullYear();
                                    if (sameMonth) return;
                                    setDate(newDate);
                                }}
                                selected={getUnixFromDate(date)}
                                selectIconType="calendarGreen"
                                classesWrapper="w-49 mb-7"
                                isPrint={isPrint}
                                minDate={new Date(getDateForMonth(creationDate))}
                            />
                            {!isPrint && (
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.ACCOUNTING_REPORTS,
                                        submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-pdf`,
                                        action: ActionElementType.DOWNLOAD,
                                        elementType: ElementType.ICO,
                                    })}
                                    className="sales-report__icon-pdf icon-download-metrics"
                                    onClick={(): Promise<void> => generatePDF()}
                                    name="newPdf"
                                />
                            )}
                        </>
                    </Form>
                    <section className={`flex ${isPrint ? 'sales-report__dates--print' : 'sales-report__dates--desktop'}`}>
                        <article
                            id={generateId({
                                module: ModuleApp.ACCOUNTING_REPORTS,
                                submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-total-sales`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            className="sales-report__dates--date card"
                        >
                            <p className="sales-report__dates--title">Ventas totales</p>
                            <div className="sales-report__dates--content">
                                <Icon name="graphic" classIcon="icon--graph" />
                                <Icon name="separatorPurple" classIcon="icon--line" />
                                <div className="flex flex-col w-full text-left">
                                    <p
                                        className={`text-purple ${
                                            String(Math.floor(data?.total_sale)).length > MAX_DIGITS ? 'text-lg' : 'text-1.5xl'
                                        }`}
                                    >
                                        #{formatNumber(Math.floor(data?.total_sale), NUMBER_FORMAT_OPTIONS)}
                                    </p>
                                    <div className="sales-report__dates--paragraph">
                                        {data?.percentage_sales > ZERO && (
                                            <Icon name="plusMulticolor" className="relative top-1" />
                                        )}
                                        <p>
                                            <span className="font-allerbold">
                                                {formatNumber(data?.percentage_sales, NUMBER_FORMAT_OPTIONS)}%
                                            </span>
                                            &nbsp; comparado con el
                                            <span className="font-allerbold"> mes de {lastMonth}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article
                            id={generateId({
                                module: ModuleApp.ACCOUNTING_REPORTS,
                                submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-total-invoices`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            className="sales-report__dates--date card"
                        >
                            <p className="sales-report__dates--title"># facturas totales</p>
                            <p className="text-5xl text-purple font-allerbold">
                                {formatNumber(data?.record_count, NUMBER_FORMAT_OPTIONS)}
                            </p>
                        </article>
                        <article
                            id={generateId({
                                module: ModuleApp.ACCOUNTING_REPORTS,
                                submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-new-clients`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            className="sales-report__dates--date card"
                        >
                            <p className="sales-report__dates--title"># de nuevos clientes</p>
                            <div className="flex items-center justify-center">
                                <Icon name="people" classIcon="icon--graph" />
                                <Icon name="separatorPurple" classIcon="icon-line-space px-2" />
                                <p className="text-2xl text-purple font-allerbold">
                                    {formatNumber(data?.new_customer, NUMBER_FORMAT_OPTIONS)}
                                </p>
                                <Icon name="upArrowPurple" classIcon="icon--arrow-up ml-2" />
                            </div>
                        </article>
                        <article
                            id={generateId({
                                module: ModuleApp.ACCOUNTING_REPORTS,
                                submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-total-products-sales`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            className="sales-report__dates--date card"
                        >
                            <p className="sales-report__dates--title"># Productos vendidos</p>
                            <div className="sales-report__dates--content">
                                <Icon name="salesBox" classIcon="icon--graph" />
                                <Icon name="separatorPurple" classIcon="icon--line" />
                                <div className="flex flex-col w-full text-left">
                                    <p className="w-full text-lg text-purple">
                                        {formatNumber(data?.total_most_selled_products, NUMBER_FORMAT_OPTIONS)}
                                    </p>
                                    <div className="sales-report__dates--paragraph">
                                        <p>
                                            <span className="font-allerbold">
                                                {formatNumber(data?.percentage_sales_products, NUMBER_FORMAT_OPTIONS)}%
                                            </span>
                                            &nbsp; comparado con el
                                            <span className="font-allerbold"> mes de {lastMonth}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>
                    <section
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-total-sales-chart`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.CRD,
                        })}
                        className={`sales-report__graphics  ${
                            isPrint ? 'sales-report__graphics--print' : 'sales-report__graphics--desktop'
                        }`}
                    >
                        <article className={`sales-report__line-chart card ${isPrint ? 'sales-report__isPrint-line' : ''}`}>
                            <p className="text-sm mt-4.5 mb-6.70 font-allerbold text-blue">Ventas totales</p>
                            {salesForMonth && <CustomLineChart data={salesForMonth} />}
                        </article>
                        <div>
                            <article
                                id={generateId({
                                    module: ModuleApp.ACCOUNTING_REPORTS,
                                    submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-top-products-sold`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CHT,
                                })}
                                className={`sales-report__bar-chart card ${isPrint ? 'sales-report__isPrint-chart' : ''}`}
                            >
                                <p className="text-sm text-center font-allerbold text-blue">Productos más vendidos</p>
                                {topProductsSold && (
                                    <CustomBarChart data={topProductsSold} height={remToPx(9.375)} fontSize={remToPx(0.625)} />
                                )}
                            </article>
                            <article
                                id={generateId({
                                    module: ModuleApp.ACCOUNTING_REPORTS,
                                    submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-top-clients`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CHT,
                                })}
                                className={`sales-report__top-buyer card ${isPrint ? 'sales-report__isPrint-chart' : ''}`}
                            >
                                <p className="text-base text-center h-13 text-blue font-allerbold">
                                    Clientes que más han comprado
                                </p>
                                <div className="flex flex-row items-end justify-center gap-3">
                                    {topClients?.map((client: IGenericRecord, index: number) => (
                                        <TopBuyerCard
                                            {...client}
                                            backgroundColor={colorsPositions[index]}
                                            itemKey={client.id}
                                            key={index}
                                        />
                                    ))}
                                </div>
                                <Icon className="mt-1.5 mb-4.5 w-full" name="purpleLinePoints" />
                            </article>
                        </div>
                    </section>
                </main>
            )}

            <div className="sales-report__footer-buttons">
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.ACCOUNTING_REPORTS,
                        history,
                        getRoute(Routes.PLANNING_AND_ORGANIZATION_MENU),
                        {
                            name: getRouteName(Routes.ENABLE_ELECTRONIC_BILLER),
                            moduleName: getRouteName(Routes.ENABLE_ELECTRONIC_BILLER),
                        }
                    )}
                />
            </div>
        </>
    );
};

export default SalesReport;
