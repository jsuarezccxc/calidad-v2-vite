import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { CRM } from '@components/operations-table';
import useParam from './useParam';

/**
 * This interface is params wrapperClasses
 *
 * @typeParam pathname: string - Pathname page
 * @typeParam accessToken?: string - If login user
 * @typeParam isShowBanner?: boolean - If show banner
 */
interface IParamsWrapperClasses {
    pathname: string;
    accessToken?: string;
    isShowBanner?: boolean;
}

export const useClassesApp = (): {
    bodyAppClasses: (clientInvoice: boolean, accessToken?: string) => string;
    wrapperClasses: (isWebsitePage: boolean, param0: IParamsWrapperClasses) => string;
    footerClasses: (hasFreeMonth: IGenericRecord[], accessToken?: string) => string;
} => {
    const { queryParam } = useParam('page');
    const isCrmPage = window.location.pathname.includes(CRM);

    const bodyAppClasses = (clientInvoice: boolean, accessToken?: string): string => {
        let baseClasses = 'mt-0 flex flex-col flex-1 overflow-y-scroll col-span-12 xs:container-mobile bg-scrollbar-container';
        if (!clientInvoice) baseClasses += ' container-desktop md:col-span-9';
        if (!accessToken) baseClasses += ' h-screen bg-white-scrollbar-landing';
        else baseClasses += ' relative';
        return baseClasses;
    };

    const wrapperClasses = (isWebsitePage: boolean, { accessToken, isShowBanner, pathname }: IParamsWrapperClasses): string => {
        let baseClasses = 'flex flex-col flex-1 lg:mx-0';
        if (isWebsitePage) baseClasses += ' p-0';
        if (accessToken) baseClasses += `spacing-content ${!isCrmPage ? 'lg:pl-7 lg:pr-6' : ''}`;
        if (isShowBanner) baseClasses += ' mt-banner-86';
        if (pathname === getRoute(Routes.WEBSITE_EDITOR) && !lengthGreaterThanZero(queryParam)) baseClasses += ' website-page';
        return baseClasses;
    };

    const footerClasses = (hasFreeMonth: IGenericRecord[], accessToken?: string): string => {
        let baseClasses = 'mx-5 sm:mx-0';
        if (accessToken && hasFreeMonth) baseClasses += ' mb-2.2';
        return baseClasses;
    };

    return {
        bodyAppClasses,
        wrapperClasses,
        footerClasses,
    };
};
