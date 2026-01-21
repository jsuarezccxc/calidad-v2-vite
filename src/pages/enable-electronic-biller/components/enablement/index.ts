import { IFile } from '@components/input';
import { SIGNER_ROLE } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMultipleCodes } from '@utils/ElectronicInvoice';
import { currentDateInUnix } from '@utils/Date';
import { encryptText } from '@utils/Encrypt';

export { Enablement } from './Enablement';
export { TestSetID } from '../enablement/TestSetID';

/**
 * This interface describes the props fo the test set id
 *
 * @typeParam currentStep: number - This indicates the current step
 * @typeParam data: IGenericRecord - Certificate data
 * @typeParam file: IFile - Certificate file
 * @typeParam updateFile: (file: IFile) => void - Function to update the certificate file
 * @typeParam updateData: (data: IGenericRecord) => void - Function to handle data change
 * @typeParam saveCertificate: () => Promise<void> - Function used to save the certificate
 * @typeParam validate: boolean - This indicates when to validate the fields
 * @typeParam includesCertificate: boolean - This indicates if user includes certificate
 * @typeParam setCertificate: (certificate: string) => void - Manages the state  indicates if user includes certificate or is updated
 * @typeParam certificate: string - This state  indicates if user includes certificate or is updated
 * @typeParam handleValidFormatFile: (validation: boolean) => void - Optional function to validate format valid file
 */
export interface ITestSetID {
    currentStep: number;
    data: IGenericRecord;
    file: IFile;
    updateFile: (file: IFile) => void;
    updateData: (data: IGenericRecord) => void;
    saveCertificate: () => Promise<void>;
    validate: boolean;
    includesCertificate: boolean;
    setCertificate: (certificate: string) => void;
    certificate: string;
    handleValidFormatFile: (validation: boolean) => void;
}

/**
 * This contains each of the types of certificate
 */
export enum Certificate {
    Gratuitous = 'GRATUITOUS',
    Own = 'OWN',
}

/**
 * Function that formats the certificate request
 *
 * @param data: IGenericRecord - Certificate data
 * @returns IGenericRecord
 */
export const formatCertificateRequest = ({
    certificateInfo,
    information,
    infoCustomQuery,
    data,
    includesCertificate,
}: IGenericRecord): IGenericRecord => ({
    test_set_id: data?.testSetID || certificateInfo?.test_set_id,
    certificate_policy_acceptation_date: certificateInfo?.certificate_policy_acceptation_date ?? currentDateInUnix(),
    ...(!includesCertificate && { password_certificate: encryptText(data?.password ?? certificateInfo?.password_certificate) }),
    signer_role: data.certificate === Certificate.Gratuitous ? SIGNER_ROLE.THIRD_PARTY : SIGNER_ROLE.SUPPLIER,
    document_number: information?.document_number,
    email: information?.email,
    social_reason: certificateInfo?.social_reason ?? information?.name,
    telephone: information?.phone,
    economic_activity: information?.ciius?.map((item: IGenericRecord) => item.code).join(','),
    identifier_organization: IDENTIFIER_ORGANIZATION[information?.person_type],
    responsibilities: formatMultipleCodes(information?.fiscal_responsibilities, true),
    city_code: infoCustomQuery?.city?.code,
    city_name: information?.city_name,
    postal_code: information?.postal_code,
    state_name: information?.department_name,
    state_code: infoCustomQuery?.department?.code,
    tax_id: infoCustomQuery?.tax_detail?.code,
    tax_name: infoCustomQuery?.tax_detail?.name,
    address_line: information?.address,
    document_name: information?.document_type_name,
});

/**
 * Function that returns the custom queries
 *
 * @param companyData: IGenericRecord | null - Company data
 * @returns IGenericRecord[]
 */
export const getCustomQueries = (companyData: IGenericRecord | null): IGenericRecord[] => [
    {
        model: 'Department',
        constraints: [
            {
                field: 'id',
                operator: '=',
                parameter: companyData?.department_id,
            },
        ],
        fields: ['code', 'name'],
        multiple_record: false,
    },
    {
        model: 'City',
        constraints: [
            {
                field: 'id',
                operator: '=',
                parameter: companyData?.city_id,
            },
        ],
        fields: ['code', 'name'],
        multiple_record: false,
    },
    {
        model: 'TaxDetail',
        constraints: [
            {
                field: 'id',
                operator: '=',
                parameter: companyData?.tax_detail,
            },
        ],
        fields: ['code', 'name'],
        multiple_record: false,
    },
];

/**
 * This is used to obtain the identifier organization according to the type of person
 */
const IDENTIFIER_ORGANIZATION: { [key: string]: string } = {
    LEGAL_PERSON: '1',
    NATURAL_PERSON: '2',
};

/**
 * This is the step of the test set id
 */
export const ID_STEP = 4;

/**
 * This is the step of certificate id
 */
export const CERTIFICATE_STEP = 5;

/**
 * This is used to define the type of file uploaded
 */
export const CERTIFICATE = 'certificate';

/**
 * This constant represent signer role of supplier
 */
export const SUPPLIER = 'supplier';

/**
 * This constant represents the type for digital signature file
 */
export const FILE_TYPE = 'application/octet-stream';
