import {
    setHistory,
    setMembershipTypes,
    failedMembership,
    setMembershipSelected,
    setModulesMembership,
} from './actions';
import { ActionKeys } from './types';

test('It should set up data from membership data', () => {
    const membership = {
        id: '5ccb1dd4-9afd-4f0e-826b-5acd1f2aec4f',
        name: 'Test',
        type_membership_id: '4c74deca-d528-11eb-b8bc-0242ac130009',
        purchase_date: 1640822400,
        initial_date: 1640822400,
        expiration_date: 1640822400,
        is_active: true,
        company_id: '04380323-a079-4939-960e-39b3c8361c16',
        payment_status: 'Pendiente integración',
        payment_method: 'Pendiente integración',
        total: 0,
        created_at: 1640822400,
        updated_at: 1640822400,
    };

    const history = [
        {
            id: '5ccb1dd4-9afd-4f0e-826b-5acd1f2aec4f',
            name: 'Test 1',
            type_membership_id: '4c74deca-d528-11eb-b8bc-0242ac130009',
            purchase_date: 1640822400,
            initial_date: 1640822400,
            expiration_date: 1640822400,
            is_active: true,
            company_id: '04380323-a079-4939-960e-39b3c8361c16',
            payment_status: 'Pendiente integración',
            payment_method: 'Pendiente integración',
            total: 0,
            created_at: 1640822400,
            updated_at: 1640822400,
        },
        {
            id: 'bcc4f706-d8f1-11eb-b8bc-0242ac130003',
            name: 'Test 2',
            type_membership_id: '4c74deca-d528-11eb-b8bc-0242ac130009',
            purchase_date: 1640822400,
            initial_date: 1640822400,
            expiration_date: 1640822400,
            is_active: false,
            company_id: '04380323-a079-4939-960e-39b3c8361c16',
            payment_status: 'Pendiente integración',
            payment_method: 'Pendiente integración',
            total: 0,
            created_at: 1640822400,
            updated_at: 1640822400,
        },
    ];

    const action = setHistory(membership, history);

    expect(action).toEqual({
        type: ActionKeys.SET_HISTORY,
        membership: membership,
        history: history,
    });
});

test('It should set up membership types data', () => {
    const membershipTypes = [
        {
            id: '2035d751-c51d-32e8-8f2f-230c0a85121b',
            name: 'Membresía Mensual',
            value: 10000,
            is_active: true,
            duration: 1,
            created_at: 10,
            updated_at: 10,
        },
        {
            id: 'd740198c-c011-324c-814e-24dd0ab83fdc',
            name: 'Membresía Semestral',
            value: 55000,
            is_active: true,
            duration: 6,
            created_at: 10,
            updated_at: 10,
        },
        {
            id: 'a4255bba-1628-3895-bfb5-9a14e3ac433b',
            name: 'Membresía Anual',
            value: 110000,
            is_active: true,
            duration: 12,
            created_at: 10,
            updated_at: 10,
        },
    ];

    const action = setMembershipTypes(membershipTypes);

    expect(action).toEqual({
        type: ActionKeys.SET_MEMBERSHIP_TYPES,
        membership_types: membershipTypes,
    });
});

test('It should set up membership selected data', () => {
    const membership = {
        id: '5ccb1dd4-9afd-4f0e-826b-5acd1f2aec4f',
        name: 'Test',
        type_membership_id: '4c74deca-d528-11eb-b8bc-0242ac130009',
        purchase_date: 1640822400,
        initial_date: 1640822400,
        expiration_date: 1640822400,
        is_active: true,
        company_id: '04380323-a079-4939-960e-39b3c8361c16',
        payment_status: 'Pendiente integración',
        payment_method: 'Pendiente integración',
        total: 0,
        created_at: 1640822400,
        updated_at: 1640822400,
    };

    const action = setMembershipSelected(membership);

    expect(action).toEqual({
        type: ActionKeys.SET_MEMBERSHIP_SELECTED,
        membership_selected: membership,
    });
});

test('It should set data modules membership', () => {
    const modules = [
        {
            id: '1',
            name: 'Digitalización tienda física',
            description: 'Acceso al modulo de Digitalización tienda física',
            price: '100000',
        },
    ];

    const action = setModulesMembership(modules);

    expect(action).toEqual({
        type: ActionKeys.SET_MODULES_MEMBERSHIP,
        modules: modules,
    });
});

test('It should set up failed membership data', () => {
    const action = failedMembership('Fallo interno del servidor.');

    expect(action).toEqual({
        type: ActionKeys.FAILED_MEMBERSHIP,
        error: 'Fallo interno del servidor.',
    });
});
