import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { MONTH_NAMES } from '@constants/DashboardElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';

import { IAnnualIncome, IDataLineChart } from '@models/DashboardElectronicDocuments';

import { RootState } from '@redux/rootReducer';
import { getDataDashboard } from '@redux/dashboard-electronic-documents/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getOnboardingInformation, updateOnboardingFinalModal } from '@redux/onboarding/action';

import { formatNumber } from '@utils/Number';
import { buttonsFooterProps } from '@utils/Button';
import { getDateForMonth, getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

import { ZERO_PERCENTAGE } from '@pages/website-dashboard';
import { INFORMATION_PAGE } from '@information-texts/DashboardElectronicDocuments';

import { Form } from '@components/form';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { Information } from '@components/information';
import { DatePickerMonthInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Onboarding } from '@components/onboarding';
import { COMPLETION_MODAL_CONTENT } from '@constants/Onboarding';
import useOnboardingCore from '@hooks/useOnboardingCore';
import useModalController from '@hooks/useModalController';
import { ColorCard, ContentCard, SimpleCard, LittleCard, LineChart } from './components';

import { KeysColorCard, keysLittleCard, UTILS } from '.';
import './DashboardElectronicDocuments.scss';

const DashboardElectronicDocuments: React.FC = () => {
    const [history, dispatch] = [useHistory(), useDispatch()];

    const { user } = useSelector((state: RootState) => state.session);
    const { information } = useSelector((state: RootState) => state.company);
    const { is_unlimited, ...data } = useSelector((state: RootState) => state.dashboardElectronicDocument.data);
    const onboarding = useSelector(({ onboarding }: RootState) => onboarding.onboardingData?.electronic_documents);

    const [date, setDate] = useState<Date>(new Date());

    const { isModalOpen, toggleModal } = useModalController();
    const { hasFinishedAllSteps, incompleteSteps, isNearFinalStep, isOnboardingVisible, toggleOnboarding } = useOnboardingCore(
        onboarding
    );

    const creationDate = useMemo(() => Number(information?.created_at), [information]);

    const dataLineChart: IDataLineChart[] = useMemo(() => {
        return Object.keys(MONTH_NAMES).flatMap(key => {
            const value = data.annual_income[key as keyof IAnnualIncome];
            if (value) {
                return {
                    month: MONTH_NAMES[key],
                    value,
                };
            }
            return [];
        });
    }, [data]);

    const handleDashboard = async (date: string): Promise<void> => {
        await dispatch(getDataDashboard(date));
    };

    useEffect(() => {
        dispatch(getOnboardingInformation());
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        handleDashboard(getDateFromUnix(getUnixFromDate(date), 'YYYY-MM').dateFormat);
    }, [date]);

    useEffect(() => {
        if (hasFinishedAllSteps) toggleModal();
    }, [hasFinishedAllSteps]);

    return (
        <>
            <div className="dashboard-electronic-documents">
                {onboarding.percentage != ZERO_PERCENTAGE ? (
                    <PageTitle title={INFORMATION_PAGE.TITLE} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
                ) : (
                    <p className="mt-12 text-26lg mb-7 text-blue">
                        ¡Bienvenido/a, <br />
                        {user?.name}!
                    </p>
                )}
                {isOnboardingVisible && (
                    <Onboarding
                        module={onboarding.module}
                        percentage={onboarding.percentage}
                        steps={incompleteSteps}
                        setToggleOnboarding={toggleOnboarding}
                        isNearFinalStep={isNearFinalStep}
                    />
                )}

                {isNearFinalStep && (
                    <>
                        <Information title={INFORMATION_PAGE.SUB_TITLE_1} color="blue" />
                        <div className="content-top-card">
                            {UTILS.SIMPLE_CARDS.map((props, key) => (
                                <SimpleCard {...props} key={key} />
                            ))}
                        </div>
                        <div className="content-bottom-card">
                            <Form className="content-bottom-card__form">
                                <label>{INFORMATION_PAGE.SUB_TITLE_2}</label>
                                <DatePickerMonthInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `dashboard-month-report`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    onChangeDate={(date): void => setDate(date)}
                                    classesWrapper="xs:w-full w-30.6 h-6.75"
                                    classesInput="capitalize padding-0"
                                    selected={getUnixFromDate(date)}
                                    selectIconType="arrowDownGray"
                                    secondIcon="calendarGray"
                                    minDate={new Date(getDateForMonth(creationDate))}
                                />
                            </Form>
                            <div className="content-bottom-card__left-cards">
                                <div className="flex flex-col gap-y-2">
                                    {UTILS.LEFT_CARDS.map(({ field, ...props }, index) => (
                                        <ColorCard
                                            {...props}
                                            key={index}
                                            number={formatNumber(
                                                field === UTILS.PERCENTAGE
                                                    ? data.percentage_sales / 100
                                                    : data[field as KeysColorCard],
                                                props.optionsIntl
                                            )}
                                        />
                                    ))}
                                </div>
                                <ContentCard
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `dashboard-month-income`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.CRD,
                                    })}
                                    className="content-bottom-card__center-card"
                                    classNameContent="xs:overflow-y-auto"
                                    title="Ingresos por mes"
                                >
                                    <LineChart data={dataLineChart} />
                                </ContentCard>
                                <div className="content-bottom-card__right-cards">
                                    <ContentCard
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `dashboard-number-electronic-documents-generated`,
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.CRD,
                                        })}
                                        className="content-bottom-card__right-cards--content-little-card"
                                        classNameContent="content-bottom-card__right-cards--little-card"
                                        title="Número de documentos generados"
                                    >
                                        {UTILS.RIGHT_CARDS.map(({ field, ...props }, index) => (
                                            <LittleCard
                                                {...props}
                                                key={index}
                                                number={data.electronic_document_counting[field as keysLittleCard] || 0}
                                            />
                                        ))}
                                    </ContentCard>
                                    <LittleCard
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `dashboard-document-available`,
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.CRD,
                                        })}
                                        number={data.document_available}
                                        className="h-8 py-1 text-white bg-blue"
                                        title={`Documentos ${is_unlimited ? 'ilimitados' : 'disponibles'}`}
                                        isUnlimited={is_unlimited}
                                    />
                                    <p className="text-gray-dark text-tiny leading-xs">
                                        {INFORMATION_PAGE.LINK(UTILS.ROUTE_SALE)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, UTILS.NEXT_PAGE, {
                        moduleName: '',
                        name: '',
                    })}
                    className="lg:mt-auto"
                />
                {isModalOpen && !onboarding?.status_modal_electronic && (
                    <SharedModal
                        moduleId={`${ModuleApp.ELECTRONIC_DOCUMENTS}-dashboard-complete-onboarding`}
                        text={COMPLETION_MODAL_CONTENT}
                        finalAction={(): void => {
                            dispatch(updateOnboardingFinalModal());
                            toggleModal();
                        }}
                        open
                    />
                )}
            </div>
        </>
    );
};

export default DashboardElectronicDocuments;
