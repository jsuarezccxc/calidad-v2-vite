import { v4 as uuid } from 'uuid';
import styled, { CSSObject } from '@emotion/styled';
import { SOCIAL_NETWORK_ICONS } from '../components';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { createStyle } from '@utils/WebsiteNode';

export * from './Header';

/**
 * This interface describes the properties for element data props
 *
 * @typeParam oneTwo: IElementData - Options one and two
 * @typeParam threeFour: IElementData - Option three and four
 */
export interface IElementDataProps {
    oneTwo: IElementData;
    threeFour?: IElementData;
}

/**
 * This interface describes the properties for data
 *
 * @typeParam logo: { text?: string } - Optional text logo
 * @typeParam links: { text?: string; url?: string }[] - Optional title and url of the page links
 * @typeParam session: ISession - Optional page session
 * @typeParam socialNetwork: string[] - Optional social Network page
 */
export interface IElementData {
    logo?: { text?: string };
    links?: { text?: string; url?: string }[];
    session?: ISession;
    socialNetwork?: string[];
}

/**
 * This interface describes the properties for session
 *
 * @typeParam signInText: string - Optional text in sign
 * @typeParam shoppingCart: { icon?: string; itemCount?: number } - Optional props icon
 * @typeParam contactButton: { text?: string } - Optional text contact button
 * @typeParam user: { text?: string } - Optional text user
 */
export interface ISession {
    signInText?: string;
    shoppingCart?: { icon?: string; itemCount?: number };
    contactButton?: { text?: string };
    user?: { text?: string };
}

/**
 *  Default text for button form
 */
export const DEFAULT_BUTTON_TEXT = 'Contáctenos';

/**
 *  Default height logo
 */
export const HEIGHT_DEFAULT_MOBILE = 36;

/**
 *  Data to render in header
 */
const ELEMENT_DATA = {
    oneTwo: {
        logo: {
            text: 'Logotipo/Nombre',
        },
        links: [
            { text: 'Inicio', url: '#' },
            { text: 'Quíenes somos', url: '#' },
            { text: 'Catálogo', url: '#' },
            { text: 'Blog', url: '#' },
            { text: 'Servicios', url: '#' },
            { text: 'Afiliados', url: '#' },
            { text: 'Nuestros Proyectos', url: '#' },
            { text: 'Nuestro equipo', url: '#' },
            { text: 'Quejas y reclamos', url: '#' },
            { text: 'Nuestras oficinas', url: '#' },
        ],
        session: {
            signInText: 'Iniciar sesión',
            contactButton: {
                text: 'Contáctenos',
            },
            shoppingCart: {
                icon: 'shoppingCart',
                itemCount: 0,
            },
            user: {
                text: 'N',
            },
        },
    },
    threeFour: {
        logo: {
            text: 'Logotipo/Nombre',
        },
        links: [
            { text: 'Inicio', url: '#' },
            { text: 'Quíenes somos', url: '#' },
            { text: 'Catálogo', url: '#' },
            { text: 'Blog', url: '#' },
            { text: 'Servicios', url: '#' },
            { text: 'Afiliados', url: '#' },
            { text: 'Nuestros Proyectos', url: '#' },
            { text: 'Nuestro equipo', url: '#' },
            { text: 'Quejas y reclamos', url: '#' },
            { text: 'Nuestras oficinas', url: '#' },
        ],
        session: {
            signInText: 'Iniciar sesión',
            shoppingCart: {
                icon: 'shoppingCart',
                itemCount: 0,
            },
        },
        socialNetwork: SOCIAL_NETWORK_ICONS,
    },
};

/**
 * Object with data to render correct header
 */
export const HEADER_DATA_OPTION: { [key: string]: IElementData } = {
    [ElementOption.One]: ELEMENT_DATA.oneTwo,
    [ElementOption.Two]: ELEMENT_DATA.oneTwo,
    [ElementOption.Three]: ELEMENT_DATA.threeFour,
    [ElementOption.Four]: ELEMENT_DATA.threeFour,
};

/**
 * Header wrapper made with styled components
 */
export const HeaderWrapper = styled.header<{ style: IGenericRecord }>`
    ${({ style: { bgColor } }): CSSObject => createStyle(bgColor)};
    .header {
        &__link-item {
            ${({ style: { title } }): CSSObject => createStyle(title)};
        }

        &__signInText {
            ${({ style: { title } }): CSSObject => createStyle(title)};
        }

        &__see-more-button {
            ${({ style: { title } }): CSSObject => createStyle(title)};
        }

        &__see-more-link {
            ${({ style: { title } }): CSSObject => createStyle(title)}
        }

        &-contact {
            ${({ style: { button } }): CSSObject => createStyle(button)}
        }
    }
`;

/**
 * Initial data of the header component
 */
export const DEFAULT_HEADER = {
    id: uuid(),
    option: ElementOption.One,
    type: ElementType.Header,
    value: '',
    items: [],
    style: {
        left: 0,
        top: 0,
        bgColor: {
            background: '',
        },
        width: '100%',
        height: 72,
        zIndex: 10,
    },
    setting: {},
};

/**
 * This default size logo
 */
export const DefaultSizeLogo = {
    Height: 70,
    Width: 164,
    HeightMobile: 36,
};
