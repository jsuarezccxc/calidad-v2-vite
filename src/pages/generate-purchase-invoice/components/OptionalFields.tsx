import React from 'react';
import { SelectSearchInput, TextInput } from '@components/input';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { FieldName } from '@models/PurchaseInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { buildOptions } from '@utils/Company';
import usePermissions from '@hooks/usePermissions';
import { getFieldProps, ID_KEY, IFieldsProps } from '.';

export const OptionalFields: React.FC<IFieldsProps> = ({ data, handleValueChange, updateData, utils }) => {
    const { disabledInputs } = usePermissions();

    const fieldProps = getFieldProps(data);

    const handleOptionChange = ({ value, id }: IGenericRecord, name = ''): void => {
        const keyId = ID_KEY[name];
        updateData({ ...data, [name]: value, ...(keyId && { [keyId]: id }) });
    };

    const documentTypesRender = buildOptions(utils?.document_types).map(item => ({ ...item, name: item.value }));

    return (
        <CollapseJsx
            title="Información opcional"
            wrapperClass="margin-8"
            data={
                <div className="optional-fields optional-fields--active">
                    <TextInput
                        {...fieldProps[FieldName.PurchaseOrderNumber]}
                        onChange={handleValueChange}
                        disabled={disabledInputs}
                    />
                    <TextInput
                        {...fieldProps[FieldName.PurchasingManager]}
                        onChange={handleValueChange}
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        {...fieldProps[FieldName.ManagerDocumentType]}
                        optionSelect={documentTypesRender}
                        onChangeSelect={(_, e): void => handleOptionChange(e, FieldName.ManagerDocumentType)}
                        disabled={disabledInputs}
                    />
                    <TextInput
                        {...fieldProps[FieldName.PurchasingDocumentNumber]}
                        onChange={handleValueChange}
                        disabled={disabledInputs}
                    />
                </div>
            }
        />
    );
};
