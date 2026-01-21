import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { IFile, IOptionSelect, IPropsInput } from '@components/input';
import { IModalTypeProps } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './InvoiceSummary';

export const DOCUMENTS_SUPPORTED = 'documents_supported';

/**
 *  States invoice client answer
 */
export enum ClientState {
    VERIFICATION = 'IN_VERIFICATION',
    REJECTED = 'REJECTED_CLIENT',
    ACCEPT = 'ACCEPTED',
}

/**
 *  Title to accepted invoice
 */
export const DOCUMENT_ACCEPTED = 'Documento electrónico rechazado';

/**
 *  Title to rejected invoice
 */
export const DOCUMENT_REJECTED = 'Documento electrónico aceptado';

/**
 * This function reforms the data for the post
 *
 * @param data: IGenericRecord - Current data
 * @param id: string - Invoice id
 * @returns IGenericRecord
 */
export const refactorPostData = (data: IGenericRecord, id: string): IGenericRecord => ({
    invoice_id: id,
    reason_rejection_id: data.reason_rejection[0].id,
    reason_rejection_description: data.reason_rejection[0].description,
    code_credit_note: data.reason_rejection[0]?.code_credit_note,
    code_debit_note: data.reason_rejection[0]?.code_debit_note,
    observation: data.observation.value,
    accept: false,
    acceptance_agreement: true,
});

/**
 * This function is responsible for generating props
 *
 * @param name: string - Name input
 * @param file: IFile - File state
 * @param setFile: Dispatch<SetStateAction<IFile>> - Change state file
 * @returns  IPropsInput
 */
export const fileInputProps = (name: string, file: IFile, setFile: Dispatch<SetStateAction<IFile>>): IPropsInput => {
    return {
        name,
        labelText: 'Si cuenta con documentos que soporten su rechazo súbalos aquí:',
        instructions: 'Subir archivo',
        classesWrapperInput: 'w-73 xs:w-full',
        classesWrapper: 'w-full',
        file,
        setFile,
        multiple: true,
        addFileText: 'nuevo archivo',
        fileExtensionAccept: '.jpg, .png, .jpeg, .pdf',
    };
};

/**
 * This function describe props the modal type
 *
 * @param showModal: boolean - Current state modal
 * @param setShowModal: Dispatch<SetStateAction<boolean>> - Change current state
 * @returns IModalTypeProps
 */
export const modalProps = (showModal: boolean, setShowModal: Dispatch<SetStateAction<boolean>>): IModalTypeProps => ({
    type: 'save',
    show: showModal,
    showModal: (): void => setShowModal(!showModal),
    title: 'Información',
    text: 'La información de su rechazo ha sido enviada con éxito.',
    withUpdateMessage: false,
});
/**
 *  Initial fields data
 */
export const initialInputs: IGenericRecord = {
    reason_rejection: [
        {
            id: '',
            code_credit_note: '',
            code_debit_note: '',
            description: '',
            required: true,
            label: true,
            temporary_id: uuid(),
        },
    ],
    observation: {
        value: '',
        required: true,
    },
};

export const buildOptionsRejections = (list: IGenericRecord[]): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];
    if (list?.length) {
        list.map(element => {
            listOptions.push({
                key: uuid(),
                value: element.name,
                id: element?.id,
                code: element.code_credit_note,
                unitMeasure: element?.code_debit_note,
            });
        });
    }
    return listOptions;
};
