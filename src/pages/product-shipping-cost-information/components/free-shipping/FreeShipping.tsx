import React from 'react';
import { NumberFormatInput } from '@components/table-input';
import { Form } from '@components/form';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';

export const FreeShipping: React.FC<IGenericRecord> = ({ freeShipping = 0, setFreeShipping = (): void => {} }) => {
    const { disabledInputs } = usePermissions();
    return (
        <Form className="shipping-cost__free-shipping bg-green-scrollbar">
            <div className="shipping-cost__free-shipping-title">Valor de compra para envío gratuito</div>
            <div className="bg-white shipping-cost__free-shipping-value">
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `product-shipping-cost-free-shipping`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    value={freeShipping}
                    allowNegative={false}
                    containerClass="field-money"
                    inputClass="field-money__input"
                    onChange={({ value }): void => setFreeShipping(value)}
                    maxLength={11}
                    disabled={disabledInputs}
                    fixedDecimalScale
                />
            </div>
        </Form>
    );
};
