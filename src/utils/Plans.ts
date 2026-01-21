import { ELECTRONIC_DOCUMENTS, WEBSITE } from '@constants/Plans';
import type { IGenericRecord } from '@models/GenericRecord';
import { IModulesMembership, ISubModules, IUserPlans } from '@models/Membership';

/**
 * Buy button text based on plan status
 */
export enum CardButtonText {
    Active = 'Activo',
    Added = 'Agregado',
    BuyNow = 'Comprar ahora',
    ChangePlan = 'Cambiar plan',
    ViewDetails = 'Ver detalle',
}

/**
 * This returns the submodules
 *
 * @param memberships: IGenericRecord[] - Membership list
 * @returns IGenericRecord[]
 */
export const getSubmodules = (memberships: IGenericRecord[] = []): IGenericRecord[] => {
    const submodules: IGenericRecord[] = [];

    memberships
        .flatMap((item: IGenericRecord) => item.modules)
        .forEach(({ expiration_date, initial_date, membership_submodules, name: moduleName }) =>
            membership_submodules.forEach(({ name, ...submodule }: IGenericRecord) => {
                submodules.push({
                    ...submodule,
                    name: `${moduleName} - ${name}`,
                    expiration_date,
                    initial_date,
                });
            })
        );

    return submodules;
};

/**
 * This returns the active plans
 *
 * @param activeMemberships: IGenericRecord[] - Active memberships
 * @returns IGenericRecord
 */
const getActivePlans = (activeMemberships: IGenericRecord[]): IGenericRecord => {
    const modules = getSubmodules(activeMemberships);

    const plans: IGenericRecord = { website: {}, electronicDocuments: {} };
    modules
        ?.sort((currentItem, nextItem) => currentItem?.price - nextItem?.price)
        ?.forEach(item => {
            if (item.name.includes(WEBSITE)) plans.website = item;
            if (item.name.includes(ELECTRONIC_DOCUMENTS)) plans.electronicDocuments = item;
        });

    return plans;
};

/**
 * This returns plans
 *
 * @param modules: IModulesMembership[] - List of modules
 * @param data: { activeMemberships: IGenericRecord[]; module: string } - Plan data
 * @returns ISubModules[]
 */
const getPlans = (
    modules: IModulesMembership[] = [],
    { activeMemberships, module }: { activeMemberships: IGenericRecord[]; module: string }
): ISubModules[] => {
    const activePlans = getActivePlans(activeMemberships);
    const parentModule = modules?.find(({ name }) => name === module);
    return (parentModule?.sub_modules ?? [])?.map(item => {
        const activePlan = module === WEBSITE ? activePlans.website : activePlans.electronicDocuments;
        return {
            ...item,
            parentId: parentModule?.id,
            isActive: activePlan.sub_module_id === item.id,
        };
    });
};

/**
 * This returns user plans
 *
 * @param modules: IModulesMembership[] - List of modules
 * @param activeMemberships: IGenericRecord[] - active memberships
 * @returns IUserPlans
 */
export const getUserPlans = (modules: IModulesMembership[] = [], activeMemberships: IGenericRecord[]): IUserPlans => ({
    website: getPlans(modules, { activeMemberships, module: WEBSITE }),
    electronicDocuments: getPlans(modules, { activeMemberships, module: ELECTRONIC_DOCUMENTS }),
});

/**
 * This returns the active plan
 *
 * @param submodules: ISubModules[] - List of submodules
 * @returns ISubModules | undefined
 */
export const getActivePlan = (submodules: ISubModules[] = []): ISubModules | undefined => {
    return submodules.find(submodule => submodule.isActive);
};

/**
 * This returns the purchase card button text
 *
 * @param card: IGenericRecord - Card data
 * @param plan: { plan: IGenericRecord; hasActivePlan: boolean } - Plan data
 * @param toggleLogin: () => void - Optional function toggle
 * @returns string
 */
export const getButtonText = (
    card: IGenericRecord,
    { plan, hasActivePlan }: { plan: IGenericRecord; hasActivePlan: boolean },
    toggleLogin?: () => void
): string => {
    if (card.isActive) return CardButtonText.Active;
    if (toggleLogin) return CardButtonText.BuyNow;
    return plan?.name === card.name ? CardButtonText.Added : hasActivePlan ? CardButtonText.ChangePlan : CardButtonText.BuyNow;
};

/**
 * This indicates whether the card exists
 *
 * @param card: IGenericRecord - Optional card data
 * @returns boolean
 */
export const isExistingCard = (card = {}): boolean => {
    if (Array.isArray(card)) return false;
    return !!Object.keys(card).length;
};
