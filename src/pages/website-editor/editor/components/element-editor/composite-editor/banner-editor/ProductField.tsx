import React from 'react';
import editIcon from '@assets/images/edit-blue.svg';
import trashIcon from '@assets/images/trash-blue.svg';
import { IProductFieldProps } from '.';

export const ProductField: React.FC<IProductFieldProps> = ({ chooseToEdit, deleteProduct, index, product }) => {
    const imageNumber = index + 1;

    return (
        <div className="item-field">
            <span className="text-gray-dark text-tiny">Producto {imageNumber}</span>
            <section className="flex gap-1">
                <img src={editIcon} className="w-4.5 cursor-pointer" alt="edit" onClick={(): void => chooseToEdit(product)} />
                <img
                    src={trashIcon}
                    className="w-4.5 cursor-pointer"
                    alt="delete"
                    onClick={(): void => deleteProduct(product.id)}
                />
            </section>
        </div>
    );
};
