import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export { HeaderTableInvoice } from './HeaderTableInvoice';

/**
 * This interface header table note props
 *
 * @typeParam isMandate?: boolean - If is mandate products
 */
export interface IHeaderTableInvoiceProps {
    isMandate?: boolean;
}

/**
 * This const is utils component
 */
export const UTILS = {
    TOOLTIPS_PROPS: {
        disabledDefinitionSection: true,
        // eslint-disable-next-line
        placement: 'bottom-start' as any,
    },
    isSupportPage: (route: string): boolean =>
        [getRoute(Routes.GENERATE_SUPPORT_DOCUMENT), getRoute(Routes.GENERATE_ADJUSTMENT_NOTE)].includes(route),
};
