import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { stringToFloat, unitCostToDetails } from '@utils/ElectronicInvoice';
import { discountOfValue, symbolCurrency } from '@utils/Number';
import { CURRENCY_LOCALES } from '@constants/Currency';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';

interface IUseSymbolCurrency {
    symbol: string;
    calculateWithRate: (invoiceDetails: IInvoiceDetails[], rate: number) => IInvoiceDetails[];
}

export const useSymbolCurrency = (idCurrency: string, productsStock: IGenericRecord[]): IUseSymbolCurrency => {
    const utils = useSelector(
        ({ utils, correctionBusinessDocument }: RootState) => Object.keys(utils.utils).length ? utils.utils : correctionBusinessDocument.utilsData
    );

    const symbol = useMemo(() => {
        if (!idCurrency || !utils) return '$';
        const { code } = utils.foreign_exchange?.find((currency: Record<string, string>) => currency.id === idCurrency) || {
            code: 'COP',
        };
        const locate = CURRENCY_LOCALES[code];
        return symbolCurrency(code, locate);
    }, [idCurrency, utils]);

    const calculateWithRate = (invoiceDetails: IInvoiceDetails[], rate: number): IInvoiceDetails[] =>
        invoiceDetails.map(detail => {
            const productFind = productsStock.find(product => product.sku_internal === detail.sku_internal) || {};
            let unitCost = unitCostToDetails(productFind, detail.product_taxes);
            if (rate) unitCost = stringToFloat(unitCost / rate);
            const unitValue = unitCost * detail.quantity;
            const discount = discountOfValue(unitValue, detail.percentage_discount) || 0;
            return {
                ...detail,
                discount,
                sale: unitCost,
                unit_cost: unitCost,
                unit_value: unitValue,
                total_buy: unitValue - discount,
            };
        });

    return {
        symbol,
        calculateWithRate,
    };
};
