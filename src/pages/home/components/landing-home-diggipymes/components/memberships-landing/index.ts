import { IModulesMembership } from '@models/Membership';

export * from './MembershipsLanding';

/**
 * Name of the module representing a website and diggital store.
 */
export const WEBSITE_MODULE = 'Sitio web y tienda diggital';

/**
 * Name of the module representing a digital seller.
 */
export const DIGGITAL_SELLER_MODULE = 'Vendedor diggital';

/**
 * Name of the module representing a CRM.
 */
export const CRM_MODULE = 'CRM';

/**
 * Name of the module representing electronic documents.
 */
export const ELECTRONIC_DOCUMENTS_MODULE =
    'Documentos Electrónicos: Facturación electrónica, Documento Soporte, Notas débito y crédito, Notas de ajuste';

/**
 * Name of the module representing planning and organization tools.
 */
export const ORGANIZATION_PLANNING = 'Planeación y organización';

/**
 * List of module names that include submodules.
 */
export const targetModuleWithSubmodulesNames = [WEBSITE_MODULE, ELECTRONIC_DOCUMENTS_MODULE];

/**
 * List of module names that do not include submodules.
 */
export const targetModuleWithoutSubmodulesNames = [DIGGITAL_SELLER_MODULE, ORGANIZATION_PLANNING, CRM_MODULE];


/**
 * List of details for electronics documents
 */
export const DETAILS_CRM: { title: string; }[] = [
    {
        title: 'Gestión de contactos',
    },
    {
        title: 'Análisis de costos de adquisición',
    },
    {
        title: 'Reportes analíticos',
    },
    {
        title: 'Carga masiva de contactos',
    },
    {
        title: 'Servicio al clientes de PQRSF',
    },
    {
        title: 'Soporte 24/7',
    },
    {
        title: 'Gestión de ventas',
    },
    {
        title: 'Envío de correos electrónicos',
    },
];

/**
 * List of details for electronics documents
 */
export const DETAILS_ELECTRONIC_DOCUMENTS: { title: string; description: string }[] = [
    {
        title: 'Incluye Facturación electrónica, documento soporte, nota débito, nota crédito y nota de ajuste',
        description:
            'elabore los documentos electrónicos necesarios para la gestión de su negocio cumpliendo todos los requisitos exigidos por la DIAN.',
    },
    {
        title: 'Soporte 24/7',
        description:
            'contáctenos a través del correo electrónico de soporte a cualquier hora y se le responderá lo más pronto posible.',
    },
    {
        title: 'Reportes analíticos para administración de Documentos electrónicos',
        description:
            'notifique los eventos (acuse de recibo, recibo de mercancía y aceptación o reclamo de la factura) a la DIAN verificando el estado de sus documentos electrónicos.',
    },
    {
        title: 'Acompañamiento en los trámites con la DIAN para Documentos electrónicos',
        description:
            'acompañamiento por un especialista de diggi pymes durante el proceso de habilitación ante la DIAN para la generación de documentos electrónicos.',
    },
    {
        title: 'Reenvío gratuito hacia el cliente de Documentos electrónicos',
        description: 'reenvíe fácil y rápido los documentos electrónicos emitidos al correo electrónico del cliente.',
    },
    {
        title: 'Manejo de facturas de proveedores ante la DIAN',
        description:
            'gestione las facturas de proveedores cumpliendo con los requisitos de la DIAN para garantizar su correcta validación y registro.',
    },
    {
        title: 'Certificado de firma digital gratuito',
        description: 'identidad digital para simplificar los procesos de facturación de manera legal, segura y rápida.',
    },
    {
        title: 'Descarga de facturas en PDF y XML',
        description: 'guarde los documentos electrónicos en su dispositivo en formato PDF o XML de manera fácil y rápida. ',
    },
    {
        title: 'Uso de logo propio',
        description: 'personalice los documentos electrónicos de sus clientes con el logo de su empresa.',
    },
];

/**
 * List of details for website
 */
export const DETAILS_WEBSITE = {
    standard: [
        {
            description: 'Posibilidad de utilizar su dominio propio o dominio diggi pymes',
            including: true,
        },
        {
            description: 'Páginas ilimitadas',
            including: true,
        },
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description:
                'Uso de las redes sociales a través del sitio web para realizar sus ventas( Whatsapp, Facebook, Twitter)',
            including: true,
        },
        {
            description: 'Control de inventario y administración de bodegas',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Certificado SSL para la seguridad del sitio web',
            including: true,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: true,
        },
    ],
    premium: [
        {
            description: 'Posibilidad de utilizar su dominio propio o dominio diggi pymes',
            including: true,
        },
        {
            description: 'Páginas ilimitadas',
            including: true,
        },
        {
            description: 'Acceso al sitio web desde cualquier dispositivo',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description:
                'Uso de las redes sociales a través del sitio web para realizar sus ventas( Whatsapp, Facebook, Twitter)',
            including: true,
        },
        {
            description: 'Ventas diggitales con carrito de compras',
            including: true,
        },
        {
            description: 'Control automático de inventario y administración de bodegas',
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
            description: 'Múltiples pasarelas de pago',
            including: true,
        },

        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: true,
        },
    ],
};

/**
 * List of details for Diggital Seller
 */
export const DETAILS_DIGGITAL_SELLER_MODULE = {
    main: [
        {
            description: 'Páginas ilimitadas',
            including: true,
        },
        {
            description: 'Catálogo con productos ilimitados y banner de promoción',
            including: true,
        },
        {
            description: 'Proceso de venta en tienda física utilizando su teléfono, tablet o computador',
            including: true,
        },
        {
            description: 'Control de inventario y administración de bodegas',
            including: true,
        },
        {
            description: 'Proceso de entrega de los productos para los clientes',
            including: true,
        },
        {
            description: 'Múltiples medios de pago, incluye efectivo.',
            including: true,
        },
        {
            description: 'Centro de notificaciones permanente',
            including: true,
        },
        {
            description: 'Herramientas analíticas para conocer a los clientes con mayor profundidad',
            including: true,
        },
    ],
};

/**
 * List of ids that have the module order on landing
 */
export const MODULE_ORDER_LANDING = [2, 3, 18, 5];

/**
 * Sorts an array of modules by a specific order of IDs.
 *
 * @param modules - The array of modules to sort.
 * @param orderedIds - An array of IDs representing the desired order.
 * @returns A new array of modules sorted according to `orderedIds`.
 *
 * Modules with IDs not found in `orderedIds` will be placed at the end.
 */
export const sortById = (modules: IModulesMembership[], orderedIds: number[]): IModulesMembership[] => {
    const idPosition = new Map(orderedIds.map((id, i) => [id, i]));
    return modules.slice().sort((a, b) => (idPosition.get(a.id) ?? Infinity) - (idPosition.get(b.id) ?? Infinity));
};
