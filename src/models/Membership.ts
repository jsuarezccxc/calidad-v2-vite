import { IGenericRecord } from './GenericRecord';

/**
 * This interface describes that properties the membership structure data receives
 *
 * @typeParam id: string - id is an identifier to assign from membership
 * @typeParam name: string - name is the name from membership
 * @typeParam type_membership_id: string - it's an identifier from type of membership
 * @typeParam purchase_date: string - it's the membership purchase date
 * @typeParam initial_date: string - it's the date the membership begins
 * @typeParam expiration_date: string - it's the date the membership ends
 * @typeParam is_active: boolean - this state define if membership is active
 * @typeParam company_id: string - it's an identifier from company
 * @typeParam payment_status: string - it's the current status from payment
 * @typeParam payment_method: string - it show information about the payment
 * @typeParam total: string - it's the total value from membership
 * @typeParam created_at: string - it's the date when the membership is created
 * @typeParam updated_at: string - it's the date when the membership is updated
 * @typeParam begin_date: string - Optional date when the membership begin
 * @typeParam ends_date: string - Optional date when the membership ends
 * @typeParam period_membership: string - Optional period membership
 * @typeParam modules: IGenericRecord[] - Membership's modules
 */
export interface IMembership {
    id: string;
    name: string;
    type_membership_id: string;
    purchase_date: number;
    initial_date: number;
    expiration_date: number;
    is_active: boolean;
    company_id: string;
    payment_status: string;
    payment_method: string;
    total: number;
    created_at: number;
    updated_at: number;
    begin_date?: string;
    ends_date?: string;
    period_membership?: string;
    modules: IGenericRecord[];
}

/**
 * This interface describes that properties the report structure send
 *
 * @typeParam user_id: string - identifier from user
 * @typeParam membership_id: string - is an identifier from membership
 * @typeParam period_membership: string - Optional range date from membership
 */
export interface IReportMembership {
    user_id: string;
    membership_id: string;
    period_membership?: string;
}

/**
 * This interface describes that properties the modules membership receives
 *
 * @typeParam id: number - Id's module
 * @typeParam name: string - Name's module
 * @typeParam description: string - Description's module
 * @typeParam price_month: number - Optional list  price month modules
 * @typeParam price_semester: number - Optional Price's semester module
 * @typeParam price_semester_month: number - Price's semester per month module
 * @typeParam price_year: number - Optional list price year module
 * @typeParam sub_modules: ISubModules[] - Require list sun modules
 * @typeParam type: string - Require type payment method
 * @typeParam discount: string - Optional discount module
 * @typeParam discountValue: string - Optional value discount module
 */
export interface IModulesMembership {
    id: number;
    name: string;
    description: string;
    price_month?: number;
    price_semester?: number;
    price_semester_month?: number;
    price_year?: number;
    sub_modules?: ISubModules[];
    type: string;
    discount?: string;
    discountValue?: string;
}

/**
 * This interface describes what properties sub module
 * @typeParam id: number - Require id sub module
 * @typeParam name: string - Require name sub module
 * @typeParam modules_id: number - Require id module
 * @typeParam base_price: number - Optional value base module
 * @typeParam price_year: string - Require price per year module
 * @typeParam quantity: number - Require quantity submodules
 * @typeParam price_maintenance_year: number - Require price maintenance per year
 * @typeParam price_month: number - Require price per month module
 * @typeParam price_semester: number - Require price per semester module
 * @typeParam price_semester_month: number - Require price month per semester module
 * @typeParam discount: string - Optional discount module
 * @typeParam discountValue: string - Optional value discount module
 * @typeParam total_discount: number - Optional value discount with 30% added
 * @typeParam isActive: boolean - This is optional and indicates whether the submodule is active.
 * @typeParam isWebsite: boolean - This is optional and indicates if submodule is Web site module.
 * @typeParam customName: string - This is optional and is a name custom.
 * @typeParam withTooltip: boolean - This is optional and is for render a submodule with tooltip.
 */
export interface ISubModules {
    id: number;
    name: string;
    modules_id: number;
    base_price: number;
    price_year: number;
    quantity: number;
    price_maintenance_year: number;
    price_month: number;
    price_semester: number;
    price_semester_month: number;
    discount?: string;
    discountValue?: string;
    total_discount?: number;
    isActive?: boolean;
    isWebsite?: boolean;
    customName?: string;
    withTooltip?: boolean;
}

/**
 * This interface describes the props of the table purchase
 *
 * @typeParam id: number - Optional id sub module
 * @typeParam module: string - Optional name module
 * @typeParam paymentMethod: string - Optional modality of payment of the module
 * @typeParam unitValue: number - Optional unit value
 * @typeParam discount: number - Optional discount module
 * @typeParam total: number - Optional total price module
 * @typeParam paymentDate: number - Optional date payment module
 * @typeParam renovationDate: number - Optional date renovation module
 * @typeParam priceSemester: string - Optional value module
 * @typeParam priceSemester: string - Optional value year
 * @typeParam product: string - Optional product module
 * @typeParam quantity: string - Optional quantity module
 * @typeParam name: string - Optional name module
 * @typeParam idModule: number - Optional id module
 * @typeParam idSubModule: number - Optional id sub module
 * @typeParam description: string - Optional is module name
 * @typeParam disabled: boolean - Optional disabled from modality payment with data
 * @typeParam total_discount: string - Optional value total discount
 * @typeParam total_price_year: string - Optional value total gross value
 */
export interface IDataTablePurchase {
    id?: string;
    module?: string;
    paymentMethod?: string;
    unitValue?: string;
    discount?: string;
    total?: string;
    paymentDate?: string;
    renovationDate?: string;
    priceSemester?: string;
    priceYear?: string;
    product?: string;
    quantity?: string;
    name?: string;
    idModule?: number;
    idSubModule?: number;
    description?: string;
    disabled?: boolean;
    total_discount?: string;
    total_price_year?: string;
}

/**
 * This interface describes the user plans
 *
 * @typeParam website: ISubModules[] - Website plans
 * @typeParam electronicDocuments: ISubModules[] - Electronic document plans
 */
export interface IUserPlans {
    website: ISubModules[];
    electronicDocuments: ISubModules[];
}
