/**
 * This interface describes the structure of a ledger account
 *
 * @typeParam code: string - Ledger account code
 * @typeParam id: string - Item id
 * @typeParam is_product: boolean - Indicates if the account belongs to a product
 * @typeParam name: string - Ledger account name
 */
export interface ILedgerAccount {
    code: string;
    id: string;
    is_product: boolean;
    name: string;
}

/**
 * Utility interface for reason requests with note codes
 * 
 * @typeParam id: string - Unique identifier for the reason
 * @typeParam name: string - Name or description of the reason
 * @typeParam code_debit_note: number | null - Code for debit note if applicable
 * @typeParam code_credit_note: number | null - Code for credit note if applicable
 * @typeParam code_adjustment_note: number | null - Code for adjustment note if applicable
 */
export interface IUtilReasonRequest {
    id: string;
    name: string;
    code_debit_note: number | null;
    code_credit_note: number | null;
    code_adjustment_note: number | null;
}
