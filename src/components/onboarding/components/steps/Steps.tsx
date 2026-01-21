import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import success from '@assets/images/success.svg';
import { Source, SOURCE } from '@constants/Onboarding';
import { Routes } from '@constants/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute } from '@utils/Paths';
import { IStepsOnboarding, iconsMapOnboarding } from '.';
import './Steps.scss';

export const Steps: React.FC<IStepsOnboarding> = ({
    id,
    classes,
    inactive = false,
    step,
    subSteps = [],
    action,
    icon,
    route,
    completed,
}) => {
    const [iconSrc, setIconSrc] = useState(iconsMapOnboarding[icon] || '');

    useEffect(() => {
        setIconSrc(iconsMapOnboarding[icon]);
    }, [icon]);

    const handleRouteAction = (route: string): void => {
        if (route === getRoute(Routes.PRODUCT_DATABASE)) {
            localStorage.setItem(
                SOURCE,
                window.location.pathname === getRoute(Routes.WEBSITE_DASHBOARD) ? Source.Website : Source.ElectronicDocuments
            );
        }
    };

    return (
        <>
            {!completed && (
                <>
                    {lengthGreaterThanZero(subSteps) ? (
                        <div id={id} className={`steps ${classes}`}>
                            <div className="flex flex-col w-full">
                                <div className="flex gap-4.5 steps__substeps">
                                    <img className="steps__icon-width--step" src={iconSrc} alt={icon} />
                                    <p className="steps__title">{step}</p>
                                </div>

                                {subSteps.map(({ action, completedSubStep, route, step }, index) => (
                                    <div key={index} id={id + index} className="steps__substeps-container">
                                        <p className="steps__substeps-title">{step}</p>
                                        {completedSubStep ? (
                                            <img src={success} className="steps__icon-completed" alt="Success" />
                                        ) : (
                                            <NavLink className="steps__button-active" to={route}>
                                                {action}
                                            </NavLink>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div id={id} className={`steps ${classes}`}>
                            <div className="flex gap-4.5">
                                <img className="steps__icon-width--step" src={iconSrc} alt={icon} />
                                <p className="steps__title">{step}</p>
                            </div>
                            {inactive ? (
                                <span className="steps__button-inactive">{action}</span>
                            ) : (
                                <NavLink
                                    className="steps__button-active"
                                    to={route}
                                    onClick={(): void => handleRouteAction(route)}
                                >
                                    {action}
                                </NavLink>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
