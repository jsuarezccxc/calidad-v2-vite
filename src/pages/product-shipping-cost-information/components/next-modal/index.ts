import { IGenericRecord } from '@models/GenericRecord';

export * from './NextModal';

/* Defining the interface for the props that will be passed to the component. */
export interface IContentTableProduct {
    saveChanges: () => void;
    setShowModal: (showModal: boolean) => void;
    showModal: boolean;
}

export const InformationNextModal:IGenericRecord = {
    title: 'Información',
    description_header: '¿Desea guardar la información antes de continuar?',
    description_body: 'Si desea guardar la información, haga click en Guardar, de lo contrario, haga click en Siguiente.'
}