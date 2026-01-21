import { IGenericRecord } from '@models/GenericRecord';
import { groupCities } from './Cities';
import { CIIUS, CITIES, COUNTRIES, DEPARTMENTS } from '@constants/UtilsConstants';

const ID_VALUES = [COUNTRIES, CITIES, DEPARTMENTS];

export const formatUtils = (utils: IGenericRecord): IGenericRecord => {
    const data: IGenericRecord = {};
    for (const key in utils) {
        const options = utils[key].map((item: IGenericRecord) => ({
            ...item,
            value: ID_VALUES.includes(key) ? item?.id : item?.name,
            name: key == CIIUS ? `${item?.code} - ${item?.name}` : item?.name,
        }));
        data[key] = options;
        if (key === CITIES) data.groupedCities = groupCities(options);
    }
    return data;
};
