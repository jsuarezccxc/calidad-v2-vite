import dayjs from '@utils/Dayjs';
import { getDateFormat, getDateFromUnix } from './Date';
import { IGenericRecord } from '@models/GenericRecord';
import { IModulesMembership } from '@models/Membership';

const currentDateWithDash = getDateFormat(new Date()).dateWithDash;

export const membershipDaysAvailable = (expirationDate = currentDateWithDash): number =>
    dayjs(getDateFromUnix(Number(expirationDate))?.formatYearMonthDay).diff(dayjs(currentDateWithDash), 'day') || 0;

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

export const getActivePlans = (activeMemberships: IGenericRecord[]): IGenericRecord => {
    let higherDocumentsPrice = 0;
    const modules = getSubmodules(activeMemberships);

    const plans: IGenericRecord = { website: {}, electronicDocuments: {} };

    modules.forEach(item => {
        if (item.name.includes(WEBSITE)) plans.website = item;
        if (item.price > higherDocumentsPrice) higherDocumentsPrice = item.price;
    });

    return {
        ...plans,
        electronicDocuments: modules.find(item => item.price === higherDocumentsPrice) ?? {},
    };
};

export const getActivePlan = (modules: IModulesMembership[], module: string): IGenericRecord => {
    const parentModule = modules?.find(({ name }) => name === module);
    const subModules = parentModule?.sub_modules ?? [];
    const maxValue = Math.max(...subModules.map(item => item.price_year));
    return subModules.find(item => item.price_year === maxValue) ?? {};
};

export const WEBSITE = 'Sitio web y tienda virtual';
