import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Icon } from '@components/icon';
import { DatePickerDayRange } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Information } from '@components/information';
import { Form } from '@components/form';
import { BreadCrumb } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import usePopper from '@hooks/usePopper';
import { usePrintWindow } from '@hooks/usePrint';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';
import { IGenericRecord } from '@models/GenericRecord';
import { SIXTY, TEN } from '@pages/calendar';
import { THREE } from '@pages/virtual-store-sales-receipts';
import { ZERO } from '@pages/website-editor/editor/components/drag-and-drop';
import BreadCrumbPrint from '@pages/website-analytics/components/bread-crumb-print';
import { CommonProperty } from '@models/WebsiteNode';
import { getAnalyticsData as postAnalyticsData } from '@redux/website/actions';
import { getCommonProperties } from '@redux/website-node/actions';
import { RootState } from '@redux/rootReducer';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated, getDateFormat } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import CardArticle from './components/card-article';
import CustomBarChart from './components/custom-bar-chart';
import CustomLineChart from './components/custom-line-chart/CustomLineChart';
import { ONE_MONT_IN_PAST, PLACEHOLDER_TABLE_CITY, THOUSAND, TODAY_DATE, routes } from '.';
import './WebsiteDashboard.scss';

const WebsiteDashboard: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const { domain } = useSelector((state: RootState) => state.websiteNode.commonProperties);
    const { information } = useSelector((state: RootState) => state.company);

    const [analyticsData, setAnalyticsData] = useState<IGenericRecord>({});
    const [isPrint, setIsPrint] = useState(false);

    useEffect(() => {
        if (isPrint)
            print().then(() => {
                setIsPrint(false);
            });
    }, [isPrint]);

    const { anchorEl: anchorElTitle, mouseProps } = usePopper();

    const [startDate, setStartDate] = useState<Date>(ONE_MONT_IN_PAST);
    const [endDate, setEndDate] = useState<Date | null>(TODAY_DATE);
    const print = usePrintWindow({
        width: 1060,
        height: 800,
        idContainer: 'reportAnalytics',
        styleContainer: 'width: 66.25rem; margin:auto; margin-top: -1.875rem !important',
    });

    useEffect(() => {
        dispatch(getCommonProperties([CommonProperty.Domain]));
    }, []);

    useEffect(() => {
        if (startDate && endDate && domain) getAnalyticsData();
    }, [domain, startDate, endDate]);

    const onChange = (dates: Date | [Date, Date] | null): void => {
        const [start, end] = dates as [Date, Date];
        setStartDate(start);
        setEndDate(end);
    };

    const getAnalyticsData = async (): Promise<void> => {
        const response = await dispatch(
            postAnalyticsData(
                { start_date: getDateFormat(startDate).dateWithDash, finish_date: getDateFormat(endDate).dateWithDash },
                domain
            )
        );
        setAnalyticsData(response ?? {});
    };

    const formatTime = (secondsStr: string): string => {
        const seconds = parseFloat(secondsStr);
        const minutes = seconds / SIXTY;

        if (minutes >= TEN && minutes < THOUSAND) {
            return `${!isNaN(Math.floor(minutes)) ? Math.floor(minutes) : '0'} min`;
        } else {
            return `${!isNaN(Math.round(seconds)) ? Math.round(seconds) : '0'} S`;
        }
    };

    const [MALE, FEMALE] = analyticsData?.genders ?? [];
    const [FISTPAGE, SECONDPAGE] = analyticsData?.pagesPath ?? [];
    const firstThreeCities = analyticsData?.cities?.slice(ZERO, THREE) ?? [];
    const firstThreeAges = analyticsData?.cities?.slice(ZERO, THREE) ?? [];

    return (
        <>
            <div id="reportAnalytics">
                <PageTitle classTitle="text-base" title={WEBSITE_DESIGN_AND_ADMINISTRATION} />
                {!isPrint ? <BreadCrumb routes={routes()} /> : <BreadCrumbPrint routes={routes()} />}
                {isPrint && (
                    <p className="m-0 -mt-3 leading-4 text-tiny text-blue font-aller" id="downloadDate">
                        Dia de descarga...
                    </p>
                )}
                <h1 className="text-26lg font-allerbold text-center w-full py-4.5 text-blue">{WEBSITE_DASHBOARD.TITLE}</h1>
                <Information
                    classNameContainer="mb-4.5"
                    classNameTitle="text-blue text-lg"
                    title={WEBSITE_DASHBOARD.SUBTITLE}
                    description={WEBSITE_DASHBOARD.DESCRIPTION}
                    hoverIcon={
                        isPrint
                            ? undefined
                            : {
                                  anchorElTitle,
                                  mouseProps,
                                  description: WEBSITE_DASHBOARD.TOOLTIP_DESCRIPTION,
                              }
                    }
                />
                <section className="mt-4.5 flex flex-col">
                    <div className="flex flex-row items-center justify-between print-margin">
                        <Form>
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
                                labelText="Fecha"
                                maxDate={new Date()}
                                startDate={startDate ?? undefined}
                                endDate={endDate ?? undefined}
                                onChangeDateRange={onChange}
                                placeholder="dd/mm/aaaa - dd/mm/aaaa"
                                withoutDate
                                minDate={getDateCreated(information?.created_at || 0)}
                            />
                        </Form>
                        <Icon
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-pdf`,
                                action: ActionElementType.DOWNLOAD,
                                elementType: ElementType.ICO,
                            })}
                            name="newPdf"
                            className="ml-2 bg-white rounded px-0.5 py-0.75 xl:mr-10 cursor-pointer hover:scale-110 transition shadow-templateDesign"
                            onClick={(): void => {
                                setIsPrint(true);
                            }}
                        />
                    </div>

                    <div
                        className={`flex flex-row flex-wrap ${
                            isPrint ? 'xl:justify-center' : 'xl:justify-start'
                        } justify-center  xlg:justify-center gap-2 my-4 print-justify`}
                    >
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-average-session-duration`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Tiempo promedio de permanencia"
                            classCard="card__small"
                            classTitle="mx-auto"
                        >
                            <div className="flex flex-row items-center pt-2.5">
                                <Icon name="graphic" classIcon="graph-icon mr-2" />
                                <Icon name="separatorPurple" />
                                <span className="text-4xl leading-10 text-center text-purple w-34 font-allerbold">
                                    {formatTime(analyticsData?.averageSessionDuration)}
                                </span>
                            </div>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-genre`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Género"
                            classCard="card__small"
                            classTitle="mx-auto pb-3 pt-3.75"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="womanBlue" />
                                <span className="w-auto px-2 text-xl leading-6 text-center text-green font-allerbold whitespace-nowrap">
                                    {!isNaN(Math.round(parseFloat(MALE?.percentage)))
                                        ? Math.round(parseFloat(MALE?.percentage))
                                        : 0}
                                    %
                                </span>
                                <Icon name="separatorPurple" />
                                <Icon name="menBlue" classIcon="ml-2" />
                                <span className="w-auto px-2 text-xl leading-6 text-center text-green font-allerbold whitespace-nowrap">
                                    {!isNaN(Math.round(parseFloat(FEMALE?.percentage)))
                                        ? Math.round(parseFloat(FEMALE?.percentage))
                                        : 0}
                                    %
                                </span>
                            </div>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-percentage-device`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Dispositivo de ingreso al sitio web"
                            classCard="card__small"
                            classTitle="mx-auto pb-3"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="screenBlue" />
                                <span className="w-auto px-2 text-xl leading-6 text-center text-green font-allerbold whitespace-nowrap">
                                    {!isNaN(Math.round(parseFloat(analyticsData?.percentageDesktopDevice)))
                                        ? Math.round(parseFloat(analyticsData?.percentageDesktopDevice))
                                        : '0'}
                                    %
                                </span>
                                <Icon name="separatorPurple" />
                                <Icon name="cellphoneBlue" classIcon="ml-2" />
                                <span className="w-auto px-2 text-xl leading-6 text-center text-green font-allerbold whitespace-nowrap">
                                    {!isNaN(Math.round(parseFloat(analyticsData?.percentageDesktopDevice)))
                                        ? Math.round(parseFloat(analyticsData?.percentageMobileDevice))
                                        : '0'}
                                    %
                                </span>
                            </div>
                        </CardArticle>
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-cities-visit`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Ubicación geográfica"
                            classCard="card__small"
                            classTitle="mx-auto pb-3 pt-1"
                        >
                            <div className="flex flex-row items-center justify-center px-4">
                                <Icon name="colombiaPurple" />
                                <Icon name="separatorPurple" classIcon="px-2" />
                                <div className="flex flex-col">
                                    {(firstThreeCities.length ? firstThreeCities : PLACEHOLDER_TABLE_CITY).map(
                                        (city: IGenericRecord, index: number) => (
                                            <div key={`city-${index}`} className="flex flex-row border-b-1 border-green">
                                                <p className="m-0 text-sm leading-4 text-left w-11 text-blue font-allerbold whitespace-nowrap ">
                                                    {city?.activeUsers}
                                                </p>
                                                <p className="w-auto m-0 text-sm leading-4 text-left text-blue font-allerbold whitespace-nowrap ">
                                                    {city?.city}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </CardArticle>
                    </div>
                    <div
                        className={`flex flex-row flex-wrap ${
                            isPrint ? 'justify-center' : 'justify-start'
                        } xlg:justify-center gap-4.5 mt-4.5 print-justify`}
                    >
                        <CardArticle
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.ANALYTICAL_REPORTS}-users-visit`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            title="Número de usuarios que visitaron el sitio web"
                            classCard="card__medium card-lineChart"
                            classTitle="px-2 text-base leading-4 font-allerbold text-blue w-full m-0 text-left pb-0 mt-4.5 "
                        >
                            <CustomLineChart data={analyticsData?.graphUsers ?? []} />
                        </CardArticle>
                        <section className="flex flex-col justify-center items-center gap-4.5">
                            <CardArticle
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${ModuleApp.ANALYTICAL_REPORTS}-users-per-page`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                classCard="card__medium card__double-one"
                            >
                                <div className="px-2.5 py-3 mx-auto ">
                                    <div className="flex border-b border-gray">
                                        <div className="w-1/2 px-2 py-2 leading-3 text-left text-xtiny font-allerbold bg-green bg-opacity-20 text-blue">
                                            Número de usuarios
                                        </div>
                                        <div className="w-1/2 py-2 leading-3 text-left text-xtiny font-allerbold bg-green bg-opacity-20 text-blue">
                                            Página
                                        </div>
                                    </div>
                                    <div className="flex border-b border-gray">
                                        <div className="w-1/2 px-2 py-2 leading-3 text-left text-xtiny font-allerbold bg-opacity-20 text-gray">
                                            {FISTPAGE?.activeUsers ?? '-'}
                                        </div>
                                        <div className="w-1/2 py-2 leading-3 text-left text-xtiny bg-opacity-20 text-gray">
                                            {FISTPAGE?.path ?? '-'}
                                        </div>
                                    </div>
                                    <div className="flex border-b border-gray">
                                        <div className="w-1/2 px-2 py-2 leading-3 text-left text-xtiny font-allerbold bg-gray bg-opacity-20 text-gray">
                                            {SECONDPAGE?.activeUsers ?? '-'}
                                        </div>
                                        <div className="w-1/2 py-2 leading-3 text-left text-xtiny bg-gray bg-opacity-20 text-gray">
                                            {SECONDPAGE?.path ?? '-'}
                                        </div>
                                    </div>
                                </div>
                            </CardArticle>
                            <CardArticle
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${ModuleApp.ANALYTICAL_REPORTS}-first--three-ages`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                classCard="card__medium card__double-two"
                            >
                                <CustomBarChart data={firstThreeAges} />
                            </CardArticle>
                        </section>
                    </div>
                </section>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.WEBSITE, history, getRoute(Routes.ACCOUNTING_REPORTS_MENU), {
                    name: getRouteName(Routes.ACCOUNTING_REPORTS_MENU),
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};

export default WebsiteDashboard;
