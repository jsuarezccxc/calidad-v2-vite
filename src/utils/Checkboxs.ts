import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This function allows get checked items in table
 *
 * @param id: string - Item's id
 * @param selected: IGenericRecord[] - Item's selected
 * @returns boolean
 */
export const getChecked = (id: string, selected: IGenericRecord[]): boolean => {
    return selected.some(
        (ele: IGenericRecord) => (ele.id || ele.unique_product_id || ele.temporaryId || ele.id_item || ele.temporary_id) === id
    );
};

/**
 * This function allows change or add elements selected state
 *
 * @param item: IGenericRecord - Item in table
 * @param selected: IGenericRecord[] - Item's selected
 * @param setSelected: Dispatch<SetStateAction<IGenericRecord[]>> - Optional that dispatch state to change
 * @param itemSelect?: boolean - Optional check if the item was selected or not
 * @param idSelect
 */
export const handleChecked = (
    item: IGenericRecord,
    selected: IGenericRecord[],
    setSelected?: Dispatch<SetStateAction<IGenericRecord[]>>,
    itemSelect?: boolean,
    idSelect?: string
): void => {
    const id = String(
        item[idSelect || ''] || item.id || item.unique_product_id || item.temporaryId || item.id_item || item.temporary_id
    );
    if (setSelected) {
        getChecked(id, selected)
            ? setSelected(
                  selected.filter(
                      item => (item.id || item.unique_product_id || item.temporaryId || item.id_item || item.temporary_id) !== id
                  )
              )
            : setSelected(!itemSelect ? [...selected, { id }] : [...selected, { ...item }]);
    }
};

/**
 * This function toggles the checked state of an item in a list by its row index
 *
 * @param items - IGenericRecord[] - Array of items to update
 * @param row - number - Index of the item to toggle
 * @returns IGenericRecord[]
 */
export const toggleSelectItem = (items: IGenericRecord[], row: number): IGenericRecord[] => {
    return items?.map((item: IGenericRecord, index: number) => ({
        ...item,
        checked: index === row ? !item.checked : item.checked,
    }));
};

/**
 * This function toggles the presence of an item in a list of checked item IDs
 *
 * @param items - string[] - Array of currently checked item IDs
 * @param currentItem - string - ID of the item to toggle
 * @returns string[]
 */
export const toggleCheckedItems = (items: string[], currentItem: string): string[] => {
    return items.includes(currentItem) ? items.filter(id => id !== currentItem) : [...items, currentItem];
};
