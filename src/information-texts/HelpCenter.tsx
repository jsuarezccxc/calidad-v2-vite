import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Help } from '@models/HelpCenter';
import { PRODUCT_NAME } from '@constants/ProductName';
import { ActionType } from '@constants/ActionType';

export const INFORMATION = {
    PAGE_DIRECTIONS: `A continuación encontrará todas las instrucciones de documentos electrónicos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
    MODAL: {
        type: ActionType.SUCCESS,
        title: 'Formulario enviado',
        text: (
            <div>
                <p className="mb-1">¡Su formulario ha sido enviado con éxito!</p>
                <br />
                Un asesor se estará comunicando con usted en las
                <br /> próximas 48 horas hábiles.
            </div>
        ),
    },
};

export const PAGE_TEXTS: { [key: string]: IGenericRecord } = {
    [Help.Advisory]: {
        title: 'Reciba asesoría personalizada para su empresa',
        description: (
            <>
                <span className="block text-center">
                    ¡Nuestro equipo de expertos ofrece consultoría personalizada y de calidad en el área que su empresa necesite!
                </span>
                <span className="block mt-7">
                    Agregue la información solicitada y uno de nuestros expertos se estará comunicando con usted en las próximas
                    48 horas hábiles.
                </span>
            </>
        ),
    },
    [Help.Contact]: {
        title: 'Contáctenos para soluciones eficientes',
        description: (
            <>
                <span className="block text-center">
                    ¡Nuestro equipo esta disponible para ayudarle con cualquier duda que tenga!
                </span>
                <span className="block mt-7">Atenderemos su solicitud lo más pronto posible.</span>
            </>
        ),
    },
    [Help.Definitions]: {
        title: 'Gestione fácil y rápido diggi pymes',
        description: `A continuación, encontrará todas las instrucciones de los módulos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
        subTitle: 'Definiciones cortas',
        subDescription: `A continuación encontrará todas las instrucciones de documentos electrónicos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
    },
    main: {
        title: 'Centro de ayuda',
        description: `A continuación encontrará todas las instrucciones de documentos electrónicos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
    },
};

export const DEFINITIONS = [
    {
        text: (
            <p className="text-gray-dark">
                Definiciones cortas sobre <span className="text-purple font-allerbold">documentos electrónicos</span>
            </p>
        ),
        url: '1',
        value: 'Definiciones cortas sobre documentos electrónicos',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo solicitar la resolución de <span className="text-purple font-allerbold">facturación electrónica?</span>
            </p>
        ),
        url: '2',
        value: '¿Cómo solicitar la resolución de facturación electrónica?',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo solicitar la resolución de <span className="text-purple font-allerbold">documento soporte?</span>
            </p>
        ),
        url: '3',
        value: '¿Cómo solicitar la resolución de documento soporte?',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo solicitar la resolución de <span className="text-purple font-allerbold">facturación de contingencia?</span>
            </p>
        ),
        url: '4',
        value: '¿Cómo solicitar la resolución de facturación de contingencia?',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo sincronizar con <span className="font-allerbold">{PRODUCT_NAME}</span> los rangos de numeración para las
                &nbsp;
                <span className="text-purple font-allerbold">facturas?</span>
            </p>
        ),
        url: '5',
        value: '¿Cómo sincronizar con diggi pymes los rangos de numeración para las  facturas?',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo sincronizar con <span className="font-allerbold">{PRODUCT_NAME}</span> los rangos de numeración para &nbsp;
                <span className="text-purple font-allerbold">documento soporte?</span>
            </p>
        ),
        url: '6',
        value: '¿Cómo sincronizar con diggi pymes los rangos de numeración para  documento soporte?',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo sincronizar con <span className="font-allerbold">{PRODUCT_NAME}</span> los rangos de numeración para &nbsp;
                <span className="text-purple font-allerbold">factura de contingencia?</span>
            </p>
        ),
        url: '7',
        value: '¿Cómo sincronizar con diggi pymes los rangos de numeración para  factura de contingencia?',
    },
    {
        text: (
            <p className="text-gray-dark">
                Guia para enviar el <span className="text-purple font-allerbold">correo a la DIAN</span> informando las
                inconsistencias tecnológicas.
            </p>
        ),
        url: '8',
        value: 'Guia para enviar el correo a la DIAN informando las inconsistencias tecnológicas.',
    },
    {
        text: (
            <p className="text-gray-dark">
                ¿Cómo hacer un <span className="text-purple font-allerbold">Registro en la DIAN?</span>
            </p>
        ),
        url: '9',
        value: '¿Cómo hacer un Registro en la DIAN?',
    },
];
