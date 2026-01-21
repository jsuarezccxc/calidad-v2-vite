import React from 'react';
import { Icon } from '@components/icon';
import { COMPANY_NAME } from '@constants/Company';
import { ElementOption } from '@models/WebsiteNode';

export const INFORMATION = {
    DESIGN: <p>Para crear su diseño del sitio web, seleccione alguna de las siguientes opciones:</p>,
    DRAFTS: (
        <p>
            En el sitio web puede guardar múltiples borradores de su diseño. Una vez desee publicarlo seleccione el diseño final y
            oprima Publicar. Únicamente puede publicar un diseño a la vez.
        </p>
    ),
    EDIT_WEBSITE: (
        <>
            Agregue todas páginas que desee haciendo click en &nbsp;
            <Icon className="inline" name="addPage" /> . Para titular o cambiar el nombre, duplicar o eliminar la página haga
            click en
            <svg className="inline" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.5" cy="3.5" r="1.5" fill="#0B2C4C" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="#0B2C4C" />
                <circle cx="8.5" cy="13.5" r="1.5" fill="#0B2C4C" />
            </svg>
            y seleccione la opción que necesite. Haga click sobre la página para empezar el diseño, edite el diseño en la versión
            escritorio o en la versión móvil. Para modificar el orden en que se visualizan las páginas arrastre cada página
            manteniéndola oprimida.
        </>
    ),
    SIDEBAR: (
        <>
            <h2 className="flex items-center mb-1">
                <span className="sidebar__information-title">Diseño</span>
            </h2>
            <p className="sidebar__information-text">
                Diseñe su sitio web utilizando los elementos básicos, compuestos o las plantillas prediseñadas que se encuentran
                en los siguientes menús desplegables. Para agregar la plantilla en cada página selecciónela haciendo click sobre
                ella y esta será colocada en el espacio de trabajo automáticamente. Para agregar los elementos selecciónelos de
                uno en uno, haciendo click sobre ellos y arrastrándolos hasta el espacio de trabajo en el lugar de su preferencia.
            </p>
        </>
    ),
    DELETE_FOOTER: (
        <p>
            De acuerdo con el <span className="text-purple">Artículo 2.2.2.25.3.1</span> del
            <span className="text-purple"> Decreto único reglamentario 1074 de 2015</span>, las políticas de tratamiento de datos
            personales deberán constar en medio electrónico. <br />
            <br /> Por lo que se recomienda mantener estás políticas de manera visible en su página web. En caso de eliminarlas,
            {COMPANY_NAME} Colombia S.A.S. se exime de cualquier tipo de responsabilidad. <br />
            <br /> ¿Confirma la eliminación del pie de página?
        </p>
    ),
    BUTTON_MODAL:
        'Este elemento cuenta con botones de selección. Para cada botón asigne al menos una opción de contenido. Agregue titulo, imagen y descripción para cada opción de contenido. Para eliminar un contenido selecciónelo y haga click en el ícono de papelera.',
    MOBILE_INFORMATION:
        'Estamos trabajando en la versión móvil, acceda desde un computador para mayor facilidad en la creación de su sitio web.',

    MODAL_FIVE_CAROUSEL: (
        <p>
            Seleccione las categorías que desea incluir. En esta plantilla puede agregar hasta 10 imágenes; para agregar una
            imagen adicional, haga clic sobre el botón
            <span className="font-allerbold"> +Agregar imagen,</span> si desea eliminarlo selecciónelo y haga clic en el ícono
            <span className="font-allerbold"> papelera.</span> papelera. Para esta plantilla es recomendable que las imágenes sean
            verticales, si agrega una imagen horizontal se adaptará al tamaño de acuerdo a la plantilla.
        </p>
    ),
};

export const DISCOUNT_IMAGE =
    '* Por defecto se muestra la imagen que seleccionó como imagen principal desde armar productos/servicios.';

export const DISCOUNT: { [key: string]: JSX.Element } = {
    [ElementOption.One]: (
        <>
            Seleccione los productos/servicios a los que desea agregarles un descuento. En este elemento puede agregar hasta 4
            productos/servicios; para agregar un producto adicional, haga click en el botón{' '}
            <span className="font-allerbold">+Seleccionar producto/servicio,</span> si desea eliminarlo selecciónelo y haga click
            en el ícono <span className="block font-allerbold">papelera.</span> Para agregar un descuento en la casilla Descuento
            agregue el valor en porcentaje de descuento del producto/servicio.
        </>
    ),
    [ElementOption.Two]: (
        <>
            Seleccione el producto/servicio al que desea agregarle un descuento. Para agregar un descuento en la casilla Descuento
            agregue el valor en porcentaje de descuento del producto/ servicio.
        </>
    ),
    [ElementOption.Three]: (
        <>
            Seleccione los productos/servicios a los que desea agregarles un descuento. En este elemento puede agregar hasta 3
            productos/servicios; para agregar un producto adicional, haga click en el botón{' '}
            <span className="font-allerbold">+Seleccionar producto/servicio,</span> si desea eliminarlo selecciónelo y haga click
            en el ícono <span className="block font-allerbold">papelera.</span> Para agregar un descuento en la casilla Descuento
            agregue el valor en porcentaje de descuento del producto/servicio.
        </>
    ),
    [ElementOption.Four]: (
        <>
            Seleccione los productos/servicios a los que desea agregarles un descuento. En este elemento puede agregar hasta 2
            productos/servicios; para agregar un producto adicional, haga click en el botón{' '}
            <span className="font-allerbold">+Seleccionar producto/servicio,</span> si desea eliminarlo selecciónelo y haga click
            en el ícono <span className="block font-allerbold">papelera.</span> Para agregar un descuento en la casilla Descuento
            agregue el valor en porcentaje de descuento del producto/servicio.
        </>
    ),
};
