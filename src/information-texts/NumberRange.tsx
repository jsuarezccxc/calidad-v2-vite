import React from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { Link, LinkColor } from '@components/button';
import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';

export const NUMBER_RANGE = (
    anchorlEl: HTMLElement | null,
    toggle: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
): IGenericRecord => ({
    PAGE_CONTENT: 'Documentos electrónicos',
    TITLE: MODULE_TITLES.INVOICE,
    SUBTITLE: getRouteName(Routes.NUMBER_RANGE),
    DESCRIPTION: (
        <React.Fragment>
            <p onClick={toggle} className="w-full mb-2 whitespace-normal cursor-pointer lg:w-max">
                <span className="flex flex-row items-center gap-2 text-base underline text-purple">
                    <Icon name="lightPurple" classIcon="w-5.5 h-5.5 inline" />
                    ¿Para qué son los rangos de numeración?
                </span>
                <Tooltip
                    anchorEl={anchorlEl}
                    iconName="lightBlue"
                    description={
                        <p className="text-sm leading-5 font-aller">
                            Esta información es necesaria porque le permite asignar e identificar cada documento electrónico. Al
                            contar con los rangos de numeración mantendrá un orden para la generación del documento.
                        </p>
                    }
                    wrapperClassName="rounded"
                />
            </p>
            <p className="text-base font-normal leading-5 font-aller text-gray-dark mb-4.5">
                Agregue y consulte la información de rangos de numeración de sus documentos electrónicos.
            </p>
        </React.Fragment>
    ),
});

export const TABS_PARAGRAPH: { [key: string]: JSX.Element } = {
    INVOICE: (
        <>
            <p className="mb-4.5">Los rangos de numeración son intervalos de números asignados para identificar cada factura.</p>
            <p className="mb-4.5">
                Haga click en el botón Sincronizar para que <span className="font-allerbold">{PRODUCT_NAME}</span> traiga la
                información de los rangos de numeración que autorizó previamente en el portal de la DIAN. Cada vez que autorice
                una nueva resolución en la DIAN debe sincronizar la información.
            </p>
            <p>
                Para ver las instrucciones de cómo sincronizar rangos para la &nbsp;
                <span className="font-allerbold">Factura electrónica de venta</span> haga &nbsp;
                <Link
                    text="click aquí."
                    classes="text-base"
                    linkColor={LinkColor.PURPLE}
                    href={`${getRoute(Routes.DOCS_INSTRUCTIONS)}?doc=electronic-invoice&menu=menu`}
                />
            </p>
            <p className="mb-4.5">
                Para ver las instrucciones de cómo sincronizar rangos para la &nbsp;
                <span className="font-allerbold">Factura talonario o papel</span> haga &nbsp;
                <Link
                    classes="text-base"
                    href={`${getRoute(Routes.DOCS_INSTRUCTIONS)}?doc=contingency-invoice&menu=menu`}
                    text="click aquí."
                    linkColor={LinkColor.PURPLE}
                />
            </p>
            <p>
                En caso de un error a la hora de asignar los prefijos, comuníquese con nuestro equipo haciendo &nbsp;
                <Link
                    classes="text-base"
                    href={`${getRoute(Routes.HELP_CENTER)}?name=contact`}
                    text="click aquí."
                    linkColor={LinkColor.PURPLE}
                />
            </p>
        </>
    ),
    SUPPORTING_DOCUMENT: (
        <>
            <p className="mb-4.5">
                Los rangos de numeración son intervalos de números asignados para identificar cada documento soporte.
            </p>
            <p className="mb-4.5">
                Haga click en el botón Sincronizar para que <span className="font-allerbold">{PRODUCT_NAME}</span> traiga la
                información de los rangos de numeración que autorizó previamente en el portal de la DIAN. Cada vez que autorice
                una nueva resolución en la DIAN debe sincronizar la información.
            </p>
            <p className="mb-4.5">
                Para ver las instrucciones de cómo habilitar rangos para el &nbsp;
                <span className="font-allerbold">Documento soporte</span> haga &nbsp;
                <Link
                    classes="text-base"
                    href={`${getRoute(Routes.DOCS_INSTRUCTIONS)}?doc=support-document&menu=menu`}
                    text="click aquí."
                    linkColor={LinkColor.PURPLE}
                />
            </p>
            <p>
                En caso de un error a la hora de asignar los prefijos, comuníquese con nuestro equipo haciendo &nbsp;
                <Link
                    classes="text-base"
                    href={`${getRoute(Routes.HELP_CENTER)}?name=contact`}
                    text="click aquí."
                    linkColor={LinkColor.PURPLE}
                />
            </p>
        </>
    ),
};
