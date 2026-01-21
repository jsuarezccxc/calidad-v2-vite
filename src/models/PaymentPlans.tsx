/**
 * Name of each of the fields in the view
 */
export enum Field {
    Address = 'address',
    ClientName = 'client_name',
    DocumentType = 'document_type',
    DocumentNumber = 'document_number',
    CountryId = 'country_id',
    DepartmentId = 'department_id',
    DepartmentName = 'department_name',
    CityId = 'city_id',
    CityName = 'city_name',
    PostalCode = 'postal_code',
    Phone = 'phone',
    Email = 'email',
    PersonType = 'person_type',
    TaxDetail = 'tax_detail',
    HolderName = 'holder_name',
    HolderDocumentType = 'holder_document_type',
    HolderDocumentNumber = 'holder_document_number',
    HolderEmail = 'holder_email',
    CardNumber = 'card_number',
    CardExpiration = 'card_expiration',
    CardCode = 'card_code',
    CardType = 'card_type',
    Responsibilities = 'fiscal_responsibilities',
    Bank = 'bank',
    Quotas = 'quotas',
    TrueInformation = 'true_information',
    TypeTaxpayer = 'type_taxpayer_name',
}

/**
 * This is each of the views that make up the page
 */
export enum View {
    Method = 'PAYMENT_METHOD',
    Information = 'INFORMATION',
    Summary = 'SUMMARY',
}

/**
 * These are the available payment methods
 */
export enum PaymentMethod {
    Card = 'CARD',
    Pse = 'PSE',
    CardSaved = 'CARD_SAVED',
}

/**
 * View modals
 */
export enum Modal {
    Approved = 'APPROVED',
    Delete = 'DELETE',
    Success = 'SUCCESS',
    Wrong = 'WRONG',
    Declined = 'DECLINED',
    Pending = 'PENDING',
    ApplicationApproved = 'APPLICATION_APPROVED',
    ApplicationNotApproved = 'APPLICATION_NOT_APPROVED',
    Inactivity = 'INACTIVITY',
    NotApproved = 'NOT_APPROVED',
    PlanAlreadyActive = 'PLAN_ALREADY_ACTIVE',
    PlanAlreadyPurchasedThisYear = 'PLAN_ALREADY_PURCHASED_THIS_YEAR',
}
