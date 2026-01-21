import { isEmpty } from 'lodash';
import { DropdownActions } from '@redux/dropdown/types';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { MONTHS } from '@constants/Date';
import { IChangePercentageDiscount } from '@models/ElectronicInvoice';

/**
 * This function set position in father scroll
 *
 * @param isClose: boolean - state dropdown
 * @param setDropdown: (drop:boolean) => DropdownActions - action dropdown
 * @param dispatch: (action:any) => any) - dispatch action
 * @param idContentTable: string - ID content table
 */
export const scrollByTable = async (
    isClose: boolean,
    setDropdown: (drop: boolean) => DropdownActions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: (action: any) => any,
    idContentTable: string
): Promise<void> => {
    const table = document.getElementById(idContentTable);
    const bodyApp = document.getElementById('bodyApp');
    if (table && bodyApp) {
        const positionScroll = table.scrollLeft;
        await dispatch(setDropdown(isClose));
        bodyApp.scrollBy(positionScroll, 0);
    }
};

export const setZeroValueInInputNumber = ({ target, ...event }: ChangeEvent, name: string): ChangeEvent => ({
    ...event,
    target: { ...target, ...(isEmpty(target.value) ? { value: '0', name } : { name }) },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const validateChangeEvent = (event: any): event is ChangeEvent => event && event.target;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const validateChangePercentage = (event: any): event is IChangePercentageDiscount => event && event.values;

export const dataURLtoFile = (dataURL: string, filename: string): File | null => {
    const arr = dataURL?.split(',');
    const mime = arr[0]?.match(/:(.*?);/);
    if (!mime) return null;
    const mimeType = mime[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mimeType });
};

export const formatMonths = (): IOptionSelect[] => MONTHS.map(item => ({ key: item, value: item }));
