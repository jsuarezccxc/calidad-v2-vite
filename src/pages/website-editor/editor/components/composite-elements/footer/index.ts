import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';
import styled, { CSSObject } from '@emotion/styled';
import exampleImage from '@assets/images/footer-example.png';
import { createStyle } from '@utils/WebsiteNode';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { SOCIAL_NETWORK_ICONS } from '../components';

export * from './Footer';

/**
 * Default top for footer.
 */
export const DEFAULT_TOP_FOOTER = 980;

/**
 * Data of the footer
 */
export const ELEMENT_DATA = {
    oneTwo: {
        logo: {
            text: 'Logotipo/Nombre',
        },
        links: [
            { className: 'footer__links-item', text: 'Inicio' },
            { className: 'footer__links-item', text: 'Quiénes somos' },
            { className: 'footer__links-item', text: 'Catálogo' },
            { className: 'footer__links-item', text: 'Blog' },
        ],
        container: {
            text: 'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)',
            socialNetwork: {
                icons: SOCIAL_NETWORK_ICONS,
            },
            politic: {
                privacy: 'Política de privacidad y tratamiento de datos',
                conditions: 'Términos y condiciones',
                rights: 'Todos los derechos reservados.',
            },
            contactButton: {
                text: 'Contáctenos',
            },
        },
    },
    threeFour: {
        container: {
            image: {
                path: exampleImage,
                alt: 'example image',
            },
            text: 'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)',
            socialNetwork: {
                icons: SOCIAL_NETWORK_ICONS,
            },
            descriptions: ['Descripción', 'Razon social', 'NIT', 'Dirección', 'Teléfonos', 'Etc.'],
            politic: {
                privacy: 'Política de privacidad y tratamiento de datos',
                conditions: 'Términos y condiciones',
                rights: 'Todos los derechos reservados.',
            },
            contactButton: {
                text: 'Contáctenos',
            },
        },
    },
    five: {
        container: {
            image: {
                path: exampleImage,
                alt: 'example image',
            },
            text: 'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)',
            socialNetwork: {
                icons: SOCIAL_NETWORK_ICONS,
            },
            descriptions: ['Nombre empresa · Nit · Dirección'],
            politic: {
                privacy: 'Política de privacidad y tratamiento de datos',
                conditions: 'Términos y condiciones',
                rights: 'Todos los derechos reservados.',
            },
            contactButton: {
                title: 'Más información',
                inputPlaceholder: 'Tu correo',
                text: 'Subscribete',
            },
            titles: ['Título', 'Título', 'Título', 'Título', 'Título', 'Título'],
        },
    },
    six: {
        container: {
            image: {
                path: exampleImage,
                alt: 'example image',
            },
            text: 'Espacio para texto (Agregar razon social, NIT, dirección, teléfonos, etc.)',
            socialNetwork: {
                icons: SOCIAL_NETWORK_ICONS,
            },
            descriptions: ['Descripción', 'Razon social', 'NIT', 'Dirección', 'Teléfonos', 'Etc.'],
            politic: {
                privacy: 'Política de privacidad y tratamiento de datos',
                conditions: 'Términos y condiciones',
                rights: 'Todos los derechos reservados.',
            },
            contactButton: {
                text: 'Contáctenos',
            },
        },
    },
};

/**
 * Object with data to render correct footer
 */
export const FOOTER_DATA_OPTION: { [key: string]: IGenericRecord } = {
    [ElementOption.One]: ELEMENT_DATA.oneTwo,
    [ElementOption.Two]: ELEMENT_DATA.oneTwo,
    [ElementOption.Three]: ELEMENT_DATA.threeFour,
    [ElementOption.Four]: ELEMENT_DATA.threeFour,
    [ElementOption.Five]: ELEMENT_DATA.five,
    [ElementOption.Six]: ELEMENT_DATA.six,
};

/**
 * Footer wrapper made with styled components
 */
export const FooterWrapper = styled.footer<{ style: IGenericRecord }>`
    .footer {
        &__links-item {
            ${({ style: { title } }): CSSObject => createStyle(title)};
        }

        &__see-more-button {
            ${({ style: { title } }): CSSObject => createStyle(title)};
        }

        &__see-more-link {
            ${({ style: { title } }): CSSObject => createStyle(title)}
        }

        &__container-description {
            ${({ style: { description } }): CSSObject => createStyle(description)}
        }
        &__container-five-contact {
            ${({ style: { buttonAction } }): CSSObject => createStyle(buttonAction)}
        }
    }
`;

/**
 * Initial data of the footer component
 */
export const DEFAULT_FOOTER = {
    id: uuid(),
    option: ElementOption.One,
    type: ElementType.Footer,
    value: '',
    items: [],
    style: {
        left: 0,
        top: 720,
        bgColor: {
            background: '',
        },
        width: '100%',
        height: 269,
        zIndex: 10,
    },
    setting: {
        socialNetworks: [],
    },
};
