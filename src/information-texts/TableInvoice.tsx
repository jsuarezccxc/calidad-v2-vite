import React from 'react';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export const TABLE_TOOLTIPS = {
    SKU: {
        title: 'SKU/Código - Producto/servicio',
        description: 'es el código único de identificación y el nombre de sus productos/servicios.',
    },
    DESCRIPTION: {
        title: 'Descripción',
        description: 'información adicional para la venta del producto/servicio.',
    },
    WAREHOUSE: {
        title: 'Bodega',
        description: 'es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
    },
    BATCH: {
        title: 'Lote',
        description: 'es la identificación del lote del producto.',
    },
    DATE: {
        title: 'Fecha de vencimiento',
        description: 'es la fecha de expiración de su producto.',
    },
    QUANTITY: (isSupport = false): { title: string; description: string } => ({
        title: 'Cantidad',
        description: `es la cantidad del producto ${isSupport ? 'comprada a su proveedor' : 'vendida a su cliente'}.`,
    }),
    UNIT_MEASUREMENT: {
        title: 'Unidad de medida',
        description: 'es la magnitud con la que se mide su producto/servicio.',
    },
    UNIT_VALUE: {
        title: 'Valor unitario',
        description: 'es el precio de venta de una unidad de la referencia del producto.',
    },
    PERCENTAGE_DISCOUNT: {
        title: 'Porcentaje de descuento',
        description: 'es el porcentaje del valor venta que se disminuye al producto/servicio.',
    },
    DISCOUNT: {
        title: 'Descuento',
        description: 'es el resultado de la siguiente operación (valor venta * Porcentaje descuento)',
    },
    TAXES: {
        title: 'Impuestos',
        description: (
            <>
                obligaciones tributarias que la persona o empresa deben pagar al estado. <br />
                Para saber mas sobre impuestos haga click aca: &nbsp;
                <Link
                    id={generateId({
                        module: ModuleApp.OTHERS,
                        submodule: `more-taxes`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.LNK,
                    })}
                    download
                    target="_blank"
                    text="Ver más..."
                    linkColor={LinkColor.PURPLE}
                    classes="underline text-sm"
                    href="https://www.dian.gov.co/Paginas/Vencimientos-tributarios-marzo-2024.aspx"
                />
            </>
        ),
    },
    MANDATE: {
        title: 'Tercero',
        description:
            'nombre del tercero o proveedor cuyos productos/servicios usted vende a su nombre bajo la modalidad de mandato.',
    },
};

export const BODY_TOOLTIP = ({ title, description }: { title: string; description: string | JSX.Element }): JSX.Element => (
    <div className="flex justify-start items-start gap-x-2.5">
        <Icon name="infoBlue" />
        <p className="text-sm text-blue leading-16.95px font-aller" style={{ width: '16.3125rem' }}>
            <span className="font-allerbold">{title}:</span> {description}
        </p>
    </div>
);

export const DETAILS_INVOICE = {
    DESCRIPTION_TABLE:
        'La información puede ser editada ubicándose en el campo requerido. Si necesita eliminar un producto o servicio, selecciónelo en las casillas ubicadas al lado izquierdo de la tabla y utilice el ícono de la caneca.',
    NOT_ELEMENTS:
        'Hasta el momento no ha agregado productos/servicios, haga click sobre la opción +Agregar producto/servicio para agregar uno.',
    REDIRECT_TEXT: (url: string): JSX.Element => (
        <>
            Si no ha agregado un producto/servicio a su catálogo, &nbsp;
            <Link
                id={generateId({
                    module: ModuleApp.SUPPORT_DOCUMENT,
                    submodule: `${ModuleApp.TABLE}-invoice-product-service-catalog`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.LNK,
                })}
                text="haga click aquí."
                linkColor={LinkColor.PURPLE}
                classes="underline xs:text-sm md:text-base text-gray-dark"
                href={url}
            />
        </>
    ),
};
