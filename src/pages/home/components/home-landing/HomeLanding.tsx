/* A component that is used to display the home page of the application. */
import React from 'react';
import { useHistory } from 'react-router-dom';
import loginHomeLanding from '@assets/images/login-home-landing.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { lowerCase } from '@utils/Text';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { LandingHomeDiggipymes } from '../landing-home-diggipymes/LandingHomeDiggipymes';
import CardButton from './components/card-button/CardButton';
import { ICardButton } from './components/card-button';
import { cardButtonProps, IHomeLanding, InformationCardLandingProps } from '.';
import InformationCardLanding from './components/information-card-landing/InformationCardLanding';
import { IInformationCardLanding } from './components/information-card-landing';
import './HomeLanding.scss';

const HomeLanding: React.FC<IHomeLanding> = ({
    accessToken,
    toggleAccount,
    toggleLogin,
    modules,
    economicData,
    refreshEconomicIndicators,
    information,
    haveMembership,
}) => {
    const history = useHistory();

    return (
        <>
            {!accessToken && <LandingHomeDiggipymes toggleAccount={toggleAccount} toggleLogin={toggleLogin} />}
            {accessToken && (
                <div className="homeLanding__with-access">
                    <div className="homeLanding__with-access__header-button-main-container">
                        <div />
                        <div className="homeLanding__with-access__header-button-sub-container">
                            <Button
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: `tutorials`,
                                    action: ActionElementType.VIDEO,
                                    elementType: ElementType.BTN,
                                })}
                                background={'gray-light'}
                                classes="text-purple"
                                text="Video tutoriales"
                            />
                        </div>
                    </div>
                    <div className="homeLanding__with-access__middle-container">
                        <div />
                        <div className="flex flex-col">
                            <span className="italic text-blue text-2lg font-aller">{lowerCase(information?.logo_extension)}</span>
                            <img className="home__logo w-85.5 h-72 md:w-72" src={loginHomeLanding} alt={`${PRODUCT_NAME} Logo`} />
                        </div>
                        <div className="homeLanding__with-access__middle-container__button-cards-container">
                            {cardButtonProps(history, modules, haveMembership)?.map((cardProps: ICardButton, index: number) => (
                                <div key={index}>
                                    <CardButton {...cardProps} />
                                </div>
                            ))}
                        </div>
                        <div />
                    </div>
                    <div className="homeLanding__with-access__footer-container">
                        <div className="flex-col">
                            <div className="homeLanding__with-access__footer-container__cards-container">
                                {InformationCardLandingProps(economicData)?.map(
                                    (informationProps: IInformationCardLanding, index: number) => (
                                        <div key={index}>
                                            <InformationCardLanding {...informationProps} />
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex flex-row  justify-between xs:pb-4.5 ">
                                <div />
                                <div className="flex flex-row justify-end mt-2.5 text-center text-xtiny font-aller text-purple w-14">
                                    <span className="leading-xtiny">Refrescar indicadores</span>
                                    <Icon
                                        onClick={refreshEconomicIndicators}
                                        name="reloadPurple"
                                        className="pl-1 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeLanding;
