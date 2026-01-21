import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IGenericRecord } from '@models/GenericRecord';

export const RECOVER_PASSWORD_INFORMATION = (email?: string): IGenericRecord => ({
    TITLE: 'Información',
    DESCRIPTION: (
        <p className="w-85 text-blue text-sm">
            Si el correo electrónico <span className="font-allerbold">{email}</span> se encuentra registrado en{' '}
            <span className="font-allerbold">{PRODUCT_NAME}</span> se enviará un enlace para restablecer su contraseña, revise la
            bandeja de entrada o el spam.
        </p>
    ),
});

export const CHANGE_PASSWORD_INFORMATION = {
    TITLE: 'Información guardada',
    DESCRIPTION: <p className="mt-2 mb-7">Su contraseña fue recuperada exitosamente.</p>,
};
