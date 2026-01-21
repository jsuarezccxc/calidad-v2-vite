import React from 'react';
import { Icon } from '@components/icon';
import { IItemFieldProps } from '.';

export const ItemField: React.FC<IItemFieldProps> = ({ deleteItem, editItem, index, item, text = 'Botón' }) => {
    const imageNumber = index + 1;
    const textItemField = `${text} ${imageNumber ? imageNumber : ''}`;
    return (
        <div className="item-field">
            <span className="text-gray-dark text-tiny">{textItemField}</span>
            <section className="flex gap-1">
                <Icon classIcon="w-4.5 cursor-pointer" name="editBlue" onClick={(): void => editItem(item)} />
                <Icon classIcon="w-4.5 cursor-pointer" name="trashBlue" onClick={(): void => deleteItem(item.id)} />
            </section>
        </div>
    );
};
