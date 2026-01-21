import { useCallback } from 'react';
import { IInvoiceDetails } from '@models/ElectronicInvoice';

/**
 * Table handlers interface for billing information component
 * Defines the contract for table operations and event handling within quote generation
 * 
 * @interface ITableHandlers
 * @typeParam updateData: (products: IInvoiceDetails[]) => void - Updates product data with proper ID assignment and validation
 * @typeParam toggleTotalsQuery: () => void - Toggles the display state of totals calculation query
 * @typeParam onDeleteRow: () => void - Handles row deletion confirmation and cleanup operations
 */
interface ITableHandlers {
    updateData: (products: IInvoiceDetails[]) => void;
    toggleTotalsQuery: () => void;
    onDeleteRow: () => void;
}

/**
 * Custom hook for managing billing information table handlers
 * 
 * This hook provides centralized table event handling with proper typing
 * for the QuoteBillingInformation component table operations.
 * 
 * @typeParam setProductData: (products: IInvoiceDetails[]) => void - Product data setter function
 * @typeParam toggleTotalsQuery: () => void - Totals query toggle function  
 * @typeParam showDeleteConfirmation: () => void - Delete confirmation handler function
 * @typeParam ITableHandlers - Object containing table handler functions
 */
export const useBillingTableHandlers = (
    setProductData: (products: IInvoiceDetails[]) => void,
    toggleTotalsQuery: () => void,
    showDeleteConfirmation: () => void
): ITableHandlers => {
    const handleProductUpdate = useCallback((products: IInvoiceDetails[]): IInvoiceDetails[] => {
        return products.map((product, index) => ({
            ...product,
            id: product.id || `temp_${index}_${Date.now()}`
        }));
    }, []);

    const updateData = useCallback((products: IInvoiceDetails[]): void => {
        setProductData(handleProductUpdate(products));
    }, [setProductData, handleProductUpdate]);

    return {
        updateData,
        toggleTotalsQuery,
        onDeleteRow: showDeleteConfirmation,
    };
};
