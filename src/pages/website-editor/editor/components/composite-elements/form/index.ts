import styled, { CSSObject } from '@emotion/styled';
import { IGenericRecord } from '@models/GenericRecord';
import { createStyle } from '@utils/WebsiteNode';

export * from './AppointmentForm';
export * from './Form';

/**
 * Appointment form fields
 */
export const FIELDS = [
    {
        labelText: '*Nombre:',
    },
    {
        labelText: '*Apellido:',
    },
    {
        labelText: '*Correo electrónico:',
    },
    {
        labelText: '*Teléfono de contacto:',
    },
    {
        labelText: '*Tipo de la cita:',
        select: true,
    },

    {
        labelText: '*Sede:',
        select: true,
    },
    {
        labelText: '*Nombre de la cita:',
        select: true,
    },
    {
        labelText: '*Duración:',
        select: true,
        gray: true,
    },
];

/**
 * Appointment date fields
 */
export const DATE_FIELDS = [
    {
        labelText: '*Fecha:',
        date: true,
    },
    {
        labelText: '*Hora:',
    },
];

/**
 * Form wrapper
 */
export const Wrapper = styled.div<{ style: IGenericRecord }>`
    .form {
        &__button {
            ${({ style: { button } }): CSSObject => createStyle(button)}
        }
    }

    .input {
        &__label {
            ${({ style: { title } }): CSSObject => createStyle(title)}
        }

        &__box {
            ::placeholder {
                ${({ style: { placeholder = false, title } }): CSSObject => (placeholder ? createStyle(title) : {})}
            }
        }
    }
`;

/**
 * Button wrapper
 */
export const Button = styled.button<{ style: IGenericRecord }>`
    ${({ style }): CSSObject => createStyle(style)}
`;

/**
 * Identifier of type paragraph
 */
export const PARAGRAPH = 'Párrafo';
