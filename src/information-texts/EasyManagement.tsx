import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { DOC, MENU, TypeDoc } from '@pages/docs-instructions/context';

export const HELP_CENTER = 'Centro de ayuda';
export const EASY_MANAGEMENT = {
    TITLE: `Gestióne fácil y rápido ${PRODUCT_NAME} `,
    DESCRIPTION: `A continuación encontrará todas las instrucciones de documentos electrónicos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
    DEFINITIONS: {
        TITLE: 'Definiciones cortas',
        DESCRIPTION: `A continuación encontrará todas las instrucciones de documentos electrónicos que le permitan tener un mejor entendimiento de ${PRODUCT_NAME} y una mejor gestión de las operaciones de su empresa.`,
    },
    HELP_TROPICS: [
        {
            id: 'electronic-documents',
            name: 'Documentos electrónicos',
            items: [
                {
                    textTitle: 'Definiciones cortas sobre documentos electrónicos',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            Definiciones cortas sobre
                            <span className="text-purple font-allerbold"> documentos electrónicos</span>
                        </p>
                    ),
                    content: [
                        {
                            name: 'Bodega',
                            description: 'Es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
                        },
                        {
                            name: 'Cantidad',
                            description: 'Es la cantidad del producto vendida a su cliente.',
                        },
                        {
                            name: 'Certificado propio',
                            description:
                                'Si ya cuenta con un certificado de firma digital con alguno de los proveedores autorizados (certicámara, Andes, Edicom etc.).',
                        },
                        {
                            name: 'Certificado gratuito',
                            description: `Si no cuenta con un certificado de firma digital, puede usar el de ${PRODUCT_NAME} sin ningún costo.`,
                        },
                        {
                            name: 'Cliente',
                            description: 'Es el nombre del cliente.',
                        },
                        {
                            name: 'Ciudad',
                            description: 'Es la ciudad donde se registró la empresa en la cámara de comercio.',
                        },
                        {
                            name: 'CIIU o Actividad económica',
                            description:
                                "Este dato se encuentra en el RUT de la empresa, en la sección 'Clasificación', bajo el título 'Actividad económica'. Se encuentra en la casilla X del RUT.",
                        },
                        {
                            name: 'Código postal',
                            description: 'Es la combinación de números que representa la zona en la que está ubicada la empresa.',
                        },
                        {
                            name: 'Comentario para uso interno',
                            description:
                                'Son anotaciones o notas internas que se adjuntan en el documento con fines de registro interno o comunicación entre la empresa.',
                        },
                    ],
                    url: null,
                },
                {
                    textTitle: '¿Cómo solicitar la resolución de facturación electrónica?',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo solicitar la resolución de
                            <span className="text-purple font-allerbold"> facturación electrónica</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=electronic-invoice&step=request-resolution`,
                },
                {
                    textTitle: '¿Cómo solicitar la resolución de documento soporte?',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo solicitar la resolución de
                            <span className="text-purple font-allerbold"> documento soporte</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=support-document&step=request-resolution`,
                },
                {
                    textTitle: '¿Cómo solicitar la resolución de facturación de contingencia?',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo solicitar la resolución de
                            <span className="text-purple font-allerbold"> facturación de contingencia</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=${TypeDoc.CI}&${MENU}=true`,
                },
                {
                    textTitle: `¿Cómo sincronizar con ${PRODUCT_NAME} los rangos de numeración para las facturas?`,
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo sincronizar con<span className="font-allerbold"> {PRODUCT_NAME} </span>los rangos de numeración
                            para las<span className="text-purple font-allerbold"> facturas</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=electronic-invoice&step=request-resolution`,
                },
                {
                    textTitle: `¿Cómo sincronizar con ${PRODUCT_NAME} los rangos de numeración para documento soporte?`,
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo sincronizar con<span className="font-allerbold"> {PRODUCT_NAME} </span>los rangos de numeración
                            para
                            <span className="text-purple font-allerbold"> documento soporte</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=support-document&step=request-resolution`,
                },
                {
                    textTitle: `¿Cómo sincronizar con ${PRODUCT_NAME} los rangos de numeración para factura de contingencia`,
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo sincronizar con<span className="font-allerbold"> {PRODUCT_NAME} </span> los rangos de numeración
                            para
                            <span className="text-purple font-allerbold"> factura de contingencia</span>?
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=${TypeDoc.CI}`,
                },
                {
                    textTitle: 'Guía para enviar el correo a la DIAN informando las inconsistencias tecnológicas.',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            Guía para enviar el<span className="text-purple font-allerbold"> correo a la DIAN </span>
                            informando las inconsistencias tecnológicas.
                        </p>
                    ),
                    content: null,
                    url: `${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=${TypeDoc.CI}`,
                },
                {
                    textTitle: '¿Cómo hacer un Registro en la DIAN?',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            ¿Cómo hacer un <span className="text-purple font-allerbold">Registro en la DIAN</span>?
                        </p>
                    ),
                    content: null,
                    url: '',
                },
            ],
        },
        {
            id: 'website-client',
            name: 'Sitio web y tienda virtual',
            items: [
                {
                    textTitle: 'Definiciones cortas sobre Sitio web y tienda virtual',
                    title: (
                        <p className="inline font-aller text-gray-dark">
                            Definiciones cortas sobre
                            <span className="text-purple font-allerbold"> Sitio web y tienda virtual</span>
                        </p>
                    ),
                    content: [
                        {
                            name: 'Agregar las plantillas prediseñadas',
                            description:
                                'Las plantillas prediseñadas son páginas que incluyen elementos como imágenes, catálogo, preguntas frecuentes, carruseles, contáctenos y más. Estas plantillas permiten tener una estructura definida para hacer un sitio web mas fácil y rápido.',
                        },
                        {
                            name: 'Agregue y/o edite las políticas de su sitio web',
                            description: `Es la pantalla en ${PRODUCT_NAME} para organizar y editar su propia política de tratamiento de datos para su sitio web, teniendo en cuenta el modelo de política de tratamiento de datos de CCXC.`,
                        },
                        {
                            name: 'Banner',
                            description:
                                'Es un anuncio en el sitio web que combina imágenes y texto para promocionar productos o servicios. Está diseñado para llamar la atención de sus clientes y realizar rápidamente una compra.',
                        },
                        {
                            name: 'Blog',
                            description:
                                'Es un espacio donde puede compartir información útil sobre el negocio, consejos y noticias relevantes. Ayuda a conectar con los clientes y a construir una relación con ellos.',
                        },
                        {
                            name: 'Bodega',
                            description: 'Es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
                        },
                        {
                            name: 'Botón',
                            description:
                                'Son figuras geométricas que se usan para activar una acción específica. Por ejemplo: Siguiente.',
                        },
                        {
                            name: 'Búsqueda orgánica',
                            description:
                                'Visitantes que llegan a su sitio web sin publicidad a través de los resultados de una búsqueda de internet.',
                        },
                        {
                            name: 'Carrusel imágenes y productos/servicios',
                            description:
                                'Forma interactiva de mostrar variedad imágenes y productos/servicios en un solo lugar, como un catálogo en movimiento. Permite a los visitantes ver rápidamente lo que tiene para ofrecer.',
                        },
                        {
                            name: 'Catálogo',
                            description:
                                'Enlista y detalla los productos o servicios ofrecidos, facilitando a los clientes la búsqueda, comparación y comprensión de los productos, con descripciones, imágenes y precios, promoviendo ventas y proporcionar información de contacto.',
                        },
                    ],
                    url: null,
                },
            ],
        },
    ],
};
