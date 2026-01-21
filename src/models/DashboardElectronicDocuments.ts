/**
 * This interface is data dashboard
 * 
 * @typeParam total_clients: number - Total clients
 * @typeParam other_value: number - Other value
 * @typeParam total_sales: number - Total sales
 * @typeParam percentage_sales: number - Percentage sales
 * @typeParam document_available: number - Documents available
 * @typeParam annual_income: IAnnualIncome - Annual income
 * @typeParam electronic_document_counting: IElectronicDocumentCounting - Counting calculate by documents electronics
 * @typeParam is_unlimited: boolean - Validate type membership
 */
export interface IDataDashboardElectronicDocuments {
    total_clients: number;
    other_value: number;
    total_sales: number;
    percentage_sales: number;
    document_available: number;
    annual_income: IAnnualIncome;
    electronic_document_counting: IElectronicDocumentCounting;
    is_unlimited: boolean;
}

/**
 * This interface is annual income structure
 * 
 * @typeParam January?: number - Month total sales
 * @typeParam February?: number - Month total sales
 * @typeParam March?: number - Month total sales
 * @typeParam April?: number - Month total sales
 * @typeParam May?: number - Month total sales
 * @typeParam June?: number - Month total sales
 * @typeParam July?: number - Month total sales
 * @typeParam August?: number - Month total sales
 * @typeParam September?: number - Month total sales
 * @typeParam October?: number - Month total sales
 * @typeParam November?: number - Month total sales
 * @typeParam December?: number - Month total sales
 */
export interface IAnnualIncome {
    January?: number;
    February?: number;
    March?: number;
    April?: number;
    May?: number;
    June?: number;
    July?: number;
    August?: number;
    September?: number;
    October?: number;
    November?: number;
    December?: number;
}

/**
 * This interface is counting documents
 * 
 * @typeParam total_invoice: number - Total invoice
 * @typeParam total_supporting_document: number - Total support document
 * @typeParam total_adjustment_note: number - Total adjustment note
 * @typeParam total_debit_note: number - Total debit note
 * @typeParam total_credit_note: number - Total credit note
 */
export interface IElectronicDocumentCounting {
    total_invoice: number;
    total_supporting_document: number;
    total_adjustment_note: number;
    total_debit_note: number;
    total_credit_note: number;
}

/**
 * This interface is data line chart
 * 
 * @typeParam month: string - Name month
 * @typeParam value: number - Total sale
 */
export interface IDataLineChart {
    month: string;
    value: number;
}
