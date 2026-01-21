import { combineReducers, Reducer } from 'redux';
import storage from 'redux-persist/es/storage';
import { ActionKeys } from './session/types';
// Import from reducers;
import { reducer as loaderReducer } from './loader/reducer';
import { reducer as menuReducer } from './menu/reducer';
import { reducer as sessionReducer } from './session/reducer';
import { reducer as userReducer } from './user/reducer';
import { reducer as recoverPasswordReducer } from './recover-password/reducer';
import { reducer as membershipReducer } from './membership/reducer';
import { reducer as productsReducer } from './products/reducer';
import { reducer as userAdministratorReducer } from './user-administrator/reducer';
import { reducer as editUserReducer } from './user-management/edit-user/reducer';
import { reducer as inventoryReducer } from './inventory/reducer';
import { reducer as addUserReducer } from './user-management/add-user/reducer';
import { reducer as warehousesReducer } from './warehouses/reducer';
import { reducer as suppliersReducer } from './suppliers/reducer';
import { reducer as latestModificationsReducer } from './latest-modifications/reducer';
import { reducer as companyReducer } from './company/reducer';
import { reducer as onboardingReducer } from './onboarding/reducer';
import { reducer as politicsReducer } from './politics/reducer';
import { reducer as notificationReducer } from './notifications/reducer';
import { reducer as websiteReducer } from './website/reducer';
import { reducer as dropdownReducer } from './dropdown/reducer';
import { reducer as dailyControlWarehouseProduct } from './daily-inventory-control-warehouse-product/reducer';
import { reducer as productCatalogReducer } from './product-catalog/reducer';
import { reducer as correctionBusinessDocument } from './correction-business-document/reducer';
import { reducer as electronicInvoiceReducer } from './electronic-invoice/reducer';
import { reducer as reportDocumentPayment } from './report-document-payment/reducer';
import { reducer as clientsReducer } from './clients/reducer';
import { reducer as clientPortalReducer } from './client-portal/reducer';
import { reducer as parameterizationCustomizationElectronicInvoice } from './parameterization-customization-electronic-invoice/reducer';
import { reducer as utilsRedux } from './utils/reducer';
import { reducer as correctionDocumentsClientEmployer } from './correction-documents-client-employer/reducer';
import { reducer as PaymentReducer } from './gateway-payment/reducer';
import { reducer as purchaseReportReducer } from './purchase-report/reducer';
import { reducer as personalizedConsulting } from './personalized-consulting/reducer';
import { reducer as binReducer } from './bin/reducer';
import { reducer as cancellationElectronicDocuments } from './cancellation-electronic-document/reducer';
import { reducer as rejectedInvoicesReducer } from './rejected-invoices/reducer';
import { reducer as salesReportSalesForce } from './sales-report-sales-force/reducer';
import { reducer as invoiceSummaryReducer } from './invoice-summary/reducer';
import { reducer as paymentReducer } from './payment-gateway/reducer';
import { reducer as dynamicDataReducer } from './dynamic-data/reducer';
import { reducer as reportNotesPurchaseReducer } from './report-note-purchase/reducer';
import { reducer as homeLanding } from './home-landing/reducer';
import { reducer as calendarReducer } from './calendar/reducer';
import { reducer as paymentsReducer } from './payments/reducer';
import { reducer as ganttReducer } from './gantt/reducer';
import { reducer as productReducer } from './product/reducer';
import { reducer as invoiceWarehouse } from './invoice-warehouse/reducer';
import { reducer as reportIssuedDocumentsSupportDocument } from './report-issued-documents-support-document/reducer';
import { reducer as createAdjustmentNote } from './create-adjustment-note/reducer';
import { reducer as supportDocumentReducer } from './support-document/reducer';
import { reducer as quotesReducer } from './quotes/reducer';
import { reducer as assembleProductReducer } from './assemble-product/reducer';
import { reducer as websiteNodeReducer } from './website-node/reducer';
import { reducer as domainReducer } from './domain/reducer';
import { reducer as finalInventoryReducer } from './final-inventory/reducer';
import { reducer as invoiceWebsiteReducer } from './invoice-website/reducer';
import { reducer as dashboardElectronicDocumentsReducer } from './dashboard-electronic-documents/reducer';
import { reducer as modificationsHistory } from './modification-history/reducer';
import { reducer as MaintenanceReducer } from './maintenance/reducer';
import { reducer as ContingencyReducer } from './contingency/reducer';

/**
 * Declaration from reducers modules
 * Call your reducer module and create a specific name for this
 * example: exampleReducer
 */
export const appReducer = combineReducers({
    loader: loaderReducer,
    menu: menuReducer,
    session: sessionReducer,
    user: userReducer,
    recoverPassword: recoverPasswordReducer,
    membership: membershipReducer,
    products: productsReducer,
    userAdministrator: userAdministratorReducer,
    updateUser: editUserReducer,
    inventory: inventoryReducer,
    addUser: addUserReducer,
    warehouses: warehousesReducer,
    suppliers: suppliersReducer,
    latestModifications: latestModificationsReducer,
    company: companyReducer,
    onboarding: onboardingReducer,
    politics: politicsReducer,
    notifications: notificationReducer,
    prefix: notificationReducer,
    website: websiteReducer,
    dropdown: dropdownReducer,
    dailyControlWarehouseProduct: dailyControlWarehouseProduct,
    productCatalog: productCatalogReducer,
    correctionBusinessDocument: correctionBusinessDocument,
    electronicInvoice: electronicInvoiceReducer,
    reportDocumentPayment: reportDocumentPayment,
    clients: clientsReducer,
    clientPortal: clientPortalReducer,
    parameterizationInvoice: parameterizationCustomizationElectronicInvoice,
    utils: utilsRedux,
    correctionDocumentsClientEmployer: correctionDocumentsClientEmployer,
    purchaseReport: purchaseReportReducer,
    personalizedConsulting: personalizedConsulting,
    bin: binReducer,
    cancellationElectronicDocuments: cancellationElectronicDocuments,
    rejectedInvoices: rejectedInvoicesReducer,
    salesReportSalesForce: salesReportSalesForce,
    payment: PaymentReducer,
    invoiceSummary: invoiceSummaryReducer,
    paymentGateway: paymentReducer,
    dynamicData: dynamicDataReducer,
    reportNotesPurchase: reportNotesPurchaseReducer,
    homeLanding: homeLanding,
    calendar: calendarReducer,
    payments: paymentsReducer,
    gantt: ganttReducer,
    product: productReducer,
    invoiceWarehouse: invoiceWarehouse,
    reportIssuedDocumentsSupportDocument: reportIssuedDocumentsSupportDocument,
    createAdjustmentNote: createAdjustmentNote,
    supportDocument: supportDocumentReducer,
    quotes: quotesReducer,
    assembleProduct: assembleProductReducer,
    websiteNode: websiteNodeReducer,
    domain: domainReducer,
    finalInventorySales: finalInventoryReducer,
    invoiceWebsite: invoiceWebsiteReducer,
    dashboardElectronicDocument: dashboardElectronicDocumentsReducer,
    modificationsHistory: modificationsHistory,
    maintenance: MaintenanceReducer,
    contingency: ContingencyReducer,
});

export const rootReducer: Reducer = (state: RootState, action) => {
    if (action.type === ActionKeys.CLEAR_SESSION) {
        storage.removeItem('persist:root');
        state = {} as RootState;
    }

    return appReducer(state, action);
};

// Global state from application
export type RootState = ReturnType<typeof appReducer>;
