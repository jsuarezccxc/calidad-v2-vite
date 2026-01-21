import React from 'react';
import { Modal } from '@models/PaymentPlans';

export const PURCHASING_PROCESS_TEXTS = {
    FIRST_PARAGRAPH: (
        <>
            Visualice el resumen de la compra que usted seleccionó. Si está listo para pagar haga click en el botón &nbsp;
            <br />
            <span className="text-green">Siguiente</span>, si no desea realizar su compra inmediatamente haga click en el botón
            &nbsp;
            <span className="text-green">Guardar</span>. Si ha guardado <br /> su compra, la próxima vez que entre a diggi pymes
            la visualizará en el resumen de compra.
        </>
    ),
    SECOND_PARAGRAPH: (
        <>
            Si usted no clickea en el botón <span className="text-green">Guardar</span> o botón &nbsp;
            <span className="text-green">Siguiente</span> la información no quedará guardada.
        </>
    ),
    SUMMARY_TABLE_EMPTY: 'Su resumen de compra está vacío. Para agregar uno o varios módulos a su resumen de compra,',
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
        description: (
            <p className="flex flex-col text-base font-aller text-gray-dark">
                Tu solicitud para el obsequio de 15 documentos ha sido aprobada. <span>Su plan ha sido activado.</span>
            </p>
        ),
    },
    [Modal.ApplicationNotApproved]: {
        title: 'Solicitud no aprobada',
        description: (
            <p className="text-base font-aller text-gray-dark">
                Lamentamos informarle que en este momento no se cumplen los requisitos necesarios para procesar su solicitud de
                obsequio de 15 documentos.
            </p>
        ),
    },
    [Modal.PlanAlreadyActive]: {
        title: 'Solicitud no aprobada',
        description: (
            <p className="text-base font-aller text-gray-dark">Actualmente usted tiene activo el plan de 15 documentos gratis.</p>
        ),
    },
    [Modal.PlanAlreadyPurchasedThisYear]: {
        title: 'Solicitud no aprobada',
        description: (
            <p className="text-base font-aller text-gray-dark">
                Actualmente no ha superado el año de la compra para adquirir nuevamente los 15 documentos gratis
            </p>
        ),
    },
};
