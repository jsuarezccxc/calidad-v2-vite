import {
    setCompany,
    setDocumentTypes,
    setCountries,
    setDepartments,
    setCities,
    setCountryDepartments,
    setDepartmentCities,
    setCiius,
	setResponsibilities,
    setError,
} from './actions';
import { ActionKeys } from './types';

const information = {
    id: 'd0b4483b-d794-36e1-8198-34d1a0caab1b',
    name: 'CCxC',
    person_type: 'LEGAL_PERSON',
    document_type: '3e8cbaec-5d4c-3328-9c86-961d47b613a0',
    document_number: '901.084.754-3',
    company_representative_name: 'Laura Alvarez',
    ciiu: null,
    phone: 7943044,
    country_id: '9361bf63-87ea-3d1c-ba35-15ff851478e8',
    country_name: null,
    department_id: '138e2405-65ea-31a2-9cb2-1d6590a476c5',
    department_name: null,
    city_id: '25f64ff2-876b-30a3-ad9b-315fd92684b2',
    city_name: null,
    postal_code: '111111',
    address: 'Cra 13 # 94a-26 Of. 301',
    domain: 'app-famiefi-ccxc.co',
    make_web_page_type: 'LEGAL_PERSON',
    brand_established_service: false,
    accept_company_privacy: true,
    company_privacy_acceptation_date: 1628726400,
    created_at: false,
    updated_at: false,
	ciiu_id: '',
	ciiu_code: '',
	whatsapp: '',
	fiscal_responsibility: '',
    memberships: [],
};

const document_types = [
    {
        id: '88c0d5ab-3648-39f5-a7c4-016c5aec4d1a',
        name: 'CC',
        description: 'Cédula de ciudadanía',
        created_at: null,
        updated_at: null,
    },
    {
        id: '46257099-caaa-35cf-abf6-6031a6e67170',
        name: 'CE',
        description: 'Cédula de extranjeria',
        created_at: null,
        updated_at: null,
    },
    {
        id: '47b968f0-fb0c-35c3-8a74-ec4344406bda',
        name: 'NIT',
        description: 'Número de identificación tributaria',
        created_at: null,
        updated_at: null,
    },
    {
        id: 'fc2a647b-c8b4-313f-b799-d5f883ff55e1',
        name: 'RUT',
        description: 'Registro único tributario',
        created_at: null,
        updated_at: null,
    },
];

const countries = [
    {
        id: '1',
        name: 'Afganistán',
        code:
            'AF                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '2',
        name: 'Åland',
        code:
            'AX                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '3',
        name: 'Albania',
        code:
            'AL                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '4',
        name: 'Alemania',
        code:
            'DE                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '5',
        name: 'Andorra',
        code:
            'AD                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
];

const cities = [
    {
        id: '1',
        name: 'Medellín',
        code:
            '05001                                                                                                                                                                                                                                                          ',
        description: null,
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '2',
        name: 'Abejorral',
        code:
            '05002                                                                                                                                                                                                                                                          ',
        description: null,
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '3',
        name: 'Abriaquí',
        code:
            '05004                                                                                                                                                                                                                                                          ',
        description: null,
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '4',
        name: 'Alejandría',
        code:
            '05021                                                                                                                                                                                                                                                          ',
        description: null,
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '5',
        name: 'Amagá',
        code:
            '05030                                                                                                                                                                                                                                                          ',
        description: null,
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
];

const departments = [
    {
        id: '1',
        name: 'Amazonas',
        code:
            '91                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '2',
        name: 'Antioquia',
        code:
            '05                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '3',
        name: 'Arauca',
        code:
            '81                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
    {
        id: '4',
        name: 'Atlántico',
        code:
            '08                                                                                                                                                                                                                                                             ',
        created_at: '2021-06-11T16:10:07.000000Z',
        updated_at: '2021-06-11T16:10:07.000000Z',
    },
];

const ciius = [
    {
        id: '1',
        name: 'Cultivos agrícolas transitorios.',
        code: '011',
        created_at: null,
        updated_at: null,
    },
    {
        id: '2',
        name:
            'Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas.',
        code: '0111',
        created_at: null,
        updated_at: null,
    },
    {
        id: '3',
        name: 'Cultivo de arroz.',
        code: '0112',
        created_at: null,
        updated_at: null,
    },
];

test('It should set up data detail company', () => {
    const action = setCompany(information);

    expect(action).toEqual({
        type: ActionKeys.SET_COMPANY,
        information: information,
    });
});

test('It should set up data document types', () => {
    const action = setDocumentTypes(document_types);

    expect(action).toEqual({
        type: ActionKeys.SET_DOCUMENT_TYPES,
        document_types: document_types,
    });
});

test('It should set up data countries', () => {
    const action = setCountries(countries);

    expect(action).toEqual({
        type: ActionKeys.SET_COUNTRIES,
        countries: countries,
    });
});

test('It should set up data departments', () => {
    const action = setDepartments(departments);

    expect(action).toEqual({
        type: ActionKeys.SET_DEPARTMENTS,
        departments: departments,
    });
});
test('It should set up data cities', () => {
    const action = setCities(cities);

    expect(action).toEqual({
        type: ActionKeys.SET_CITIES,
        cities: cities,
    });
});

test('It should set up data departments for country', () => {
    const action = setCountryDepartments(departments);

    expect(action).toEqual({
        type: ActionKeys.SET_COUNTRY_DEPARTMENTS,
        country_departments: departments,
    });
});

test('It should set up data cities for department', () => {
    const action = setDepartmentCities(cities);

    expect(action).toEqual({
        type: ActionKeys.SET_DEPARTMENT_CITIES,
        department_cities: cities,
    });
});

test('It should set up data ciuus', () => {
    const action = setCiius(ciius);

    expect(action).toEqual({
        type: ActionKeys.SET_CIIUS,
        ciius: ciius,
    });
});

test('It should set up data responsabilities', () => {
	const responsibilities = [
		{
			name: 'Aporte especial para la administración de justicia',
			code: '1',
		},
	];
    const action = setResponsibilities(responsibilities);

    expect(action).toEqual({
        type: ActionKeys.SET_RESPONSIBILITIES,
        responsibilities: responsibilities,
    });
});

test('It should set up error with data company', () => {
    const action = setError('Fallo interno del servidor');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
        error: 'Fallo interno del servidor',
    });
});
