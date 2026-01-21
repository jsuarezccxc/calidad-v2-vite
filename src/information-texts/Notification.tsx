import React from 'react';
import { Link, LinkColor } from '@components/button';
import { getRoute, getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRouteKey, getTranslationKey } from '@utils/Translation';
import { PRODUCT_NAME } from '@constants/ProductName';

export const NOTIFICATION_INFORMATION = (translate: (key: string) => string, translationKey: string): IGenericRecord => {
    const getText = (textKey: string): string => translate(getTranslationKey(translationKey, textKey));

    return {
        COMPANY_PROFILE: (
            <>
                <p className="mb-4 text-gray-dark ">{getText('company-profile.main-description')}.</p>
                <p className="mb-4 text-gray-dark ">{getText('company-profile.secondary-description')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">{getText('notification-explanation')}: &nbsp;</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">1. {getText('company-profile.notification-one')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">
                    2. {getText('company-profile.notification-two')}. &nbsp;
                    <span className="text-blue">*{getText('optional-verification')}.</span>
                </p>
                {getDescriptionKeys({ initial: 3, final: 20 }).map(({ key, index }) => (
                    <p key={key} className="flex flex-wrap mb-4 text-gray-dark">
                        {index}. {getText(`company-profile.notification-${key}`)}.
                    </p>
                ))}
            </>
        ),
        WEBSITE_DESIGN: (
            <>
                <p className="mb-4 text-gray-dark ">{getText('website-design.main-description')}.</p>
                <p className="mb-4 text-gray-dark ">{getText('website-design.secondary-description')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">{getText('notification-explanation')}: &nbsp;</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">1. {getText('website-design.notification-one')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">2. {getText('website-design.notification-two')}.</p>
                <p className="mb-4 text-gray-dark">
                    3. {getText('website-design.notification-three')}.
                    <span className="text-blue">&nbsp; **{getText('active-notification')}</span>
                </p>
                <p className="flex flex-wrap mb-4 text-gray-dark">4. {getText('website-design.notification-four')}.</p>
            </>
        ),
        INVENTORY_CONTROL: (
            <>
                <p className="mb-4 text-gray-dark ">{getText('inventory-control.main-description')}.</p>
                <p className="mb-4 text-gray-dark">{getText('inventory-control.secondary-description')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">{getText('notification-explanation')}: &nbsp;</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">1. {getText('inventory-control.notification-one')}.</p>
                <p className="mb-4 text-gray-dark">2. {getText('inventory-control.notification-two')}.</p>
            </>
        ),
        ELECTRONIC_INVOICE: (
            <>
                <p className="mb-4 text-gray-dark">{getText('electronic-invoice.main-description')}.</p>
                <p className="mb-4 text-gray-dark">{getText('electronic-invoice.secondary-description')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">{getText('notification-explanation')}: &nbsp;</p>
                {getDescriptionKeys({ initial: 1, final: 4 }).map(({ key, index }) => (
                    <p key={key} className="flex flex-wrap mb-4 text-gray-dark">
                        {index}. {getText(`electronic-invoice.notification-${key}`)}.
                    </p>
                ))}
            </>
        ),

        SUPPORT_DOCUMENT: (
            <>
                <p className="mb-4 text-gray-dark">{getText('support-document.main-description')}.</p>
                <p className="mb-4 text-gray-dark">{getText('support-document.secondary-description')}.</p>
                <p className="flex flex-wrap mb-4 text-gray-dark">{getText('notification-explanation')}: &nbsp;</p>
                <p className="mb-4 text-gray-dark">
                    1. Genera notificación que le informa al empresario que el documento electrónico se ha enviado a la DIAN y
                    está pendiente por verificar.
                </p>
                <p className="mb-4 text-gray-dark">
                    2. Genera notificación que le informa al empresario que la DIAN ya revisó el documento electrónico y fue
                    aceptado o rechazado, en caso de ser rechazado realice las correcciones pertinentes.
                </p>
                <p className="mb-4 text-gray-dark">
                    3. Genera notificación que le informa al empresario que le quedan 10 documentos soporte disponibles.
                </p>
                <p className="mb-4 text-gray-dark">
                    4. Genera notificación que le informa al empresario que su resolución está próxima a vencerse (10 días) y debe
                    generar una nueva resolución en la DIAN. Si requiere que <span className="font-allerbold">diggi pymes</span>{' '}
                    lo notifique cuando le quede una cantidad diferente de días antes del vencimiento de una resolución de
                    numeración, edítelo en la siguiente tabla y haga click en Guardar.
                </p>
                <p className="mb-4 text-gray-dark">
                    5. Genera notificación que le informa al empresario que le queda 10 consecutivos de documentos soporte
                    autorizados en la DIAN por resolución.**Si requiere que <span className="font-allerbold">diggi pymes</span> lo
                    notifique cuando le quede una cantidad diferente de consecutivos de documentos soporte, edítelo en la
                    siguiente tabla y haga click en Guardar.
                </p>
            </>
        ),
        ELECTRONIC_INVOICE_CONSECUTIVE: (
            <>
                <p className="mb-4 text-gray-dark">
                    5. Genera notificación que le informa al empresario que su resolución está próxima a vencerse (10 días) y debe
                    generar una nueva resolución en la DIAN. Si requiere que <span className="font-allerbold">diggi pymes </span>
                    lo notifique cuando le quede una cantidad diferente de días antes del vencimiento de una resolución de
                    numeración, edítelo en la siguiente tabla y haga click en Guardar.
                </p>
                <p className="mb-4 text-gray-dark">
                    6. Genera notificación que le informa al empresario que le quedan 10 facturas disponibles.
                </p>
                <p className="mb-4 text-gray-dark">
                    7. Genera notificación que le informa al empresario que le queda 10 consecutivos de facturas electrónicas
                    autorizadas en la DIAN por resolución.**Si requiere que <span className="font-allerbold">diggi pymes </span>lo
                    notifique cuando le quede una cantidad diferente de consecutivos de facturas electrónicas, edítelo en la
                    siguiente tabla y haga click en Guardar.
                </p>
            </>
        ),
        BUYING_AND_SELLING: (
            <>
                <p className="mb-4 text-gray-dark">{getText('buying-and-selling.main-description')}.</p>
                <p className="mb-4 text-gray-dark">{getText('buying-and-selling.secondary-description')}:</p>
                <p className="mb-4 text-gray-dark">1. {getText('buying-and-selling.notification-one')}.</p>
                <p className="mb-4 text-gray-dark">2. {getText('buying-and-selling.notification-two')}.</p>
            </>
        ),
    };
};

export const NOTIFICATION_DESCRIPTIONS = (translate: (key: string) => string, translationKey: string): IGenericRecord => {
    const getDescription = (key: string): string => translate(getTranslationKey(translationKey, key));

    return {
        VOUCHER: (
            <>
                {getDescription('payment-proof-supplement')}, {PRODUCT_NAME} {getDescription('payment-proof-benefits')}.
            </>
        ),
        SELECTED_OPTION: (
            <>
                {getDescription('affirmative-answer')}, {PRODUCT_NAME} {getDescription('accreditation-deadline')}.
            </>
        ),
    };
};

const validateHref = (module: string): string => {
    if (module === getRouteName(Routes.HOME)) return getRoute(Routes.NOTIFICATION_CENTER);
    if (module === getRouteName(Routes.ELECTRONIC_INVOICE)) return getRoute(Routes.HOME);
    if (module === getRouteName(Routes.HOME)) return getRoute(Routes.DAILY_NOTIFICATIONS_BUYING_SELLING_PROCESS);
    if (module === getRouteName(Routes.SUPPORT_DOCUMENT_MENU)) return getRoute(Routes.HOME);

    return getRoute(Routes.HOME);
};

export const SEND_EMAIL_TEXT = (module: string, { translate, translationKey }: IGenericRecord): JSX.Element => {
    const routeIndex: { [route: string]: number } = {
        [getRouteName(Routes.HOME)]: Routes.NOTIFICATION_CENTER,
        [getRouteName(Routes.HOME)]: Routes.DAILY_NOTIFICATIONS_BUYING_SELLING_PROCESS,
    };

    const getLinkText = (): string => {
        const translateKey = getRouteKey(routeIndex[module] || Routes.HOME);
        return translate(translateKey).toLowerCase();
    };

    const getText = (key: string): string => translate(`${translationKey}.${key}`);

    return (
        <>
            <p className="mb-4 text-gray-dark">
                {getText('sending-notifications')} &nbsp;
                <Link classes="text-base" text={getLinkText()} href={validateHref(module)} linkColor={LinkColor.PURPLE} />
                &nbsp; {getText('screen-access')} &nbsp;{module}. {getText('mail-notifications')}.
            </p>
            <p className="mb-4 font-bold text-allerbold text-gray-dark">{getText('subscription')}</p>
        </>
    );
};

/**
 * Returns the description keys
 *
 * @param { initial, final }: { initial: number; final: number } - Limits of the description keys
 * @returns IGenericRecord[]
 */
const getDescriptionKeys = ({ initial, final }: { initial: number; final: number }): IGenericRecord[] => {
    return DESCRIPTION_KEYS.slice(initial - 1, final);
};

/**
 * Key list used to the descriptions
 */
const DESCRIPTION_KEYS = [
    {
        index: 1,
        key: 'one',
    },
    {
        index: 2,
        key: 'two',
    },
    {
        index: 3,
        key: 'three',
    },
    {
        index: 4,
        key: 'four',
    },
    {
        index: 5,
        key: 'five',
    },
    {
        index: 6,
        key: 'six',
    },
    {
        index: 7,
        key: 'seven',
    },
    {
        index: 8,
        key: 'eight',
    },
    {
        index: 9,
        key: 'nine',
    },
    {
        index: 10,
        key: 'ten',
    },
    {
        index: 11,
        key: 'eleven',
    },
    {
        index: 12,
        key: 'twelve',
    },
    {
        index: 13,
        key: 'thirteen',
    },
    {
        index: 14,
        key: 'fourteen',
    },
    {
        index: 15,
        key: 'fifteen',
    },
    {
        index: 16,
        key: 'sixteen',
    },
    {
        index: 17,
        key: 'seventeen',
    },
    {
        index: 18,
        key: 'eighteen',
    },
    {
        index: 19,
        key: 'nineteen',
    },
    {
        index: 20,
        key: 'twenty',
    },
];
