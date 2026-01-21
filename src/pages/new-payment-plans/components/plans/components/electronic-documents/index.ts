import { IGenericRecord } from '@models/GenericRecord';
import { ISubModules } from '@models/Membership';

export { Card } from './Card';
export { Details } from './Details';
export { ElectronicDocuments } from './ElectronicDocuments';

/**
 * This interface describes the props of card
 *
 * @typeParam card: { name: string; price_month: number; index: number; isActive?: boolean } - Card data
 * @typeParam selectedPlan: IGenericRecord - Selected plan
 * @typeParam selectPlan: () => void - Function to select a plan
 * @typeParam hasActivePlan: boolean - This indicates if there is an active plan
 * @typeParam toggleLogin: () => void - Open login when client is in landing page
 */
export interface ICardProps {
    card: { name: string; price_month: number; index: number; isActive?: boolean };
    selectedPlan: IGenericRecord;
    selectPlan: () => void;
    hasActivePlan: boolean;
    toggleLogin?: () => void;
}

/**
 * This interface describes the props of electronic documents
 *
 * @typeParam submodules: ISubModules[] - List of submodules
 * @typeParam data: IGenericRecord - Purchase data
 * @typeParam updateData: (data: IGenericRecord) => void - This is used to update the purchase data
 * @typeParam toggleLogin: () => void - Open login when client is in landing page
 */
export interface IElectronicDocumentsProps {
    submodules: ISubModules[];
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
    toggleLogin?: () => void;
}

/**
 * This is used to validate the plan with unlimited documents
 */
export const UNLIMITED_DOCUMENTS = 'Documentos Ilimitados';

/**
 * This is used to validate the plan with unlimited documents per year
 */
export const UNLIMITED_PER_YEAR = 'Ilimitados por año';

/**
 * List of details of the plans
 */
export const DETAILS: { title: string; description: string }[] = [
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
 * Free plan data
 */
export const FREE_PLAN_DATA = {
    title: '15 Documentos por año:',
    description:
        'Este plan aplica únicamente para las microempresas que cumplan con los parámetros establecidos en el artículo 2 de la Ley 905 de 2004, y que requieran utilizar como máximo 15 documentos electrónicos al año. En caso de requerir un documento electrónico adicional se deberá adquirir un paquete diferente, ya que el Plan Gratis para Microempresas solo podrá ser adquirido por una única vez.',
};
