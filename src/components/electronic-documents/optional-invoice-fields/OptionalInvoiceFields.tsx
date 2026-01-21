import React from 'react';
import { SelectSearchInput, TextInput } from '@components/input';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/PurchaseInvoice';
import usePermissions from '@hooks/usePermissions';
import { buildOptions } from '@utils/Company';
import { getFieldProps, IOptionalInvoiceFieldsProps } from '.';

export const OptionalInvoiceFields: React.FC<IOptionalInvoiceFieldsProps> = ({ data, handleValueChange, updateData, utils }) => {
    const { disabledInputs } = usePermissions();

    const fieldProps = getFieldProps(data);

    const handleOptionChange = ({ value, id }: IGenericRecord, name = ''): void => {
        updateData({ ...data, [name]: value, [`${name}_id`]: id });
    };

    const documentTypesOptionsRender = buildOptions(utils?.document_types?.slice(0, 4)).map(item => ({
        ...item,
        name: item.value,
    }));

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
                    <TextInput {...fieldProps[FieldName.SalesManager]} onChange={handleValueChange} disabled={disabledInputs} />
                    <SelectSearchInput
                        {...fieldProps[FieldName.ManagerDocumentType]}
                        optionSelect={documentTypesOptionsRender}
                        onChangeSelect={(_, e): void => handleOptionChange(e, FieldName.ManagerDocumentType)}
                        disabled={disabledInputs}
                    />
                    <TextInput
                        {...fieldProps[FieldName.ManagerDocumentNumber]}
                        onChange={handleValueChange}
                        disabled={disabledInputs}
                    />
                </div>
            }
        />
    );
};
