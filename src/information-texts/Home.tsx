import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Icon } from '@components/icon';

export const HOME_INFORMATION = {
    MAIN_TEXT: (
        <>
            <p className="home-text xs:w-full xs:text-justify md:text-justify">
                <span className="text-green font-allerbold">{PRODUCT_NAME} </span>es el ERP que diggitaliza la gestión integral de
                su empresa.
                <br />
                <br />
                Con diggi pymes trabaja en forma eficiente aprovechando mejor su tiempo, disminuyendo costos, alcanzando más
                clientes y optimizando las ventas para mejorar su productividad y dedicarse a lo que realmente necesita.
            </p>
        </>
    ),
    TEXT_LANDING_MEMBERSHIP: (
        <>
            <p className="w-4/5 leading-6 font-poppins text-blue mt-3.5 xs:w-full xs:text-left xs:text-sm">
                <span className="text-green font-poppinsbold">{PRODUCT_NAME} </span>incluye
                <span className="font-poppinsbold text-purple"> GRATIS </span>Calendario, Perfil de empresa, Notificaciones,
                Control interno y Reportes analíticos que se construyen a partir de la información que agregue en cada módulo.
            </p>
        </>
    ),
    DESCRIPTION_MODAL: (
        <div className="flex flex-col">
            <p className="font-poppins text-gray-dark mb-4.5">
                Desde diseño de página web puede crear y organizar la página web y tienda virtual de su empresa.
            </p>
            <Icon name="imageModalLanding" className="" />
        </div>
    ),
    LANDING_PURCHASE_PARAGRAPH_ONE: (
        <>
            Descubra la solución perfecta con planes de compra a su medida, para cada necesidad <br />
            empresarial.
        </>
    ),
    LANDING_PURCHASE_PARAGRAPH_SECOND: (
        <>
            <p className="inline memberships-section__paragraph">
                Empiece seleccionando el plan o los planes de compra que desee adquirir. Para seleccionar haga click en las &nbsp;
            </p>
            <Icon name="radiobutton" classIcon="h-5.5 inline mb-1" />
            <p className="inline memberships-section__paragraph">&nbsp; al lado izquierdo de los planes</p>
        </>
    ),
    LANDING_PURCHASE_PARAGRAPH_THIRD: <>Una vez haya seleccionado el plan o los planes a adquirir haga click en comprar ahora</>,
    MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS: (
        <p className="text-base text-center text-gray-dark font-aller">
            Actualmente usted no tiene planes activos en diggi pymes, para hacer la renovación de su plan haga click en
            <span className="font-allerbold">&nbsp; Renovar.</span>
        </p>
    ),
    MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS: (
        <p className="text-base text-center text-gray-dark font-aller">
            Actualmente usted no ha adquirido un plan en diggi pymes, para adquirir un plan haga click en
            <span className="font-allerbold">&nbsp; Aceptar</span>
        </p>
    ),
    MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS: (
        <p className="text-base text-center text-gray-dark font-aller">
            Actualmente usted no cuenta con documentos electrónicos disponibles, para adquirir un plan haga clic en
            <span className="font-allerbold">&nbsp; Aceptar</span>
        </p>
    ),
};
