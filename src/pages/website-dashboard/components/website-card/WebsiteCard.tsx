import React from 'react';
import { Icon } from '@components/icon';
import { Routes } from '@constants/Paths';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import websiteImage from '@assets/images/website-preview.svg';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ButtonIcon, IWebsiteCardProps, StateWebsite } from '..';
import './WebsiteCard.scss';

export const WebsiteCard: React.FC<IWebsiteCardProps> = ({ plan, website, domain, handleRedirect }) => {
    const { disabledInputs } = usePermissions();
    return (
        <div className="website-card">
            <div className="website-card__content--right">
                <div className="website__preview" style={{ backgroundImage: `url(${websiteImage})` }} />
            </div>
            <div className="website-card__content--left">
                <div className="details__top">
                    <div className="tag-plan">{plan?.toUpperCase()}</div>
                </div>
                <div className="details__middle">
                    <div className="domain-information">
                        <label className="domain-information--title">
                            Dominio: <span className="domain-information--domain">{domain}</span>
                        </label>
                    </div>
                    <div className="state-domain">
                        <Icon
                            name={!website?.is_draft ? 'successMulticolor' : 'alertMulticolor'}
                            className="state-domain--icon"
                        />
                        <span className="state-domain--state">
                            {website?.is_draft ? StateWebsite.PUBLISHED : StateWebsite.PENDING}
                        </span>
                    </div>
                </div>
                <div className="details__bottom">
                    <ButtonIcon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            action: ActionElementType.EDIT,
                            elementType: ElementType.BTN,
                        })}
                        iconName="editWhite"
                        className="button--blue"
                        classIcon="button--icon"
                        onClick={(): void => handleRedirect(Routes.WEBSITE_EDITOR)}
                    >
                        Armar sitio web
                    </ButtonIcon>
                    <ButtonIcon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        iconName="websiteWhite"
                        className="button--blue"
                        classIcon="button--icon"
                        onClick={(): void => handleRedirect(domain, true)}
                    >
                        Ir al sitio web
                    </ButtonIcon>
                    <ButtonIcon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            action: ActionElementType.UPGRADE,
                            elementType: ElementType.BTN,
                        })}
                        iconName="arrowUpCircleWhite"
                        className="button--purple"
                        classIcon="button--icon"
                        disabled={plan === WEBSITE_PLANS.PREMIUM_PLAN || disabledInputs}
                        {...(plan !== WEBSITE_PLANS.PREMIUM_PLAN && {
                            onClick: (): void => handleRedirect(Routes.PAYMENT_PLANS_MENU),
                        })}
                    >
                        Mejora tu plan
                    </ButtonIcon>
                </div>
            </div>
        </div>
    );
};
