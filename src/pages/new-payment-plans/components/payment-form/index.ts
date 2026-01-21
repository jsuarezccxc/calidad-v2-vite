import { IOptionSelect, IPropsInput } from '@components/input';
import { CREDIT_CARD } from '@constants/PaymentMethods';
import { TOOLTIP_DATA } from '@information-texts/PaymentPlans';
import { IGenericRecord } from '@models/GenericRecord';
import { Field, View, PaymentMethod as PaymentType } from '@models/PaymentPlans';
import { createArray } from '@utils/Array';
import { validateEmail } from '@utils/Validation';

export { PaymentForm } from './PaymentForm';
export { PaymentMethod } from './PaymentMethod';

/**
 * This interface describes the props of payment method
 *
 * @typeParam activateView: (view: View) => void - This function is used to change the active page
 * @typeParam data: IGenericRecord - data required to acquire the plan
 * @typeParam updateData: (data: IGenericRecord) => void - This is used to update plan data
 */
export interface IPaymentMethodProps {
    activateView: (view: View) => void;
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
}

/**
 * Interface that defines the properties for the Payment Form component.
 *
 * @typeParam data - The required information for acquiring the plan.
 * @typeParam updateData - A function to update the payment form data.
 * @typeParam validate - A boolean indicating whether the form fields are valid.
 * @typeParam handleInactivity - A function to handle user inactivity during the payment process.
 */
export interface IPaymentFormProps {
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
    validate: boolean;
    handleInactivity: () => void;
}

/**
 * This returns the props of each field
 *
 * @param data: IGenericRecord - Client data
 * @param validate: boolean - This indicates the time to validate the form
 * @returns { [key: string]: IPropsInput }
 */
export const getFieldProps = (data: IGenericRecord, validate = false): { [key: string]: IPropsInput | IGenericRecord } => {
    const {
        HolderDocumentNumber,
        CardCode,
        CardExpiration,
        CardType,
        Quotas,
        HolderEmail,
        Bank,
        Phone,
        Email,
        PersonType,
        TaxDetail,
        Responsibilities,
        HolderName,
        HolderDocumentType,
        CardNumber,
        ClientName,
        DocumentType,
        DocumentNumber,
        Address,
        CountryId,
        DepartmentId,
        CityId,
        PostalCode,
        DepartmentName,
        CityName,
        TypeTaxpayer,
    } = Field;

    return {
        [Bank]: {
            name: Bank,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            labelText: '*Seleccione el banco:',
            valueSelect: data?.[Bank],
            required: validate && !data[Bank],
            tooltip: TOOLTIP_DATA[Bank],
        },
        [ClientName]: {
            name: ClientName,
            placeholder: '...',
            classesWrapper: 'form-field',
            labelText: '*Nombre del cliente:',
            value: data?.[ClientName],
            required: validate && !data[ClientName],
            tooltip: TOOLTIP_DATA[ClientName],
            maxLength: FIELD_LENGTH[ClientName],
        },
        [DocumentType]: {
            name: DocumentType,
            labelText: '*Tipo de documento:',
            classesWrapper: 'form-field',
            value: data?.[DocumentType],
            required: validate && !data[DocumentType],
            tooltip: TOOLTIP_DATA[DocumentType],
        },
        [DocumentNumber]: {
            name: DocumentNumber,
            labelText: '*Número de documento:',
            placeholder: '...',
            value: data?.[DocumentNumber],
            required: validate && !data[DocumentNumber],
            onlyNumbers: true,
            tooltip: TOOLTIP_DATA[DocumentNumber],
            maxLength: FIELD_LENGTH[DocumentNumber],
        },
        [Address]: {
            name: Address,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[Address],
            required: validate && !data?.[Address],
            labelText: '*Dirección',
            tooltip: TOOLTIP_DATA[Address],
            maxLength: FIELD_LENGTH[Address],
        },
        [CountryId]: {
            name: CountryId,
            classesWrapper: 'form-field',
            labelText: '*País:',
            tooltip: TOOLTIP_DATA[CountryId],
            value: data?.[CountryId],
            required: validate && !data?.[CountryId],
            placeholder: 'Seleccionar',
        },
        [DepartmentId]: {
            name: DepartmentId,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            valueSelect: data?.[DepartmentId],
            required: validate && !data?.[DepartmentId],
            labelText: '*Departamento:',
            tooltip: TOOLTIP_DATA[DepartmentId],
            disabled: !data?.[CountryId],
        },
        [DepartmentName]: {
            name: DepartmentName,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[DepartmentName],
            required: validate && !data?.[DepartmentName],
            labelText: '*Departamento:',
            tooltip: TOOLTIP_DATA[DepartmentId],
            disabled: !data?.[CountryId],
        },
        [CityId]: {
            name: CityId,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            valueSelect: data?.[CityId],
            required: validate && !data?.[CityId],
            labelText: '*Ciudad:',
            tooltip: TOOLTIP_DATA[CityId],
            disabled: !data?.[DepartmentId],
        },
        [CityName]: {
            name: CityName,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[CityName],
            required: validate && !data?.[CityName],
            labelText: '*Ciudad:',
            tooltip: TOOLTIP_DATA[CityId],
            disabled: !data?.[CountryId],
        },
        [PostalCode]: {
            name: PostalCode,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[PostalCode],
            required: validate && !data?.[PostalCode],
            labelText: '*Código postal:',
            onlyNumbers: true,
            tooltip: TOOLTIP_DATA[PostalCode],
            maxLength: FIELD_LENGTH[PostalCode],
        },
        [Phone]: {
            name: Phone,
            classesWrapper: 'form-field',
            placeholder: '...',
            value: data?.[Phone],
            required: validate && !data?.[Phone],
            labelText: '*Teléfono:',
            onlyNumbers: true,
            tooltip: TOOLTIP_DATA[Phone],
            maxLength: FIELD_LENGTH[Phone],
        },
        [Email]: {
            name: Email,
            classesWrapper: 'form-field',
            placeholder: '...',
            value: data?.[Email],
            required: validate && !validateEmail(data?.[Email]),
            labelText: '*Correo electrónico:',
            tooltip: TOOLTIP_DATA[Email],
            limitCharacters: false,
            requiredText: data?.[Email] ? !validateEmail(data[Email]) && '*Ingrese un email válido' : '*Campo obligatorio',
        },
        [HolderEmail]: {
            name: HolderEmail,
            placeholder: '...',
            classesWrapper: 'form-field',
            value: data?.[HolderEmail],
            required: validate && !validateEmail(data?.[HolderEmail]),
            labelText: '*Correo electrónico:',
            limitCharacters: false,
            requiredText: data?.[HolderEmail]
                ? !validateEmail(data[HolderEmail]) && '*Ingrese un email válido'
                : '*Campo obligatorio',
        },
        [PersonType]: {
            name: PersonType,
            classesWrapper: 'form-field',
            value: data?.[PersonType],
            required: validate && !data?.[PersonType],
            labelText: '*Tipo de contribuyente:',
            tooltip: TOOLTIP_DATA[PersonType],
        },
        [TaxDetail]: {
            name: TaxDetail,
            classesWrapper: 'form-field',
            value: data?.[TaxDetail],
            required: validate && !data?.[TaxDetail],
            labelText: '*Detalle de impuesto:',
            tooltip: TOOLTIP_DATA[TaxDetail],
            disabled: !data?.[PersonType],
        },
        [Responsibilities]: {
            name: Responsibilities,
            classesWrapper: 'form-field',
            value: data?.[Responsibilities],
            labelText: '*Responsabilidad fiscal:',
            tooltip: TOOLTIP_DATA[TaxDetail],
        },
        [HolderName]: {
            name: HolderName,
            placeholder: '...',
            classesWrapper: 'form-field',
            labelText: '*Nombre del titular:',
            value: data?.[HolderName],
            required: validate && !data[HolderName],
            maxLength: FIELD_LENGTH[HolderName],
        },
        [HolderDocumentType]: {
            name: HolderDocumentType,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            labelText: '*Tipo de documento:',
            value: data?.[HolderDocumentType],
            required: validate && !data[HolderDocumentType],
        },
        [HolderDocumentNumber]: {
            name: HolderDocumentNumber,
            placeholder: '...',
            labelText: '*Número de documento:',
            value: data?.[HolderDocumentNumber],
            required: validate && !data[HolderDocumentNumber],
            onlyNumbers: true,
            maxLength: FIELD_LENGTH[HolderDocumentNumber],
        },
        [TypeTaxpayer]: {
            name: TypeTaxpayer,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            labelText: '*Tipo de contribuyente:',
            value: data?.[TypeTaxpayer],
            required: validate && !data[TypeTaxpayer],
        },
        [CardNumber]: {
            name: CardNumber,
            placeholder: '...',
            classesWrapper: 'form-field',
            labelText: '*Número de la tarjeta:',
            value: data?.[CardNumber],
            required: validate && !data[CardNumber],
            onlyNumbers: true,
            maxLength: FIELD_LENGTH[CardNumber],
        },
        [CardCode]: {
            name: CardCode,
            placeholder: '...',
            classesWrapper: 'form-field',
            labelText: '*Código de seguridad:',
            value: data?.[CardCode],
            required: validate && !data[CardCode],
            onlyNumbers: true,
            maxLength: FIELD_LENGTH[CardCode],
        },
        [CardType]: {
            name: CardType,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            labelText: '*Tipo de tarjeta:',
            value: data?.[CardType],
            required: validate && !data[CardType],
        },
        [Quotas]: {
            name: Quotas,
            placeholder: 'Seleccionar',
            classesWrapper: 'form-field',
            labelText: '*Cuotas:',
            value: data?.[Quotas],
            required: validate && data?.card_type_key === CREDIT_CARD && !data[Quotas],
        },
        [CardExpiration]: {
            placeholder: 'dd/mm/aaaa',
            labelText: '*Fecha de vencimiento:',
            name: CardExpiration,
            selected: data?.[CardExpiration],
            required: validate && !data?.[CardExpiration],
            minDate: new Date(),
            maxDate: new Date(2100, 11, 31),
        },
    };
};

/**
 * This returns the payment options for credit cards
 *
 * @returns IOptionSelect[]
 */
export const getPaymentInstallments = (): IOptionSelect[] => {
    return createArray(48).map((item, index) => ({
        key: `option${index}`,
        value: String(item),
    }));
};

/**
 * Payment methods
 */
export const PAYMENT_METHODS = [
    { name: PaymentType.Card, label: 'Tarjeta de crédito/débito', labelClass: 'card' },
    { name: PaymentType.Pse, label: 'PSE', labelClass: 'pse' },
];

/**
 * This is used to select payment method
 */
export const CARD = 'CARD';

/**
 * This is used to store the ide of the fields that need it
 */
export const ID_KEY: { [key: string]: string } = {
    [Field.DocumentType]: 'document_type_id',
    [Field.CountryId]: 'country_name',
    [Field.DepartmentId]: 'department_name',
    [Field.CityId]: 'city_name',
    [Field.CardType]: 'card_type_key',
    [Field.TaxDetail]: 'tax_detail_code',
    [Field.PersonType]: 'person_type_id',
    [Field.Bank]: 'bank_code',
    [Field.TypeTaxpayer]: 'type_taxpayer_id',
};

/**
 * This is used to clean up the fields related to each location
 */
export const EMPTY_LOCATION_FIELDS: { [key: string]: IGenericRecord } = {
    [Field.CountryId]: {
        city_id: '',
        city_name: '',
        department_name: '',
        department_id: '',
    },
    [Field.DepartmentId]: {
        city_id: '',
        city_name: '',
        department_name: '',
    },
    [Field.CityId]: {
        city_id: '',
        city_name: '',
    },
};

/**
 * Maximum length of each field
 */
export const FIELD_LENGTH: { [key: string]: number } = {
    [Field.ClientName]: 100,
    [Field.DocumentNumber]: 20,
    [Field.Address]: 100,
    [Field.PostalCode]: 6,
    [Field.Phone]: 20,
    [Field.Email]: 30,
    [Field.HolderName]: 100,
    [Field.HolderDocumentNumber]: 20,
    [Field.HolderEmail]: 30,
    [Field.CardNumber]: 30,
    [Field.CardCode]: 3,
};

/**
 * This is used to clean up the fields related to type taxpayer
 */
export const RESET_FIELDS: Record<string, Record<string, string>> = {
    [Field.HolderDocumentType]: {
        type_taxpayer_id: '',
        type_taxpayer_name: '',
    },
    [Field.DocumentType]: {
        person_type_id: '',
        person_type: '',
    },
};
