/*
 * This interface describe dian links structure
 *
 * @typeParam [Key: string] : {
 *     @typeParam url: string - Dian url
 *     @typeParam text: string - Dian text url
 * } - Dian object link structure
 */
export interface IDianLinks {
    [key: string]: {
        url: string;
        text: string;
    };
}

export enum TypeLinkDian {
    LOGIN,
    LOGIN_HAB,
    INFORMATICS_SERVICE,
    INFORMATICS_SERVICE_NO_HAB,
    PAGE_NUMERATION_PAGINATION,
    RUT_DIAN,
    NUMBERING_AUTHORIZATION,
    EXPIRED_RESOLUTION,
    QUALIFICATION,
    PAGE_DIAN,
}

export const clickHere = 'haga click aquí';

export const dianLinks: IDianLinks = {
    [TypeLinkDian.LOGIN]: { url: 'https://catalogo-vpfe.dian.gov.co/User/Login', text: 'DIAN | Acceder' },
    [TypeLinkDian.LOGIN_HAB]: {
        url: 'https://catalogo-vpfe-hab.dian.gov.co/User/Login',
        text: 'DIAN | Acceder',
    },
    [TypeLinkDian.INFORMATICS_SERVICE_NO_HAB]: {
        url: 'https://catalogo-vpfe.dian.gov.co/User/Login',
        text: 'servicio informático de facturación electrónica de la DIAN ambiente de producción',
    },
    [TypeLinkDian.INFORMATICS_SERVICE]: {
        url: 'https://catalogo-vpfe-hab.dian.gov.co/User/Login',
        text: 'servicio informático de facturación electrónica de la DIAN ambiente de habilitación',
    },
    [TypeLinkDian.PAGE_NUMERATION_PAGINATION]: {
        url: 'https://muisca.dian.gov.co/WebArquitectura/DefLoginOld.faces',
        text: 'Páginas - Numeración de Facturación (dian.gov.co)',
    },
    [TypeLinkDian.RUT_DIAN]: {
        url: 'https://www.dian.gov.co/impuestos/personas/Documents/Paso_a_paso_RUT_virtual.pdf',
        text: clickHere,
    },
    [TypeLinkDian.NUMBERING_AUTHORIZATION]: {
        url:
            'https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/internal-control/governmentregulations/AutorizaciónDeNumeración.pdf',
        text: clickHere,
    },
    [TypeLinkDian.EXPIRED_RESOLUTION]: {
        url:
            'https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/internal-control/governmentregulations/HabilitaciónDeNumeraciónParaResolucionVencida.pdf',
        text: clickHere,
    },
    [TypeLinkDian.QUALIFICATION]: {
        url:
            'https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/internal-control/governmentregulations/HabilitacionComoFacturadorElectronico.pdf',
        text: clickHere,
    },
    [TypeLinkDian.PAGE_DIAN]: {
        url: 'https://www.dian.gov.co/',
        text: 'https://www.dian.gov.co/',
    },
};
