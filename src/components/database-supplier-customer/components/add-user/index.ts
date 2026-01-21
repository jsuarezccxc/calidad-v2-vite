import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { IEntity } from '@components/radiobutton';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupplierExistResponse } from '@models/Supplier';
import { SUPPLIER_DATABASE } from '@information-texts/SupplierDatabase';
import { getRoute, getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';

export * from './AddUser';

/**
 * Routes bread crumb pages
 *
 * @param lastItem: string - Text last item
 * @param mainItem: string - Text main item
 * @param route: string - Text route
 * @returns Section[]
 */
export const routesAddSupplier = (lastItem = '', mainItem = '', route = '#'): Section[] => {
    return [
        {
            name: getRouteName(Routes.DATABASE_MENU),
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: `Ficha técnica de ${mainItem}`,
            route: route,
        },
        {
            name: lastItem,
            route: '#',
        },
    ];
};

/**
 * This interface describes the properties component add user
 *
 * @typeParam isSupplierEdit: boolean - If you are an edited user
 * @typeParam saveUser: (data: IUserData | IGenericRecord) => void - Save user function
 * @typeParam title: { singular: string; plural: string } - Page titles
 * @typeParam pageRoute: string - Page route
 * @typeParam showModalSave: boolean - Open modal save user
 * @typeParam setShowModalSave:React.Dispatch<React.SetStateAction<boolean>> - Function open modal save user
 * @typeParam editData: IUserData | IGenericRecord; - Optional edited user data
 * @typeParam handleAddSupplier:(param: string) => void - Function to send add client
 * @typeParam handleSetSupplierEdit: (id: string) => void - Function to send edit supplier
 * @typeParam editUser: () => void - Edit client existent
 */
export interface IAddSupplierProps {
    isSupplierEdit: boolean;
    saveUser: (data: IUserData | IGenericRecord) => void;
    title: { singular: string; plural: string };
    pageRoute: string;
    showModalSave: boolean;
    setShowModalSave: React.Dispatch<React.SetStateAction<boolean>>;
    editData?: IUserData | IGenericRecord;
    handleAddSupplier: (param: string) => void;
    handleSetSupplierEdit: (id: string) => void;
    editUser: () => void;
}

/**
 * This interface describes the properties for supplier
 *
 * @typeParam id: string - Id supplier
 * @typeParam name: string - Name supplier
 * @typeParam document_type: string - Document type supplier
 * @typeParam document_number: string - Document number supplier
 * @typeParam document_name: string - Document name supplier
 * @typeParam address: string - Address supplier
 * @typeParam email: string - Email supplier
 * @typeParam country_id: string | number - Country id supplier
 * @typeParam country_name: string - Country name supplier
 * @typeParam department_id: string | number => void - Department id supplier
 * @typeParam department_name: string - Department name supplier
 * @typeParam city_id: number - City id supplier
 * @typeParam client_id: string - Indicates Id reference clients
 * @typeParam city_name: string - City name supplier
 * @typeParam postal_code: string - Postal code supplier
 * @typeParam phone: string - Phone supplier
 * @typeParam type_taxpayer_id: number - Type taxpayer id supplier
 * @typeParam type_taxpayer_name: string - Type taxpayer name supplier
 * @typeParam fiscal_responsibilities: IGenericRecord[] - Fiscal responsibility supplier
 * @typeParam tax_details_code: number - Tax details code supplier
 * @typeParam tax_details_name: string - Tax details name supplier
 * @typeParam tax_details_id: string - Tax details id supplier
 * @typeParam customerId: string - Optional customer id
 * @typeParam customerClientId: string - Optional customer client id
 * @typeParam supplier_id: string - Optional supplier client id
 * @typeParam cellphone: string - Optional cellphone client
 * @typeParam name_legal_representative: string | null - Name legal representative
 */
export interface IUserData {
    id: string;
    name: string;
    document_type: string;
    document_number: string;
    document_name: string;
    address: string;
    email: string;
    country_id: number;
    country_name: string;
    department_id: number;
    department_name: string;
    city_id: number;
    city_name: string;
    client_id: string;
    postal_code: string;
    phone: string;
    type_taxpayer_id: number;
    type_taxpayer_name: string;
    fiscal_responsibilities: IFiscalResponsibilities[];
    tax_details_code: number;
    tax_details_name: string;
    tax_details_id: string;
    customerId?: string;
    customerClientId?: string;
    supplier_id?: string;
    cellphone?: string;
    name_legal_representative: string | null;
}

/**
 * This interface describes the properties for add supplier
 *
 * @typeParam id_fiscal: string - Id fiscal
 * @typeParam id: number - Id option
 * @typeParam name: string - Name fiscal
 */
export interface IFiscalResponsibilities {
    id_fiscal: string;
    id: string;
    name: string;
}

/**
 * Options used to select whether the product has variants
 */
export const getEntitiesUser = (user = ''): IEntity[] => [
    {
        name: 'ADD_DIGGI_PYMES',
        label: `Agregar ${user} desde diggi pymes`,
    },
    {
        name: 'ADD_EXCEL',
        label: `Agregar ${user} a través de Excel`,
    },
];

/**
 * Const to manage supplier initial values
 */
export const SUPPLIER_INITIAL = {
    id: '',
    name: '',
    email: '',
    person_id: '',
    document_name: '',
    document_type: '',
    document_number: '',
    address: '',
    country_id: 46,
    country_name: 'Colombia',
    department_id: 0,
    department_name: '',
    city_id: 0,
    city_name: '',
    postal_code: '',
    phone: '',
    type_taxpayer_id: 0,
    type_taxpayer_name: '',
    fiscal_responsibilities: [{ id_fiscal: uuid(), id: '', name: '', date: new Date() }],
    tax_details_code: 0,
    tax_details_id: '',
    tax_details_name: '',
    name_legal_representative: '',
};

/**
 * Keys used to obtain the data used in the supplier form
 */
export const SUPPLIER_UTILS = [
    'fiscal_responsibilities',
    'document_types',
    'countries',
    'departments',
    'cities',
    'tax_details',
    'type_tax_payer',
];

/**
 * This key select
 */
export const KEY_SELECT_INPUT: { [key: string]: string } = {
    tax_details_code: 'tax_details_name',
    document_type: 'document_name',
    tax_details_id: 'tax_details_name',
    type_taxpayer_id: 'type_taxpayer_name',
};

/**
 * This key select
 */
export const KEY_SELECT_INPUT_NAME: { [key: string]: string } = {
    city_id: 'city_name',
    country_id: 'country_name',
    department_id: 'department_name',
};

/**
 * This select add supplier
 */
export const SelectAddSupplier = {
    AddDiggiPymes: 'ADD_DIGGI_PYMES',
    AddExcel: 'ADD_EXCEL',
};

/**
 * Keys used to obtain the data used in the supplier form
 */
export const SupplierName = {
    FiscalResponsibilities: 'fiscal_responsibilities',
    DocumentType: 'document_type',
    CountryId: 'country_id',
    DepartmentId: 'department_id',
    CityId: 'city_id',
    TaxDetailsId: 'tax_details_code',
    TypeTaxpayerId: 'type_taxpayer_id',
};

/**
 * Constant colombia id
 */
export const COLOMBIA_ID = 46;

/**
 * Constant fiscal responsibilities
 */
export const FISCAL_RESPONSIBILITIES = 'fiscal_responsibilities';

/**
 * User tooltip properties
 */
export const TOOLTIP_PROPS: { [key: string]: IGenericRecord } = {
    proveedor: {
        name: { title: 'Nombre del proveedor:', description: 'Es el nombre del proveedor.' },
        documentType: { title: 'Tipo de documento:', description: 'Es el tipo de identificación del proveedor.' },
        documentNumber: { title: 'Número de documento:', description: 'Es el número de identificación del proveedor.' },
        address: { title: 'Dirección:', description: 'Donde esta ubicada la empresa' },
        country: { title: 'País:', description: 'Ubicación geográfica del proveedor.' },
        department: { title: 'Departamento:', description: 'Es el departamento o estado donde está ubicada la empresa' },
        city: { title: 'Ciudad:', description: 'Es la ciudad donde está ubicada la empresa.' },
        postalCode: {
            title: 'Código postal:',
            description: 'Es la combinación de números que representa la zona en la que está ubicado el cliente.',
        },
        phone: { title: 'Teléfono:', description: 'Es número de teléfono fijo o celular del proveedor.' },
        typeTaxpayer: { title: '', description: SUPPLIER_DATABASE.TOOLTIP_TYPE_TAXPAYER },
        taxDetails: {
            title: 'Detalle de impuestos:',
            description:
                'es el atributo al que el contribuyente está obligado a facturar, Se encuentra en la casilla 53 del RUT.',
        },
        responsibility: {
            title: 'Responsabilidad fiscal:',
            description:
                'Es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla 53 del RUT.',
        },
    },
    cliente: {
        name: { title: 'Nombre del cliente:', description: 'Es el nombre del cliente.' },
        documentType: { title: 'Tipo de documento:', description: 'Es el tipo de identificación del cliente.' },
        documentNumber: { title: 'Número de documento:', description: 'Es el número de identificación del cliente.' },
        address: { title: 'Dirección:', description: 'Dirección de residencia del cliente.' },
        country: { title: 'País:', description: 'Ubicación geográfica del cliente.' },
        department: { title: 'Departamento:', description: 'Es el departamento o estado donde está ubicado el cliente.' },
        city: { title: 'Ciudad:', description: 'Es la ciudad donde está ubicado el cliente.' },
        postalCode: {
            title: 'Código postal:',
            description: 'Es la combinación de números que representa la zona en la que está ubicado el cliente.',
        },
        phone: { title: 'Teléfono:', description: 'Es el número de teléfono fijo o celular del cliente.' },
        typeTaxpayer: { title: '', description: SUPPLIER_DATABASE.TOOLTIP_TYPE_TAXPAYER },
        taxDetails: {
            title: 'Detalle de impuestos:',
            description:
                'es el atributo al que el contribuyente está obligado a facturar, Se encuentra en la casilla 53 del RUT.',
        },
        responsibility: {
            title: 'Responsabilidad fiscal:',
            description:
                'Es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla 53 del RUT.',
        },
    },
};

/**
 * Constant zero file
 */
export const ZERO_FILE = 0;

/**
 * Constant max length text
 */
export const MAX_LENGTH_TEXT = 240;

/**
 * Constant max length document number
 */
export const MAX_LENGTH_DOCUMENT_NUMBER = 12;

/**
 * Constant max length number
 */
export const MAX_LENGTH_NUMBER_CO = 10;

/**
 * Constant max length number
 */
export const MAX_LENGTH_NUMBER = 12;

/**
 * Constant name input
 */
export const NAME_INPUT = 'name';

/**
 * Select default option
 */
export const SELECT_DEFAULT = {
    id: '',
    name: 'Seleccionar',
    code: '',
    value: '',
};

/**
 * Constant option select
 */
export const SELECT = 'Seleccionar';

/**
 * List ids fiscal responsibilities natural person
 */
export const IDS_FISCAL_RESPONSIBILITIES = [4, 5];

/**
 * Constant natural person
 */
export const NATURAL_PERSON = 'Persona natural';

/**
 * This is used to make a comparison
 */
export const DATE = 'date';

/**

 * Query param value
 */
export const ADD_USER = 'add-customer';

/**
 * Return errors
 * @param validation: string - Description validation error
 * @returns string - Text validation
 */
export const validationText = (validation: string): string =>
    validation
        ? `Errores detectados en el archivo cargado debido a formatos incorrectos, datos faltantes e información inválida en los siguientes campos (${validation} )`
        : '¡Validación Exitosa! El archivo cargado ha sido validado con éxito y no contiene errores.';

/**
 * Codes and names of fiscal responsibilities
 */
export const FISCAL_RESPONSIBILITY_CODES = {
    GC: 'O-13',
    SELF_RETAINING: 'O-15',
    VAT_AGENT: 'O-23',
    SIMPLE_REGIME: 'O-47',
    NOT_APPLICABLE: 'R-99-PN',
} as const;

/**
 * Complete names for fiscal responsibilities
 */
export const FISCAL_RESPONSIBILITY_NAMES = {
    [FISCAL_RESPONSIBILITY_CODES.GC]: 'Gran contribuyente',
    [FISCAL_RESPONSIBILITY_CODES.SELF_RETAINING]: 'Autorretenedor',
    [FISCAL_RESPONSIBILITY_CODES.VAT_AGENT]: 'Agente de retención IVA',
    [FISCAL_RESPONSIBILITY_CODES.SIMPLE_REGIME]: 'Régimen simple de tributación SIMPLE',
    [FISCAL_RESPONSIBILITY_CODES.NOT_APPLICABLE]: 'No aplica - Otros',
} as const;

/**
 * Types of withholdings
 */
export const WITHHOLDING_TYPES = {
    VAT: 'IVA',
    ICA: 'ICA',
    SOURCE: 'Fuente',
} as const;

/**
 * Code for which the resolution number is required
 */
export const RESOLUTION_REQUIRED_PREFIXES = [
    FISCAL_RESPONSIBILITY_CODES.GC,
    FISCAL_RESPONSIBILITY_CODES.SELF_RETAINING,
    FISCAL_RESPONSIBILITY_CODES.VAT_AGENT,
] as const;

/**
 * This interface is to customner response
 *
 * @typeParam customer: IGenericRecord - Customer data
 */
export interface ICustomerExistResponse extends Omit<ISupplierExistResponse, 'supplier'> {
    customer: IGenericRecord;
}

/**
 * This interface represents the validation result for a customer or supplier.
 *
 * @typeParam response: ICustomerExistResponse | ISupplierExistResponse - The validation response data.
 * @typeParam file: keyof IUserData - The field from the user data that was validated.
 * @typeParam email: string - The email of the user being validated.
 */
export interface IValidateResponse {
    response: ICustomerExistResponse | ISupplierExistResponse;
    file: keyof IUserData;
    email: string;
}

/**
 * This constant represents the type of taxpayer name.
 */
export const TYPE_TAXPAYER_NAME = 'type_taxpayer_name';

/**
 * This constant defines the required fields for a user in the add user form.
 */
export const REQUIRED_FIELDS = ['name', 'document_type', 'document_number', TYPE_TAXPAYER_NAME, 'email'];
