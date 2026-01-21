import { WEBSITE_VIRTUAL_STORE_SERVICES_ID } from '@constants/Memberships';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import { IGenericRecord } from '@models/GenericRecord';

export enum ItemFieldProduct {
    CategoryId = 'category_id',
    Categories = 'categories',
    IncludeTax = 'is_include_tax',
    Inventory = 'is_inventoriable',
    Id = 'id',
    IsPerishable = 'is_perishable',
    IsProduct = 'is_product',
    LedgerAccountId = 'ledger_account_id',
    Name = 'name',
    ProductTypeId = 'product_type_id',
    Sku = 'sku_internal',
    Type = 'type',
    TransactionType = 'type_transaction',
    UnitId = 'unit_measurement_id',
    UnitName = 'unit_measurement_name',
    UnitValue = 'unit_value',
    TaxIvaId = 'tax_iva_id',
    TaxConsumptionId = 'tax_consumption_id',
    Variants = 'variants',
    Mandate = 'is_mandate',
    MandateName = 'mandate',
    MandateId = 'mandate_id',
}

/**
 * Function that detects if the user has the website and virtual store module active
 *
 * @param membershipSelected: IGenericRecord[] - User modules to validate virtual store
 * @returns boolean
 */
export const includesWebsite = (membershipSelected: IGenericRecord[] = []): boolean =>
    membershipSelected.some((item: IGenericRecord) =>
        item.modules.some(
            (module: IGenericRecord) =>
                module.membership_modules_id === WEBSITE_VIRTUAL_STORE_SERVICES_ID ||
                module.name === WEBSITE_DESIGN_AND_ADMINISTRATION
        )
    );
