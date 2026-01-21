import React from 'react';
import { Link } from '@components/button';
import { isExistingCard } from '@utils/Plans';
import { firstLetterToUpperCase, lowerCase } from '@utils/Text';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ICardMethod } from '.';
import './CardMethod.scss';

export const CardMethod: React.FC<ICardMethod> = ({ handleUpdate, cardInfo }) => {
    const lastNumbers = cardInfo?.maskedNumber?.slice(cardInfo?.maskedNumber?.length - 4, cardInfo?.maskedNumber?.length);

    return (
        <div
            id={generateId({
                module: ModuleApp.PAYMENT_METHODS,
                submodule: 'card-method',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CRD,
            })}
            className="card-method"
        >
            <label className="card-method--title">Tarjetas agregadas</label>
            <div className="option">
                {isExistingCard(cardInfo) && (
                    <label className="option--title">
                        {firstLetterToUpperCase(lowerCase(cardInfo?.paymentMethod))} **** **** **** {lastNumbers}
                    </label>
                )}
                <Link
                    id={generateId({
                        module: ModuleApp.PAYMENT_METHODS,
                        submodule: 'card-method',
                        action: ActionElementType.UPDATE,
                        elementType: ElementType.LNK,
                    })}
                    href="#"
                    text="+Actualizar método de pago"
                    classes="ml-2"
                    onClick={(): void => handleUpdate()}
                />
            </div>
        </div>
    );
};
