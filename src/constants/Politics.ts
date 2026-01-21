import { v4 as uuid } from 'uuid';
import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';

export const RETURN_POLICY = 'return_policy';
export const RIGHT_OF_WITHDRAWAL = 'right_of_withdrawal';
export const WARRANTY_POLICY = 'warranty_policy';
export const SHIPPING_POLICY = 'shipping_policy';
export const REFUND_POLICIES = 'refund_policies';
export const TERMS_AND_CONDITIONS = 'terms_and_conditions';
export const DATA_PRIVACY_POLICY = 'data_privacy_policy';
export const IMAGE = 'image';

export const POLITICS_VALUE: IGenericRecord = {
    [DATA_PRIVACY_POLICY]: 'Política de privacidad y tratamiento de datos',
    [TERMS_AND_CONDITIONS]: 'Términos y condiciones',
    [RIGHT_OF_WITHDRAWAL]: 'Derechos de retracto',
    [WARRANTY_POLICY]: 'Política de garantía',
    [SHIPPING_POLICY]: 'Política de envío',
    [REFUND_POLICIES]: 'Política de reembolsos',
    [RETURN_POLICY]: 'Política de devoluciones',
};

export const DOCUMENT_OPTIONS: IOptionSelect[] = [
    { key: RIGHT_OF_WITHDRAWAL, value: POLITICS_VALUE[RIGHT_OF_WITHDRAWAL] },
    { key: TERMS_AND_CONDITIONS, value: POLITICS_VALUE[TERMS_AND_CONDITIONS] },
    { key: WARRANTY_POLICY, value: POLITICS_VALUE[WARRANTY_POLICY] },
    { key: SHIPPING_POLICY, value: POLITICS_VALUE[SHIPPING_POLICY] },
    { key: REFUND_POLICIES, value: POLITICS_VALUE[REFUND_POLICIES] },
    { key: RETURN_POLICY, value: POLITICS_VALUE[RETURN_POLICY] },
];

export const DATA_TEST_POLITICS = [
    {
        id: 'aca01e67-b965-4215-961f-781cd04e38ba',
        type: 'RIGHT_OF_WITHDRAWAL',
        url:
            'https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/573bc629-b8cd-36b3-8e7b-b79ca0bc0547/website/typographies/2021-09-22-3572f906-bc37-31a7-b002-d64bfcbc9e2f-1632347583.',
        name: 'right_of_withdrawal',
    },
];

export const INITIAL_DATA_POLITICS = [
    { temporary_id: uuid(), name: TERMS_AND_CONDITIONS, files: [] },
    { temporary_id: uuid(), name: DATA_PRIVACY_POLICY, files: [] },
];

export const TERMS_AND_CONDITIONS_URL = urls.footer.terms;
