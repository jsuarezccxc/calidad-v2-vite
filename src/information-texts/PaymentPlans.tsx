import React, { ReactElement } from 'react';
import { Field, View, Modal } from '@models/PaymentPlans';
import { IGenericRecord } from '@models/GenericRecord';
import { PRODUCT_NAME } from '@constants/ProductName';

export const INFORMATION = {
    CARD: {
        answer: (
            <p>
                En caso de que PayU cargue su tarjeta antes de finalizar su período de prueba comuníquese con nuestra directora
                comercial a este email <span className="text-purple">tmolina@ccxc.us</span> para corregir el cargo.
            </p>
        ),
        question: '¿Información sobre cargo de tarjeta?',
    },
    INDICATIONS: (view: View): JSX.Element | null => {
        const indication = VIEW_INDICATION[view];

        if (!indication) return null;

        const { title, description } = indication;
        return (
            <>
                <h2 className="page-subtitle">{title}</h2>
                <p className="text-gray-dark my-4.5 font-aller text-2lg text-center">{description}</p>
            </>
        );
    },
    UNAPPROVED_TRANSACTION: {
        title: 'Transacción no aprobada',
        description: (
            <p className="text-gray-dark">
                Este plan esta solo disponible para microempresas. Adquiera nuestro plan de &nbsp;
                <span className="font-allerbold">60 facturas</span> al año por solo &nbsp;
                <span className="font-allerbold">$85.990</span>
            </p>
        ),
    },
    PENDING_TRANSACTION: {
        title: 'Información',
        description: (
            <p className="text-gray-dark">
                Su transacción se encuentra en estado estado <span className="font-allerbold">Pendiente</span> de aprobación.
            </p>
        ),
    },
    TRANSACTION_DECLINED: {
        title: 'Información',
        description: (
            <p className="text-gray-dark">
                Su transacción ha sido <span className="font-allerbold">Rechazada.</span> Inténtelo de nuevo más tarde
            </p>
        ),
    },
    WRONG_TRANSACTION: {
        title: 'Hubo un error en el pago',
        description: 'No se pudo completar el pago. Inténtelo de nuevo.',
    },
    APPROVED_TRANSACTION: {
        title: 'Transacción aprobada',
        description: '¡Su transacción ha sido aprobada con éxito!',
    },
    INACTIVITY: {
        title: 'Información',
        description: (
            <p className="text-gray-dark">
                Ha superado el tiempo límite de inactividad, por motivos de seguridad &nbsp;
                <span className="font-allerbold">diggi pymes</span> lo ha re direccionado a la pantalla{' '}
                <span className="font-allerbold">Planes de pago.</span>
            </p>
        ),
    },
    DELETE_PLAN: (plan: string): { title: string; description: string } => ({
        title: 'Eliminar',
        description: `¿Está seguro que desea eliminar ${plan} recién agregado?`,
    }),
    [Modal.ApplicationApproved]: {
        title: 'Solicitud aprobada',
        description: 'Tu solicitud para el obsequio de 15 documentos ha sido aprobada.',
    },
    [Modal.ApplicationNotApproved]: {
        title: 'Solicitud no aprobada',
        description:
            'Lamentamos informarle que en este momento no se cumplen los requisitos necesarios para procesar su solicitud de obsequio de 15 documentos. Aceptar',
    },
};

export const VIEW_INDICATION: Partial<Record<View, { title: string; description: string }>> = {
    [View.Method]: {
        title: 'Método de pago',
        description: 'Seleccione el método de pago que desea utilizar.',
    },
    [View.Information]: {
        title: 'Información de pago',
        description:
            'Agregue la información para facturar y la información de su tarjeta. Si permanece 10 minutos inactivo será redireccionado a Planes de pago.',
    },
};

export const PLAN_DETAIL = {
    basic: [
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description: 'Uso de las redes sociales a través del sitio web: Whatsapp, Facebook, Twitter.',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Certificado SSL para la  seguridad del sitio web',
            including: true,
        },
        {
            description: 'Posibilidad de utilizar su dominio propio',
            including: true,
        },
        {
            description: 'Múltiples pasarelas de pago',
            including: false,
        },
        {
            description: 'Páginas ilimitadas',
            including: false,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: false,
        },
        {
            description: 'Incluye el proceso completo de venta y entrega de los productos para los clientes',
            including: false,
        },
    ],
    standard: [
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description: 'Uso de las redes sociales a través del sitio web: Whatsapp, Facebook, Twitter.',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Certificado SSL para la  seguridad del sitio web',
            including: true,
        },
        {
            description: 'Posibilidad de utilizar su dominio propio',
            including: true,
        },
        {
            description: 'Múltiples pasarelas de pago',
            including: true,
        },
        {
            description: 'Páginas ilimitadas',
            including: false,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: false,
        },
        {
            description: 'Incluye el proceso completo de venta y entrega de los productos para los clientes',
            including: false,
        },
    ],
    advanced: [
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description: 'Uso de las redes sociales a través del sitio web: Whatsapp, Facebook, Twitter.',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Certificado SSL para la  seguridad del sitio web',
            including: true,
        },
        {
            description: 'Posibilidad de utilizar su dominio propio',
            including: true,
        },
        {
            description: 'Múltiples pasarelas de pago',
            including: false,
        },
        {
            description: 'Páginas ilimitadas',
            including: true,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: true,
        },
        {
            description: 'Incluye el proceso completo de venta y entrega de los productos para los clientes',
            including: false,
        },
    ],
    premium: [
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description: 'Uso de las redes sociales a través del sitio web: Whatsapp, Facebook, Twitter.',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Certificado SSL para la  seguridad del sitio web',
            including: true,
        },
        {
            description: 'Posibilidad de utilizar su dominio propio',
            including: true,
        },
        {
            description: 'Múltiples pasarelas de pago',
            including: true,
        },
        {
            description: 'Páginas ilimitadas',
            including: true,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: true,
        },
        {
            description: 'Incluye el proceso completo de venta y entrega de los productos para los clientes',
            including: true,
        },
    ],
};

export const TOOLTIP_DATA: { [key: string]: { title: string; description: string | JSX.Element } } = {
    [Field.Bank]: {
        title: 'Nombre del banco:',
        description: 'es el nombre del banco.',
    },
    [Field.ClientName]: {
        title: 'Nombre del cliente:',
        description: 'es el nombre del cliente.',
    },
    [Field.DocumentType]: {
        title: 'Tipo de documento:',
        description: 'es el tipo de identificación del cliente.',
    },
    [Field.DocumentNumber]: {
        title: 'Numero del documento:',
        description: 'es el número de identificación del cliente.',
    },
    [Field.Address]: {
        title: 'Dirección:',
        description: 'Ubicación geográfica del cliente.',
    },
    [Field.CountryId]: {
        title: 'País:',
        description: 'Ubicación geográfica del cliente.',
    },
    [Field.DepartmentId]: {
        title: 'Departamento:',
        description: 'ubicación geográfica del cliente.',
    },
    [Field.CityId]: {
        title: 'Ciudad:',
        description: 'ubicación geográfica del cliente.',
    },
    [Field.PostalCode]: {
        title: 'Código postal:',
        description: 'es la combinación de números que representa la zona en la que está ubicado el cliente.',
    },
    [Field.Phone]: {
        title: 'Teléfono:',
        description: 'es el número de teléfono fijo o celular del cliente.',
    },
    [Field.PersonType]: {
        title: 'Tipo de contribuyente:',
        description: (
            <>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">• Persona natural: </span>&nbsp; cuando el cliente actúa a título personal.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">• Persona jurídica: </span>&nbsp; cuando el cliente actúa en representación
                    de una sociedad conformada por una o mas personas.
                </p>
            </>
        ),
    },
    [Field.TaxDetail]: {
        title: 'Detalle de impuesto:',
        description: 'es el tributo al que contribuyente está obligado a facturar. Se encuentra en la casilla X del RUT.',
    },
    [Field.Responsibilities]: {
        title: 'Responsabilidad fiscal:',
        description:
            'es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla X del RUT.',
    },
};

export const PLAN_DESCRIPTIONS = [
    {
        title: 'Plan básico:',
        description:
            ' Haga visible su negocio con una página web que cuente su historia, muestre sus productos y conecte con sus clientes.',
    },
    {
        title: 'Plan estándar:',
        description: 'Lance su presencia virtual con dos páginas web y una tienda virtual para impulsar sus ventas al máximo.',
    },
    {
        title: 'Plan avanzado:',
        description: 'Cree, expanda y domine en línea como nunca con nuestro plan de páginas web ilimitadas para su negocio.',
    },
    {
        title: 'Plan Premium:',
        description:
            'Descubra todo el potencial en internet con nuestro plan premium y obtenga páginas web ilimitadas y una tienda virtual para que domine el mercado digital ahora.',
    },
];

export const PLAN_METHOD_PAYMENT = {
    DESCRIPTION: 'Seleccione el método de pago que desea utilizar. ',
    UPDATE_METHOD:
        'Agregue la información de su nuevo método de pago. Se realizará un nuevo cobro del plan seleccionado. Si permanece 10 minutos inactivo será redireccionado a Mi plan de pago.',
};

export const SUCCESS_UPDATE_METHOD_PAYMENT = {
    TITLE: 'Información guardada',
    DESCRIPTION: '¡Su información ha sido guardada con éxito!',
    BUTTON: 'Aceptar',
};

export const ERROR_UPDATE_METHOD_PAYMENT = {
    TITLE: 'Datos incorrectos',
    DESCRIPTION: 'No se pudo actualizar el método pago. Verifique los datos e inténtelo de nuevo.',
    BUTTON: 'Aceptar',
};

export const INFORMATION_METHOD_PAYMENT = {
    TITLE: 'Información',
    DESCRIPTION: (
        <div className="font-normal text-center text-gray-dark">
            Ha superado el tiempo límite de inactividad, por motivos de seguridad &nbsp;
            <span className="font-allerbold">{PRODUCT_NAME}</span> lo ha re direccionado a la pantalla &nbsp;
            <span className="font-allerbold">Mi plan de pago.</span>
        </div>
    ),
    BUTTON: 'Aceptar',
};

export const SUCCESS_CANCEL_PLAN = {
    TITLE: 'Su plan ha sido cancelado',
    DESCRIPTION: (date: string): string => `Su plan estará vigente hasta la fecha de vencimiento ${date}.`,
    SECOND_DESCRIPTION: `Hasta dicha fecha usted podrá disfrutar de las funcionalidades de ${PRODUCT_NAME}.`,
    BUTTON: 'Cerrar',
};

export const THANKS_DIGGI = {
    TITLE: `Muchas gracias por seguir siendo parte de la familia ${PRODUCT_NAME}.`,
    BUTTON: 'Cerrar',
};

export const REMEMBER = {
    TITLE: (title: string): string => `Le recordamos que hasta el dia xx/zz/yyy puede renovar su plan ${title}`,
    BUTTON_LEFT: 'Mantener la cancelación del plan',
    BUTTON_RIGHT: 'Renovar Plan',
};

export const CONFIRM_CANCEL_RENOVATION = {
    TITLE: (title: string): string => `Usted esta cancelando su plan de pago ${title}`,
    SUBTITLE: (title: string): string => `¿Esta seguro de que quiere cancelar su plan de pago ${title}?'`,
    FIRST_PARAGRAPH: (title: string, date: string): string =>
        `Su plan de pago ${title} estará vigente hasta la fecha de vencimiento ${date}. Hasta dicha fecha usted podrá disfrutar de las funcionalidades de ${PRODUCT_NAME}.`,
    SECOND_PARAGRAPH: 'Recuerde que en cualquier momento puede renovar su plan',
    BUTTON_LEFT: 'Cancelar el  Plan',
    BUTTON_RIGHT: 'Continuar con el Plan',
};

export const CONFIRM_CANCEL_AUTORENOVATION = {
    TITLE: 'Usted esta cancelando la renovación automática de su plan',
    SUBTITLE: '¿Esta seguro de que quiere cancelar la renovación automática de su plan?',
    DESCRIPTION:
        'Al cancelar la renovación automática, no tendrá acceso a las funcionalidades una vez pase la fecha de vencimiento.',
    BUTTON_LEFT: 'Cancelar la renovación',
    BUTTON_RIGHT: 'Continuar con la renovación',
};

export const CANCEL_RENOVATION = {
    TITLE: 'La renovación automatica de su plan se ha cancelado ',
    DESCRIPTION: `Muchas gracias por haber sido parte de la familia ${PRODUCT_NAME}`,
    BUTTON: 'Cerrar',
};

export const CONTINUE_RENOVATION = {
    TITLE: 'Continua la renovación automática de su plan',
    DESCRIPTION: `Muchas gracias por seguir siendo parte de la familia ${PRODUCT_NAME}.`,
    BUTTON: 'Cerrar',
};

export const ACTIVE_RENOVATION = {
    TITLE: '¿Desea activar la renovación automática de su plan?',
    DESCRIPTION: 'Usted cancelo su renovación automática ¿estaría interesado en reversar esa decisión?',
    BUTTON_LEFT: 'No estoy intersado',
    BUTTON_RIGHT: 'Sí, activar renovación',
};

export const SUCCESS_ACTIVATION = {
    TITLE: 'Gracias por activar la renovación automática de su plan',
    DESCRIPTION: (date: string): string => `Su plan se renovará el dia ${date}`,
    BUTTON: 'Cerrar',
};

export const AUTOMATIC_RENOVATION = {
    TITLE: (title: string, date: string): string => `La renovación automática de su plan ${title} se realizara el dia ${date}`,
    DESCRIPTION: 'Si usted desea realizar  algún cambio en esta renovación haga clic en “Mi plan de pago”.',
    BUTTON_LEFT: 'Cerrar',
    BUTTON_RIGHT: 'Mi plan de pago',
};

export const RENOVATION_PLAN = {
    TITLE: 'Renovación de su plan',
    DESCRIPTION: (title: string): ReactElement => (
        <div className="flex flex-col items-center justify-center px-5 mt-2">
            <div className="text-base font-normal text-gray-dark text-center leading-4.5">
                Le notificamos que el pago de su plan {title} se renovará al final del día.
            </div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mt-5">
                Si usted desea realizar algún cambio en esta renovación haga clic en “Mi plan de pago”.
            </div>
        </div>
    ),
    BUTTON_LEFT: 'Cerrar',
    BUTTON_RIGHT: 'Mi plan de pago',
};

export const EXPIRATION_PLAN = {
    TITLE: 'Su plan vence en X días',
    DESCRIPTION: (title: string, date: IGenericRecord): ReactElement => (
        <div className="flex flex-col items-center justify-center px-4 mt-2">
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mb-5">
                Para evitar la interrupción de sus servicios, le recomendamos realizar la renovación antes de la fecha de
                vencimiento.
            </div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mb-5">Plan: {title}</div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5">
                Fecha de vencimiento: {date.day} del {date.month} de {date.year}
            </div>
        </div>
    ),
    BUTTON_LEFT: 'Cerrar',
    BUTTON_RIGHT: 'Renovar plan',
};

export const EXPIRATION_PLAN_TODAY = {
    TITLE: 'Su plan vence hoy',
    DESCRIPTION: (title: string, date: IGenericRecord): ReactElement => (
        <div className="flex flex-col items-center justify-center mt-2">
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mb-5">
                Para evitar la interrupción de sus servicios, le recomendamos realizar la renovación el dia de hoy.
            </div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mb-5">Plan: {title}</div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5">
                Fecha de vencimiento: {date.day} del {date.month} de {date.year}
            </div>
        </div>
    ),
    BUTTON_LEFT: 'Cerrar',
    BUTTON_RIGHT: 'Renovar plan',
};

export const EXPIRED_PLAN = {
    TITLE: 'Plan vencido',
    DESCRIPTION: (title: string): ReactElement => (
        <div className="flex flex-col items-center justify-center mt-2">
            <div className="text-base font-normal text-gray-dark text-center leading-4.5 mb-5">
                Le informamos que su plan <span className="font-allerbold">{title}</span> ha vencido, los servicios asociados a su
                cuenta han sido suspendidos.
            </div>
            <div className="text-base font-normal text-gray-dark text-center leading-4.5">
                Le recomendamos adquirir nuevamente su plan lo antes posible.
            </div>
        </div>
    ),
    BUTTON_LEFT: 'Cancelar',
    BUTTON_RIGHT: 'Planes de pago',
};

export const REACTIVATE_PLAN = {
    TITLE: (plan: string, date: string): string => `Le recordamos que hasta el dia ${date} puede reactivar su plan ${plan}`,
    BUTTON_LEFT: 'Mantener la cancelación del plan',
    BUTTON_RIGHT: 'Reactivar plan',
};

export const SUCCESS_REACTIVATE = {
    TITLE: (plan: string): string => `Gracias por activar su plan ${plan}`,
    BUTTON: 'Cerrar',
};
