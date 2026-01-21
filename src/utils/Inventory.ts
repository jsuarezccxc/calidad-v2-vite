import { urls } from '@api/urls';
import { DELETE_COUNTRY_CITIES, DELETE_PRODUCT } from '@constants/Inventory';

export const deleteShippingCost = (type: string): string => {
    switch (type) {
        case DELETE_COUNTRY_CITIES:
            return urls.productShippingCost.deleteCountryCities;
        case DELETE_PRODUCT:
            return urls.productShippingCost.deleteProduct;
        default:
            return '';
    }
};
