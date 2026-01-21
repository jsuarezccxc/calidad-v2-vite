/**
 * This interface describes the contact modal data
 *
 * @typeParam title: string -  Require modal title
 * @typeParam description: string - Require description modal
 * @typeParam fields: IFieldsContactUs[] - Require fields modal
 */
export interface IContactUs {
    title: string;
    description: string;
    fields: IFieldContactUs[];
}

/**
 * This interface describes the data fields
 *
 * @typeParam label: string - Require value input
 * @typeParam type: string - Require type input
 * @typeParam id: string - Require id input
 * @typeParam name: ContactUsType - Require name input
 * @typeParam is_required: boolean - Require is require value input
 * @typeParam field_type_id: string - Require id field input select
 * @typeParam max_length: number - Require  maximum size of the type of field
 * @typeParam min_length: number - Require minimum size of the type of field
 */
export interface IFieldContactUs {
    label: string;
    type: string;
    id: string;
    name: ContactUsType;
    is_required: boolean;
    field_type_id: string;
    max_length: number;
    min_length: number;
}

/**
 * This interface describes the data list proof of purchase
 *
 * @typeParam number_purchase_order: string - Optional proof of purchase number
 * @typeParam number: string - Require proof of purchase number
 * @typeParam date: number - Require transaction date
 * @typeParam client_name: string - Require client name
 * @typeParam client_email: string - Require client email
 * @typeParam invoice_pdf_url: string - Require url pdf
 */
export interface IProofPurchase {
    number_purchase_order?: string;
    number: string;
    date: number;
    client_name: string;
    client_email: string;
    invoice_pdf_url: string;
}

/**
 * Contact type
 */
export enum ContactUsType {
    text = 'Texto corto',
    paragraph = 'Párrafo',
    number = 'Número',
    email = 'Correo electrónico',
    select = 'Seleccionar',
}
