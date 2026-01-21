import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';

export * from './ModalCustom';

/**
 * This type is using for show different information in type modal
 */
export type ITypeModal =
    | 'info'
    | 'add'
    | 'add_product'
    | 'add_service'
    | 'save'
    | 'update'
    | 'delete'
    | 'cant_delete'
    | 'success'
    | 'warning'
    | 'info_purchase_order'
    | 'success_correction_invoice'
    | 'cancel_module_or_group'
    | 'edit'
    | 'add_both';

/**
 * This interface describes what properties the custom modal component receives
 *
 * @typeParam show: boolean - Show State boolean to show modal
 * @typeParam showModal: () => void - ShowModal Function to change state of modal
 * @typeParam children: React.ReactNode - Children Elements of which the modal receives as a container
 * @typeParam classesWrapper: string - Optional class wrapper to add styles modal
 * @typeParam classesModal: string - Optional class modal to add styles content modal
 * @typeParam closeIcon: boolean - Optional icon for close modal is showing or not
 * @typeParam isLoader: boolean - Optional modal is used for showing loading page
 * @typeParam additional:  React.ReactNode - Optional modal Children Elements of which the modal additional
 * @typeParam classAdditional: string - Optional class additional to add styles modal
 * @typeParam id: string - Prop for defining element's id
 * @typeParam removeMinWidth: boolean - Optional prop for remove width
 * @typeParam classIconClose: string - Optional prop for style icon close
 */
export interface IModalCustomProps {
    show: boolean;
    showModal: () => void;
    children: React.ReactNode;
    classesWrapper?: string;
    classesModal?: string;
    closeIcon?: boolean;
    isLoader?: boolean;
    isTableModal?: boolean;
    additional?: React.ReactNode;
    classAdditional?: string;
    id: string;
    removeMinWidth?: boolean;
    classIconClose?: string;
}

/**
 * This interface describes what properties the type modal component receives
 *
 * @typeParam type: ITypeModal - Type is a type of modal information ADD | DELETE | INFO | SAVE | SUCCESS
 * @typeParam show: boolean - Show is a boolean to show modal
 * @typeParam closeIcon?: boolean - Optional prop to show close modal icon
 * @typeParam isHiddenButton: boolean - IsHiddenButton is a boolean to hidde modal button
 * @typeParam showModal: () => void - ShowModal Function to change state of modal
 * @typeParam title: string - Title String element to show title modal
 * @typeParam text: React.ReactElement | string - Text React Element with string content
 * @typeParam mainAction: () => void - Optional mainAction Add functionality to the right button
 * @typeParam otherAction: () => void - Optional otherAction Add functionality to the left button in type modaL ADD or DELETE
 * @typeParam textButton: string - Optional is the text of the button for the type succes
 * @typeParam classesWrapper: string - Optional class wrapper to add styles modal
 * @typeParam classesModal: string - Optional class modal to add styles content modal
 * @typeParam addButton: string - Optional add name to button left in type ADD
 * @typeParam withUpdateMessage: boolean - Optional prop that allows show in save modal purple text for updating data
 * @typeParam classesContentButton: string - Optional class content button modal
 * @typeParam id: string - Prop for defining element's id
 * @typeParam classModalType: string - Optional class container modal types
 * @typeParam backBtnText: string - Optional back button text
 */
export interface IModalTypeProps {
    type: ITypeModal;
    show: boolean;
    closeIcon?: boolean;
    isHiddenButton?: boolean;
    showModal: () => void;
    title: string;
    text: React.ReactElement | string;
    mainAction?: () => void;
    otherAction?: () => void;
    textButton?: string;
    classesWrapper?: string;
    classesModal?: string;
    addButton?: string;
    withUpdateMessage?: boolean;
    classesContentButton?: string;
    id: string;
    classModalType?: string;
    backBtnText?: string;
}

/**
 * This interface describes what properties the unauthorized modal component receives
 *
 * @typeParam show: boolean - Show is a boolean to show modal
 * @typeParam showModal: () => void - ShowModal Function to change state of modal
 * @typeParam classesWrapper: string - Optional class wrapper to add styles modal
 * @typeParam withoutInformation: boolean - Optional prop if company doesn't have information
 * @typeParam haveMembership: boolean - Optional prop if company have or not a membership
 * @typeParam id: string - prop for defining element's id module
 */
export interface IUnauthorizedModalProps {
    show: boolean;
    showModal: () => void;
    classesWrapper?: string;
    withoutInformation?: boolean;
    haveMembership?: boolean;
    id: string;
}

/**
 * Transactional pages with download icons
 */
export enum TypePageDownload {
    MINIMUM_LEVEL,
    MAXIMUM_LEVEL,
    TRANSFER_WAREHOUSES,
}

/**
 * This interface describes the props of the modal information
 *
 * @typeParam show: boolean - Indicates if show the modal
 * @typeParam showModal: () => void - Function for show the modal
 * @typeParam downloadFile: () => void - Function for download file
 * @typeParam typePageDownload: TypePageDownload - Select what is type page to download file
 * @typeParam id: string - prop for defining element's id module
 */
export interface IModalInformationProps {
    show: boolean;
    showModal: () => void;
    downloadFile: () => void;
    typePageDownload: TypePageDownload;
    id: string;
}

/**
 * This interface data of person
 * 
 * @typeParam email: string - Indicates email of person
 * @typeParam document_type: string - Indicates type of document
 * @typeParam document_number: string - Indicates number of document
 * @typeParam type_taxpayer_name: string - Indicates type of taxpayer name
 */
export interface IPerson {
    email: string;
    document_type: string;
    document_number: string;
    type_taxpayer_name: string;
}

/**
 * This interface data of client or supplier
 * 
 * @typeParam name: string - Indicates name of client or supplier
 * @typeParam person: IPerson - Indicates data of person
 */
export interface IDataClientOrSupplier {
    name: string;
    person: IPerson;
}

/**
 * This interface describes the props of the warning modal that is delivery because are trying to create a new client with existing data
 * 
 * @typeParam show: boolean - Indicates if show the modal
 * @typeParam isSupplier: boolean - Optional prop to indicate if the client is a supplier
 * @typeParam closeModal: () => void - Function for close the modal 
 * @typeParam dataClient: IGenericRecord - Existing client data
 * @typeParam editClient: () => void - Function to send edit client
 * @typeParam documentTypes: IGenericRecord - Indicates types of documents
 * @typeParam dataClientOrSupplier: IDataClientOrSupplier - Indicates data of client or supplier
 * @typeParam keyDocumentType: string - Optional prop to indicate the key of document type
 * @typeParam id: string - prop for defining element's id module
 */
export interface IModalWarningClientOrSupplierProps {
    show: boolean;
    isSupplier ?: boolean;
    closeModal: () => void;
    editClient: () => void;
    documentTypes: IGenericRecord[];
    dataClientOrSupplier: IDataClientOrSupplier;
    keyDocumentType?: string;
    id: string;
}

export const scrollUp = 'info-scroll-up';

/**
 * This constant represent first position in array
 */
export const FIRST_POSITION_INDEX = 0;

/**
 * This interface describes the props of the modal bad request
 *
 * @typeParam show: boolean - Indicates if show the modal
 * @typeParam showModal: () => void - Function for show the modal
 * @typeParam id: string - prop for defining element's id module
 */
export interface IModalBadRequest {
    show: boolean;
    showModal: () => void;
    id: string;
}
