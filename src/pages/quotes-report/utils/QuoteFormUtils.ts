/**
 * Utility functions for useQuoteForm hook
 * Helper functions to reduce code duplication and improve maintainability
 */

import { IPaymentType } from '@models/Payment';

/**
 * Safely extracts a value with fallback chain
 * Avoids repetitive || null patterns throughout buildQuotePayload
 * 
 * @typeParam primaryValue: T | undefined - Primary value to use
 * @typeParam fallbackValue: T | undefined - Fallback if primary is undefined/null
 * @typeParam defaultValue: T - Final default value (typically null)
 * @returns T - The first defined value in the chain, or defaultValue
 */
export const safeValue = <T>(
    primaryValue: T | undefined | null,
    fallbackValue?: T | undefined | null,
    defaultValue: T | null = null
): T | null => {
    if (primaryValue) return primaryValue;
    if (fallbackValue) return fallbackValue;
    return defaultValue;
};

/**
 * Extracts nested client information with fallback to form data
 * Common pattern for client-related fields in quote payload
 * 
 * @typeParam clientInfo: object | undefined - Client information object
 * @typeParam formDataValue: T | undefined - Fallback value from form data
 * @typeParam field: keyof ClientInfo - Field name to extract
 * @returns T | null - Extracted value or null
 */
export const getClientField = <T>(
    clientInfo: Record<string, unknown> | undefined,
    formDataValue: T | undefined | null,
    field: string
): T | null => {
    const clientInfoValue = (clientInfo?.[field] as T) ?? undefined;
    return safeValue(
        clientInfoValue,
        formDataValue,
        null
    );
};

/**
 * Normalizes object properties, converting undefined to null
 * Eliminates repetitive || null patterns throughout payload building
 * 
 * @typeParam obj: Record<string, unknown> - Object to normalize
 * @returns Record<string, unknown> - Normalized object with undefined replaced by null
 */
export const normalizeToNull = <T extends Record<string, unknown>>(obj: T): T => {
    const normalized = {} as T;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (value === undefined) {
                normalized[key] = null as T[Extract<keyof T, string>];
            } else if (value === null) {
                normalized[key] = null as T[Extract<keyof T, string>];
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                const isEmptyObject = Object.keys(value).length === 0;

                if (isEmptyObject) {
                    normalized[key] = null as T[Extract<keyof T, string>];
                } else {
                    normalized[key] = normalizeToNull(value as Record<string, unknown>) as T[Extract<keyof T, string>];
                }
            } else {
                normalized[key] = value;
            }
        }
    }

    return normalized;
};

/**
 * Extracts payment method field with fallback to paymentConfig
 * Common pattern for payment-related fields in quote payload
 *
 * @typeParam formDataValue: string | undefined - Direct form data value
 * @typeParam paymentConfigValue: string | undefined - Value from paymentConfig object
 * @returns string | undefined - Extracted payment method value
 */
export const getPaymentField = (
    formDataValue: string | undefined,
    paymentConfigValue: string | undefined
): string | undefined => {
    return safeValue(formDataValue, paymentConfigValue, undefined) || undefined;
};

/**
 * Resolves payment type name from ID using utils payment types array
 * Handles lookup logic and multiple fallback scenarios
 *
 * @typeParam paymentTypeId: string | undefined - Payment type identifier
 * @typeParam paymentTypes: IPaymentType[] | undefined - Available payment types from utils
 * @typeParam formDataName: string | undefined - Fallback name from form data
 * @typeParam configName: string | undefined - Fallback name from payment config
 * @returns string | undefined - Resolved payment type name
 */
export const resolvePaymentTypeName = (
    paymentTypeId: string | undefined,
    paymentTypes: IPaymentType[] | undefined,
    formDataName: string | undefined,
    configName: string | undefined
): string | undefined => {
    // If no ID or no payment types available, return fallback names
    if (!paymentTypeId || !paymentTypes) {
        return safeValue(formDataName, configName, undefined) || undefined;
    }

    // Find payment type by ID
    const paymentType = paymentTypes.find((pt: IPaymentType) => pt.id === paymentTypeId);

    // Return value/name from found type, or fallback to form data/config names
    return safeValue(
        paymentType?.value,
        paymentType?.name,
        safeValue(formDataName, configName, undefined)
    ) || undefined;
};
