/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_INFORMATION } from '@information-texts/Home';
import { CardButtonText } from '@utils/Plans';
import { lengthGreaterThanZero } from '@utils/Length';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { getModulesMembership, setPlansToPay } from '@redux/membership/actions';
import { setCreateAccountModal } from '@redux/session/actions';
import { IconTitle } from '@components/page-title';
import { Button } from '@components/button';
import { IconsNames } from '@components/icon';
import { TITLE_PURCHASING_PROCESS } from '@constants/PaymentPlans';
import { IModulesMembership, ISubModules } from '@models/Membership';
import { IGenericRecord } from '@models/GenericRecord';
import { ORGANIZATION_PLANNING_MODULE_ID, ONE, SECOND, ZERO } from '@pages/home';
import { BigModulesMemberships, DetailsCrm, DetailsElectronicDocuments, DetailsWebsite, ModulesMemberships } from './components';
import {
    CRM_MODULE,
    DIGGITAL_SELLER_MODULE,
    ELECTRONIC_DOCUMENTS_MODULE,
    MODULE_ORDER_LANDING,
    ORGANIZATION_PLANNING,
    sortById,
    targetModuleWithoutSubmodulesNames,
    targetModuleWithSubmodulesNames,
    WEBSITE_MODULE,
} from '.';
import './MembershipsLanding.scss';

export const MembershipsLanding: React.FC = () => {
    const dispatch = useDispatch();

    const { modules } = useSelector(({ membership }: RootState) => ({
        ...membership,
    }));

    const [modulesWithSubmodules, setModulesWithSubmodules] = useState<IModulesMembership[]>();
    const [otherModules, setOtherModules] = useState<IGenericRecord[]>();
    const [selectedModules, setSelectedModules] = useState<Record<string, ISubModules>>({});

    const handleRadioChange = (moduleId: number, subModule: ISubModules): void => {
        setSelectedModules(prevState => {
            const filteredState = Object.entries(prevState).reduce<Record<number, ISubModules>>((acc, [key, value]) => {
                if (value.modules_id !== subModule.modules_id || value.modules_id === ZERO) {
                    acc[Number(key)] = value;
                }
                return acc;
            }, {});

            return {
                ...filteredState,
                [moduleId]: subModule,
            };
        });
    };

    useEffect(() => {
        dispatch(getModulesMembership());
    }, []);

    useEffect(() => {
        const moduleOrderLanding = sortById(modules || [], MODULE_ORDER_LANDING);
        if (lengthGreaterThanZero(moduleOrderLanding)) {
            setModulesWithSubmodules(
                moduleOrderLanding && moduleOrderLanding.filter(module => targetModuleWithSubmodulesNames.includes(module.name))
            );
            setOtherModules(
                moduleOrderLanding &&
                    moduleOrderLanding.filter(module => targetModuleWithoutSubmodulesNames.includes(module.name))
            );
        }
    }, [modules]);

    useEffect(() => {
        const selectedArray = Object.values(selectedModules);

        const relevantPlans = selectedArray.filter(module => module.id !== ONE);

        const planToAdd = otherModules?.find(plan => plan.id === ORGANIZATION_PLANNING_MODULE_ID);

        const hasPlanOrganization = !!selectedModules[ORGANIZATION_PLANNING_MODULE_ID];

        if (relevantPlans.length >= SECOND && planToAdd && !hasPlanOrganization) {
            setSelectedModules(prevState => ({
                ...prevState,
                [planToAdd.id]: {
                    ...planToAdd,
                    price_month: ZERO,
                    price_semester: ZERO,
                    price_semester_month: ZERO,
                    price_year: ZERO,
                },
            }));
        }
    }, [handleRadioChange]);

    const handleSubmitMemberships = (): void => {
        dispatch(setPlansToPay(selectedModules));
        dispatch(setCreateAccountModal());
    };

    return (
        <section className="memberships-section">
            <IconTitle
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'memberships-section-title',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                label={TITLE_PURCHASING_PROCESS}
                size="large"
                icon="purchasePlans"
                classContainer="mb-7 font-poppinsbold"
            />
            <p
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'memberships-section-paragraph-one',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="memberships-section__paragraph"
            >
                {HOME_INFORMATION.LANDING_PURCHASE_PARAGRAPH_ONE}
            </p>
            <div
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'memberships-section-paragraph-second',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="items-center justify-center text-center "
            >
                {HOME_INFORMATION.LANDING_PURCHASE_PARAGRAPH_SECOND}
            </div>
            <p
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'memberships-section-paragraph-third',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="memberships-section__paragraph"
            >
                {HOME_INFORMATION.LANDING_PURCHASE_PARAGRAPH_THIRD}
            </p>
            <div className="memberships-section__button-container">
                <Button
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'memberships-buy-now',
                        action: ActionElementType.SUBMIT,
                        elementType: ElementType.BTN,
                    })}
                    text={CardButtonText.BuyNow}
                    classes="memberships-section__button-container--button"
                    onClick={handleSubmitMemberships}
                    disabled={Object.keys(selectedModules).length === ZERO}
                />
            </div>

            {modulesWithSubmodules?.map((module: IModulesMembership) => {
                const nameIconMap: { [key: string]: { name: string | IGenericRecord; icon: IconsNames } } = {
                    [WEBSITE_MODULE]: {
                        name: (
                            <>
                                Sitio web y tienda <span className="text-gradient">diggi</span>tal
                            </>
                        ),
                        icon: 'iconWebsiteMulticolor',
                    },
                    [ELECTRONIC_DOCUMENTS_MODULE]: {
                        name: 'Documentos electrónicos',
                        icon: 'iconElectronicDocumentsMulticolor',
                    },
                };

                const { name, icon } = nameIconMap[module.name];

                return (
                    <div className="flex flex-col items-center justify-center" key={module.id}>
                        <div className="memberships-section__divider"></div>
                        <IconTitle
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `memberships-${
                                    module.name === WEBSITE_MODULE ? 'website' : 'electronic-documents'
                                }-title`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            label={name}
                            icon={icon}
                            classContainer="font-poppinsbold"
                        />
                        <div
                            className={`memberships-section__container ${
                                module.sub_modules && module.sub_modules.length < 5 && 'centered'
                            }`}
                        >
                            {module.sub_modules?.map(subModule => {
                                const modifiedSubModule: ISubModules = {
                                    ...subModule,
                                    isWebsite: module.name === WEBSITE_MODULE || module.name === DIGGITAL_SELLER_MODULE,
                                    withTooltip: module.name === ELECTRONIC_DOCUMENTS_MODULE,
                                };

                                return (
                                    <ModulesMemberships
                                        key={subModule.id}
                                        subModule={modifiedSubModule}
                                        handleRadioChange={(subModule: ISubModules) => handleRadioChange(subModule.id, subModule)}
                                        selectedModule={selectedModules[subModule.id]}
                                    />
                                );
                            })}
                        </div>

                        {module.name === ELECTRONIC_DOCUMENTS_MODULE ? (
                            <DetailsElectronicDocuments />
                        ) : (
                            <DetailsWebsite isWebsite />
                        )}
                    </div>
                );
            })}

            {otherModules?.map((otherModule: IGenericRecord) => {
                const nameDiggiGradient = (
                    <>
                        Vendedor <span className="text-gradient">diggi</span>tal
                    </>
                );

                const transformedModule = {
                    id: otherModule.id,
                    name: otherModule.name,
                    customName: otherModule.name === DIGGITAL_SELLER_MODULE ? nameDiggiGradient : otherModule.name,
                    price_year: otherModule.price_year ?? ZERO,
                    price_month: otherModule.price_month ?? ZERO,
                    price_semester: otherModule.price_semester ?? ZERO,
                    price_semester_month: otherModule.price_semester_month ?? ZERO,
                    base_price: otherModule.base_price,
                    discount: otherModule.discount,
                    total_discount: otherModule.discount,
                    modules_id: ZERO,
                    quantity: ONE,
                    price_maintenance_year: ZERO,
                    discountValue: String(ZERO),
                    isWebsite: true,
                };

                const labelMap: Record<string, string | JSX.Element> = {
                    [DIGGITAL_SELLER_MODULE]: nameDiggiGradient,
                    [ORGANIZATION_PLANNING]: ORGANIZATION_PLANNING,
                    [CRM_MODULE]: CRM_MODULE,
                };

                const iconMap: Record<string, IconsNames> = {
                    [DIGGITAL_SELLER_MODULE]: 'iconDiggitalSeller',
                    [ORGANIZATION_PLANNING]: 'iconOrganizationPlanningMulticolor',
                    [CRM_MODULE]: 'iconCrm',
                };

                return (
                    <div className="flex flex-col items-center justify-center memberships-section__module" key={otherModule.id}>
                        <div className="memberships-section__divider"></div>
                        <IconTitle
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `memberships-${otherModule.name}-title`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            label={labelMap[otherModule.name]}
                            icon={iconMap[otherModule.name]}
                            classContainer="font-poppinsbold"
                        />
                        <div className={`memberships-section__container`}>
                            {otherModule.name === DIGGITAL_SELLER_MODULE ? (
                                <ModulesMemberships
                                    key={otherModule.id}
                                    subModule={transformedModule}
                                    handleRadioChange={(subModule: ISubModules) => handleRadioChange(otherModule.id, subModule)}
                                    selectedModule={selectedModules[otherModule.id]}
                                />
                            ) : (
                                <BigModulesMemberships
                                    key={otherModule.id}
                                    subModule={transformedModule}
                                    handleRadioChange={(subModule: ISubModules) => handleRadioChange(otherModule.id, subModule)}
                                    selectedModule={selectedModules[otherModule.id]}
                                />
                            )}
                        </div>
                        {otherModule.name === CRM_MODULE && <DetailsCrm />}
                        {otherModule.name === DIGGITAL_SELLER_MODULE && <DetailsWebsite />}
                    </div>
                );
            })}
        </section>
    );
};
