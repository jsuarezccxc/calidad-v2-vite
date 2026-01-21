import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from '@components/radiobutton';
import { Icon } from '@components/icon';
import { InformativeQuestion } from '@components/informative-question';
import { CREDIT_CARD_OR_DEBIT_CARD } from '@constants/PaymentPlans';
import { INFORMATION } from '@information-texts/PaymentPlans';
import { View, PaymentMethod as PaymentType } from '@models/PaymentPlans';
import { deleteCardToken } from '@redux/payments/actions';
import { RootState } from '@redux/rootReducer';
import { isExistingCard } from '@utils/Plans';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { IPaymentMethodProps, CARD, PAYMENT_METHODS } from '.';

export const PaymentMethod: React.FC<IPaymentMethodProps> = ({ activateView, data, updateData }) => {
    const dispatch = useDispatch();

    const { disabledInputs } = usePermissions();

    const { cardInfo } = useSelector((state: RootState) => state.payments);

    const addNewCard = (): void => {
        activateView(View.Information);
        updateData({ ...data, paymentMethod: PaymentType.Card, deleteCard: true });
    };

    const deleteCard = (): void => {
        dispatch(deleteCardToken());
    };

    const selectMethod = (paymentMethod: string): void => {
        const queryParam = paymentMethod === CARD ? CREDIT_CARD_OR_DEBIT_CARD : paymentMethod;
        updateData({ ...data, paymentMethod, queryParam });
    };

    return (
        <div className="payment-method">
            <InformativeQuestion {...INFORMATION.CARD} />
            <fieldset className="bg-white p-4.5 rounded-lg shadow-card mt-4.5">
                <h3 className="text-green font-allerbold mb-4.5">Método de pago</h3>
                <RadioButton
                    moduleId={ModuleApp.PAYMENT_METHODS}
                    disabled={disabledInputs}
                    selected={data.paymentMethod}
                    setSelected={selectMethod}
                    entities={PAYMENT_METHODS}
                />
            </fieldset>
            <fieldset className="bg-white p-4.5 rounded-lg shadow-card mt-4.5">
                <h3 className="text-green font-allerbold mb-4.5">Tarjetas agregadas</h3>
                {isExistingCard(cardInfo) && (
                    <button
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'existing-card',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.BTN,
                        })}
                        type="button"
                        className="flex items-center gap-2 mb-2"
                        disabled={disabledInputs}
                        {...(!disabledInputs && { onClick: (): void => selectMethod(PaymentType.CardSaved) })}
                    >
                        <div
                            className={`payment-method__radio-button ${
                                data.paymentMethod === PaymentType.CardSaved ? 'payment-method__radio-button--checked' : ''
                            }`}
                        />
                        <p className="lowercase text-gray-dark">
                            {cardInfo?.paymentMethod}&nbsp; **** **** ****
                            {cardInfo?.maskedNumber?.slice(cardInfo?.maskedNumber?.length - 4, cardInfo?.maskedNumber?.length)}
                        </p>
                        <Icon
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'existing-card',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            hoverIcon="trashGreen"
                            className="w-5.5 h-5.5"
                            name="trashBlue"
                            {...(!disabledInputs && { onClick: deleteCard })}
                        />
                    </button>
                )}
                <button
                    id={generateId({
                        module: ModuleApp.PAYMENT_METHODS,
                        submodule: 'new-card',
                        action: ActionElementType.ADD,
                        elementType: ElementType.BTN,
                    })}
                    className={`underline cursor-pointer ${disabledInputs ? 'text-gray' : 'text-green'} `}
                    {...(!disabledInputs && { onClick: addNewCard })}
                    type="button"
                >
                    + Agregar nueva tarjeta
                </button>
            </fieldset>
        </div>
    );
};
