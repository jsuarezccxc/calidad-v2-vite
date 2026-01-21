import React from 'react';
import { Link, LinkColor } from '@components/button';
import { PRODUCT_NAME } from '@constants/ProductName';
import { TitleButtons } from '@constants/Buttons';
import { URL_WOMPI } from '@constants/PaymentGatewaySynchronization';
import { IGenericRecord } from '@models/GenericRecord';
import { ModalKeys, ParamPaymentGateway } from '@constants/PaymentGatewaySynchronization';

const WOMPI_INSTRUCTION_ONE = [
    {
        title: (
            <>
                Ingrese a la página &nbsp;
                <Link
                    text="Wompi - Crear tu cuenta"
                    linkColor={LinkColor.PURPLE}
                    classes="font-allerbold"
                    href={URL_WOMPI}
                    target="_blank"
                    download
                />
                &nbsp; y continue con las instrucciones de la página
            </>
        ),
        className: 'payment-instructions__img-one',
        img: 'step-one-img-one',
    },
    {
        title: 'Haga click en en el botón de “Regístrese” para dar inicio al proceso de crear cuenta en Wompi',
        className: 'payment-instructions__img-two',
        img: 'step-one-img-two',
    },
    {
        title:
            'Seleccione su tipo de cuenta, si es persona natural o jurídica y tenga en cuenta el monto de  facturación indicado',
        className: 'payment-instructions__img-three',
        img: 'step-one-img-three',
    },
    {
        title:
            'Agregue todos los datos básicos del formulario y luego haga click en el botón “Guardar y continuar”, a su correo electrónico deberá llegar un enlace para continuar con el proceso de registro',
        className: 'payment-instructions__img-four',
        img: 'step-one-img-four',
    },
    {
        title: (
            <>
                Abra su correo electrónico y revise su bandeja de entrada con el mensaje “Confirma tu cuenta en Wompi”.
                <br />
                Luego copie el código enviado.
            </>
        ),
        className: 'payment-instructions__img-five',
        img: 'step-one-img-five',
    },
    {
        title: 'Pegue el código enviado para confirmar y continuar con el registro',
        className: 'payment-instructions__img-six',
        img: 'step-one-img-six',
    },
    {
        title: 'Completado el paso anterior, seleccione el plan que mejor se adapte a su negocio',
        className: 'payment-instructions__img-seven',
        img: 'step-one-img-seven',
    },
    {
        title:
            'Cargue en formato PDF el RUT  de su negocio para poder habilitar el formulario en donde podrá colocar la información de su negocio',
        className: 'payment-instructions__img-eight',
        img: 'step-one-img-eight',
    },
    {
        title:
            'Llene todos los campos solicitados en el formulario, Dirección del comercio, Actividad de la empresa, Canales de venta, Otros, y luego haga click en “Guardar y continuar”',
        className: 'payment-instructions__img-nine',
        img: 'step-one-img-nine',
    },
    {
        title:
            'Para finalizar con el registro en Wompi, ingrese los datos bancarios de su negocio y luego haga click en “Finalizar registro”',
        className: 'payment-instructions__img-ten',
        img: 'step-one-img-ten',
    },
    {
        img: '',
        title: 'last',
        className: 'w-70 xs:w-full',
        description: (
            <>
                <p className="text-xl text-gray-dark mb-4.5">Ha completado el paso 1 con éxito.</p>
                <p className="text-xl leading-normal text-gray-dark">
                    Continúe con el <span className="font-allerbold">Paso 2:</span> Sincronizar Wompi con {PRODUCT_NAME}
                </p>
            </>
        ),
        titleButton: `Paso 2: Sincronizar Wompi con ${PRODUCT_NAME}`,
        urlButton: '/#',
    },
];

const WOMPI_INSTRUCTION_TWO = [
    {
        title:
            'Ingrese a su cuenta de Wompi y en el menú izquierdo de clic en la opción “Desarrollo” para desplegar las opciones de desarrollo.',
        className: 'payment-instructions__img-eleven',
        img: 'step-two-img-one',
    },
    {
        title: 'Haga clic en la opción “Programadores” para ingresar a las configuraciones avanzadas y ver las llaves.',
        className: 'payment-instructions__img-twelve',
        img: 'step-two-img-two',
    },
    {
        isForm: true,
        className: 'payment-instructions__img-thirteen',
        img: 'step-two-img-three',
        title: `Copie todas las llaves y luego péguelas en ${PRODUCT_NAME}, una vez hecho este paso, haga clic en guardar para integrar la pasarela de pago Wompi con ${PRODUCT_NAME}.`,
    },
    {
        img: '',
        title: 'last',
        className: 'payment-instructions__width-161',
        description: (
            <>
                <p className="text-xl text-gray-dark mb-4.5">Ha completado el paso 2 con éxito.</p>
                <p className="text-xl leading-normal text-gray-dark">
                    Continúe haciendo click en el &nbsp;
                    <span className="font-allerbold">Agregue los productos/servicios a su sitio web</span>
                </p>
            </>
        ),
        titleButton: 'Agregue los productos/ servicios a su sitio web',
        urlButton: '/#',
    },
];

export const PAYMENT_CATEGORIES: Record<string, IGenericRecord> = {
    [ParamPaymentGateway.MercadoPago]: {
        title: `Sincronización de Mercado Pago con ${PRODUCT_NAME}`,
        cardOne: (
            <p>
                <span className="font-allerbold text-gar">Definiciones cortas</span> y claras de los términos que encontrará en la
                Sincronización de Mercado Pago con <span className="font-allerbold text-gar">{PRODUCT_NAME}</span> y que usted
                podría no conocer
            </p>
        ),
        cardTwo: (
            <p>
                <span className="font-allerbold text-gar">Acompañamiento</span> de un experto en la Sincronización de Mercado Pago
                con &nbsp;
                <span className="font-allerbold text-gar">{PRODUCT_NAME}</span> para entender este módulo.
            </p>
        ),
    },
    [ParamPaymentGateway.Wompi]: {
        title: `Sincronización de Wompi con ${PRODUCT_NAME}`,
        cardOne: (
            <p>
                <span className="font-allerbold text-gar">Definiciones cortas</span> y claras de los términos que encontrará en la
                Sincronización de Wompi con <span className="font-allerbold text-gar">{PRODUCT_NAME}</span> y que usted podría no
                conocer
            </p>
        ),
        cardTwo: (
            <p>
                <span className="font-allerbold text-gar">Acompañamiento</span> de un experto en la Sincronización de Wompi con
                &nbsp;
                <span className="font-allerbold text-gar">{PRODUCT_NAME}</span> para entender este módulo.
            </p>
        ),
    },
};

export const PAYMENT_INSTRUCTIONS: Record<string, IGenericRecord> = {
    [ParamPaymentGateway.Wompi]: {
        '1': {
            ID: 2,
            TITLE: 'Paso 1: Crear cuenta en Wompi',
            INSTRUCTIONS: WOMPI_INSTRUCTION_ONE,
            TITLE_BUTTON_lEFT: TitleButtons.BACK,
            TITLE_BUTTON_RIGHT: TitleButtons.NEXT_STEP,
        },
        '2': {
            ID: 2,
            TITLE: `Paso 2: Sincronizar Wompi con ${PRODUCT_NAME}`,
            INSTRUCTIONS: WOMPI_INSTRUCTION_TWO,
            TITLE_BUTTON_lEFT: TitleButtons.PREV_STEP,
            TITLE_BUTTON_RIGHT: TitleButtons.NEXT,
        },
    },
};

export const MODAL_INFORMATION: Record<string, IGenericRecord> = {
    [ModalKeys.Error]: {
        iconName: 'warning',
        text: {
            title: 'Información',
            description: `No ha sido posible la sincronización de Wompi con ${PRODUCT_NAME} debido a un error en las llaves proporcionadas.`,
        },
    },
};
