import { IGenericRecord } from '@models/GenericRecord';

export const groupCities = (cities: IGenericRecord[]): IGenericRecord => {
    if (!cities?.length) return {};
    const data: IGenericRecord = {};
    cities.forEach(item => {
        const code = item.code.replace('"', '').slice(0, 2);
        data[code] = data[code]?.length ? [...data[code], item] : [item];
    });
    return data;
};
