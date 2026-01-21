import helpOne from '@assets/images/help-one.svg';
import helpTwo from '@assets/images/help-two.svg';
import helpThree from '@assets/images/help-three.svg';
import phone from '@assets/images/help-phone.svg';
import email from '@assets/images/help-email.svg';
import location from '@assets/images/help-location.svg';
import { IFile } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { Help } from '@models/HelpCenter';
import { FILE_INDEX } from '@constants/File';

export { Advisory } from './Advisory';
export { Contact } from './Contact';
export { ContactTemplate } from './ContactTemplate';
export { Definitions } from './definitions';
export { InstructionCards } from './InstructionCards';

/**
 * This returns the request data
 *
 * @param data: IGenericRecord - Contact data
 * @param file: IFile - Support file
 * @returns IGenericRecord
 */
export const getRequestData = (data: IGenericRecord, file: IFile): IGenericRecord => {
    const uploadedFile = file[FILE_INDEX]?.files;
    return { ...data, ...(!!uploadedFile.length && { file: uploadedFile }) };
};

/**
 * Instructions for showing cards
 */
export const INSTRUCTIONS: { image: string; title: string; description: string; help: Help }[] = [
    {
        image: helpOne,
        title: 'Gestióne fácil y rápido diggi pymes',
        description: 'Encuentre las definiciones y preguntas frecuentes e instrucciones para manejar diggi pymes.',
        help: Help.Definitions,
    },
    {
        image: helpTwo,
        title: 'Contáctenos para soluciones eficientes',
        description: 'Nuestro equipo está disponible para ayudarlo y acompañarlo con cualquier duda que tenga.',
        help: Help.Contact,
    },
    {
        image: helpThree,
        title: 'Reciba asesoría personalizada para su empresa',
        description:
            'Nuestro equipo de expertos ofrece consultoría personalizada  y de calidad en el área que su empresa necesite',
        help: Help.Advisory,
    },
];

/**
 * Company contact details
 */
export const CONTACT_DATA = [
    {
        image: phone,
        value: '317 441 1845',
    },
    {
        image: email,
        value: 'ventas@ccxc.co',
    },
    {
        image: location,
        value: 'Calle 26 # 68C-61',
    },
];

/**
 * It is used to validate the fields of the forms
 */
export const REQUIRED_CONTACT_FIELDS = ['data[type_name]', 'data[full_name]', 'data[email]', 'data[description]'];

/**
 * Initial value of the contact data
 */
export const DEFAULT_CONTACT = { ['data[affair]']: 'PQRSF' };

/**
 * Initial value of the advisory data
 */
export const DEFAULT_ADVISORY = { ['data[affair]']: 'CONSULTING' };

/**
 * Initial value of the file
 */
export const DEFAULT_FILE = [{ name: 'file', files: [] }];

/**
 * Length of fields
 */
export const FIELD_LENGTH = {
    NAME: 240,
    PHONE: 10,
    EMAIL: 240,
    DESCRIPTION: 500,
};
