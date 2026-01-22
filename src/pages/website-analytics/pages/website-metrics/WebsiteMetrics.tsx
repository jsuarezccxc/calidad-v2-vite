import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { WEBSITE_ANALYTICS } from '@information-texts/WebsiteDashboard';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import { Routes } from '@constants/Paths';
import { Icon } from '@components/icon';
import { DatePickerDayRange } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Information } from '@components/information';
import { Form } from '@components/form';
import usePopper from '@hooks/usePopper';
import useWindowSize from '@hooks/useWindowSize';
import { usePrintWindow } from '@hooks/usePrint';
import CardArticle from '@pages/website-analytics/pages/website-dashboard/components/card-article';
import BreadCrumbPrint from '@pages/website-analytics/components/bread-crumb-print';
import { RootState } from '@redux/rootReducer';
import { getAnalyticalReports } from '@redux/website/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { buttonsFooterProps } from '@utils/Button';
import { getCurrentFormattedDate, getDateCreated, getDateFormat } from '@utils/Date';
import { getRoute, getRouteName } from '@utils/Paths';
import { SubstringText } from '@utils/SubstringText';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { TopBuyerCard } from './components/topBuyerCard';
import CustomBarChart from './components/custom-bar-chart';
import { ONE_MONT_IN_PAST, TODAY_DATE } from '../website-dashboard';
import { colorsPositions, positions, routes, routesPremium, getPlan, IPlan, Plan, includesSupportDocument } from '.';
import './WebsiteMetrics.scss';

const WebsiteMetrics: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { information, reports, membership_selected } = useSelector(({ company, website, membership }: RootState) => ({
        ...company,
        ...website,
        ...membership,
    }));

    const { anchorEl: anchorElTitle, mouseProps } = usePopper();

    const haveSupportDocument = useMemo((): boolean => includesSupportDocument(membership_selected), [membership_selected]);

    const { width: widthScreen } = useWindowSize();

    const isMobile = useMemo(() => widthScreen < 768, [widthScreen]);

    const [startDate, setStartDate] = useState<Date>(ONE_MONT_IN_PAST);
    const [endDate, setEndDate] = useState<Date>(TODAY_DATE);
    const [isPrint, setIsPrint] = useState(false);
    const [plan, setPlan] = useState<IPlan>({ sections: [], name: Plan.Basic });

    const getDiffInDays = (): number => {
        const start = new Date(startDate);
        const finish = new Date(endDate);

        const diff = finish.getTime() - start.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        return diffInDays;
    };

    const diffInDays = useMemo(() => getDiffInDays(), [startDate, endDate]);

    useEffect(() => {
        if (endDate && startDate) {
            dispatch(
                getAnalyticalReports({
                    start_date: getDateFormat(startDate).dateWithDash,
                    finish_date: getDateFormat(endDate).dateWithDash,
                })
            );
        }
    }, [endDate, startDate]);

    useEffect(() => setPlan(getPlan(membership_selected || [])), [membership_selected]);

    useEffect(() => {
        if (isPrint)
            print().then(() => {
                setIsPrint(false);
            });
    }, [isPrint]);

    const onChange = (dates: Date | [Date, Date] | null): void => {
        const [start, end] = dates as [Date, Date];
        setStartDate(start);
        setEndDate(end);
    };

    const topClients = useMemo(() => {
        return reports?.topClients?.map(({ quantity, ...res }: IGenericRecord, index: number) => ({
            ...res,
            position: index + 1,
            score: quantity,
            height: index === positions.FIRST ? '28' : index === positions.SECOND ? '23' : '18',
            showIcon: index === positions.FIRST,
        }));
    }, [reports]);

    const topProductsSold = useMemo(() => {
        return reports?.topProductsSold?.slice(0, 4)?.map((product: IGenericRecord) => ({
            id: product.id,
            producto: SubstringText(product.name, 15),
            ventas: product.quantity,
        }));
    }, [reports]);

    const print = usePrintWindow({
        width: 1280,
        height: 965,
        idContainer: 'reportAnalytics',
        styleContainer: 'width: 1060px; margin:auto; margin-top: 1.875rem !important; font-family: Aller;',
        fileName: 'Reporte de analítica de su Sitio web',
    });

    const getDescriptionInformation = (): string | undefined => {
        if (isPrint) return undefined;
        if (plan.name === Plan.Premium) return WEBSITE_ANALYTICS.DESCRIPTION_PREMIUM;
        return WEBSITE_ANALYTICS.DESCRIPTION;
    };

    const routeBreadCrumb = plan.name === Plan.Premium ? routesPremium() : routes();

    return (
        <>
            <div id="reportAnalytics">
                <PageTitle title={WEBSITE_DESIGN_AND_ADMINISTRATION} classTitle="text-base" />
                {!isPrint ? <BreadCrumb routes={routeBreadCrumb} /> : <BreadCrumbPrint routes={routeBreadCrumb} />}
                {isPrint && (
                    <p className="m-0 -mt-3 leading-4 text-tiny text-blue font-aller" id="downloadDate">
                        Dia de descargas:{getCurrentFormattedDate()}
                    </p>
                )}
                <h1 className="text-26lg font-allerbold text-center w-full mt-2.5 mb-4.5 text-blue">{WEBSITE_ANALYTICS.TITLE}</h1>

                <Information
                    classNameContainer="mb-4.5"
                    onClickIcon={isPrint ? undefined : (): void => {}}
                    classNameTitle="text-blue text-lg"
                    title={plan.name === Plan.Premium ? WEBSITE_ANALYTICS.SUBTITLE_PREMIUM : WEBSITE_ANALYTICS.SUBTITLE}
                    description={getDescriptionInformation()}
                    hoverIcon={
                        isPrint
                            ? undefined
                            : {
                                  anchorElTitle,
                                  mouseProps,
                                  description: WEBSITE_ANALYTICS.TOOLTIP_DESCRIPTION,
                              }
                    }
                />
                <section className="mt-4.5 flex flex-col">
                    <Form className="flex items-end justify-between container-download-metrics">
                        <DatePickerDayRange
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-date-range`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper="w-49"
                            classesWrapperInput="bg-white w-49"
                            classesInput="w-185"
                            labelText="Fecha:"
                            startDate={startDate}
                            maxDate={new Date()}
                            endDate={endDate || undefined}
                            onChangeDateRange={onChange}
                            placeholder="dd/mm/aaaa - dd/mm/aaaa"
                            withoutDate
                            minDate={getDateCreated(information?.created_at || 0)}
                        />
                        {isPrint ? undefined : (
                            <Icon
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${ModuleApp.ANALYTICAL_REPORTS}-pdf`,
                                    action: ActionElementType.DOWNLOAD,
                                    elementType: ElementType.ICO,
                                })}
                                name="newPdf"
                                className="ml-2 icon-download-metrics bg-white rounded px-0.5 py-0.75 cursor-pointer hover:scale-110 transition shadow-templateDesign"
                                onClick={(): void => {
                                    setIsPrint(true);
                                }}
                            />
                        )}
                    </Form>
                    <div
                        className={`flex gap-2 my-4 ${
                            isMobile && isPrint ? 'flex-row' : isMobile ? 'xs:flex-col' : 'flex-row'
                        } xs:items-center`}
                    >
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-total-visits`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Ingresos Totales  sitio web"
                            classCard="card__small"
                            classTitle="pt-4.5 px-2 mx-8"
                        >
                            <span className="pt-2 m-auto text-xl leading-10 text-center text-purple w-34 font-allerbold">
                                {reports?.total}
                            </span>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-new-customers`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="# de nuevos clientes"
                            classCard="card__small"
                            classTitle="mx-auto pb-3 pt-2"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="people" classIcon="people-icon" />
                                <Icon name="separatorPurple" classIcon="separator-icon px-2" />
                                <span className="w-auto pr-1.5 text-2xl leading-6 text-center text-purple font-allerbold whitespace-nowrap">
                                    {reports?.quantityNewClients}
                                </span>
                                <Icon name="upArrowPurple" classIcon="arrow-up-icon ml-2" />
                            </div>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-total-sales`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="# Ventas realizadas"
                            classCard="card__small"
                            classTitle="mx-auto pb-3"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="checkOnBox" classIcon="box-icon pr-4" />
                                <Icon name="separatorPurple" classIcon="separator-box-icon pr-2" />
                                <div className="flex flex-col items-start w-full text-left">
                                    <span className="text-xl text-left font-allerbold text-purple">{reports?.quantitySales}</span>
                                    <p className="inline-block m-0 text-sm leading-4 text-left w-34">
                                        <span className="inline-block font-allerbold">
                                            {reports?.percentageSalesDiffLastPeriod}% &nbsp;
                                        </span>
                                        comparado con los últimos &nbsp;
                                        <span className="inline-block font-allerbold">
                                            {endDate && startDate ? diffInDays : 'xxx'}
                                        </span>
                                        &nbsp; días
                                    </p>
                                </div>
                            </div>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-total-abandoned-shopping-carts`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Carritos abandonados"
                            classCard="card__small"
                            classTitle="mx-auto pb-3 pt-1"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="abandonedCart" classIcon="cart-icon pr-4" />
                                <Icon name="separatorPurple" classIcon="separator-box-icon pr-2" />
                                <div className="flex flex-col items-start w-full text-left">
                                    <span className="text-xl text-left font-allerbold text-purple">
                                        {reports?.quantityAbandonedShoppingCar}
                                    </span>
                                    <p className="inline-block m-0 text-sm leading-4 text-left w-34">
                                        <span className="inline-block font-allerbold">
                                            {reports?.percentageAbandonedDiffLastPeriod}% &nbsp;
                                        </span>
                                        comparado con los últimos &nbsp;
                                        <span className="inline-block font-allerbold">
                                            {endDate && startDate ? diffInDays : 'xxx'}
                                        </span>
                                        &nbsp; días
                                    </p>
                                </div>
                            </div>
                        </CardArticle>
                    </div>
                    <div
                        className={`flex ${
                            isMobile && isPrint ? 'flex-row' : isMobile ? 'xs:flex-col' : 'flex-row'
                        }  xs:items-center w-full gap-4.5 mt-0.5`}
                    >
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-top-products-sold`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Productos más vendidos en el sitio web"
                            classCard="card__medium card-chart"
                            classTitle="text-base w-72 mx-auto leading-4 font-allerbold text-blue mt-3 p-0"
                        >
                            {topProductsSold && <CustomBarChart data={topProductsSold} />}
                        </CardArticle>
                        <section className="flex flex-col justify-center items-center gap-4.5">
                            <CardArticle
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${ModuleApp.ANALYTICAL_REPORTS}-top-clients`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                classCard="card__medium card-leaderboard"
                                title="Clientes que más han comprado"
                                classTitle="text-base w-72 mx-auto leading-4 font-allerbold text-blue mt-5 p-0"
                            >
                                <div className="flex flex-col mb-3 mt-7">
                                    <div className="flex flex-row items-end justify-center gap-3">
                                        {topClients?.map((client: IGenericRecord, index: number) => (
                                            <TopBuyerCard
                                                {...client}
                                                backgroundColor={colorsPositions[index]}
                                                itemKey={client.id}
                                                key={client.id}
                                            />
                                        ))}
                                    </div>
                                    <Icon classIcon="mt-1.5" name="purpleLinePoints" />
                                </div>
                            </CardArticle>
                        </section>
                    </div>
                </section>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.WEBSITE,
                    history,
                    getRoute(haveSupportDocument ? Routes.VIRTUAL_STORE_SALES_RECEIPTS : Routes.ACCOUNTING_REPORTS_MENU),
                    {
                        name: getRouteName(Routes.ACCOUNTING_REPORTS_MENU),
                        moduleName: getRouteName(Routes.WEBSITE_MENU),
                    }
                )}
            />
        </>
    );
};

export default WebsiteMetrics;
