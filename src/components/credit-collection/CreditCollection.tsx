import React from 'react';
import { TextInput } from '@components/input';
import { RadioButton } from '@components/radiobutton';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICreditCollectionProps, COLLECTION_OPTIONS } from '.';

export const CreditCollection: React.FC<ICreditCollectionProps> = ({ data, updateData, validate }) => {
    const emptyField = validate && !data?.collection_days;
    return (
        <div className={`flex items-${emptyField ? 'center' : 'end'} gap-x-7`}>
            <TextInput
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-collection-days`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                labelText="*Días de cobro:"
                placeholder="..."
                value={data?.collection_days}
                onChange={({ target: { value } }): void => updateData({ ...data, collection_days: value })}
                classesWrapper="lg:w-36 w-full"
                classesWrapperInput="required-scroll"
                name="collection_days"
                required={emptyField}
                onlyNumbers
            />
            <RadioButton
                moduleId={ModuleApp.ELECTRONIC_INVOICE}
                classesContainer="required-scroll"
                selected={data?.days_collection_type}
                entities={COLLECTION_OPTIONS}
                setSelected={(value): void => updateData({ ...data, days_collection_type: value })}
            />
        </div>
    );
};
