import React, { useMemo } from 'react';
import { SelectSearchMultiple } from '@components/select-search';
import { IGenericRecord } from '@models/GenericRecord';
import useSelectSearch from '@hooks/useSelectSearch';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';

export const VariantsTable: React.FC<IGenericRecord> = ({
    variants,
    images,
    selectedImages,
    setSelectedImages,
    selectMainImageTable,
}) => {
    const { showSelectSearch, toggleSelectSearch } = useSelectSearch();

    const listOptions = useMemo(
        () =>
            images.map((variant: IGenericRecord) => ({
                key: variant.id,
                name: variant.name,
                value: variant.id,
            })),
        [images]
    );

    const handleChangeSelect = (newOption: IGenericRecord, name: string): void => {
        const currentOptions = selectedImages[name] || [];
        setSelectedImages({
            ...selectedImages,
            [name]: [...currentOptions, newOption],
        });
    };

    const deleteTag = (param1: IGenericRecord, id: string): void => {
        const newItems = selectedImages[id].filter((item: string) => item !== param1.value);
        setSelectedImages({ ...selectedImages, [id]: newItems });
    };

    return (
        <Table
            id={generateId({
                module: ModuleApp.TABLE,
                submodule: 'images-variants',
                action: ActionElementType.INFO,
                elementType: ElementType.TBL,
            })}
            headerRowsCustom={<TableHeader />}
            isHeaderRowsCustom
            customTable
            data={[]}
            className="add-image__table-container"
            wrapperClassName="add-price-code__table-wrapper"
        >
            {variants?.map((variant: IGenericRecord) => (
                <tr
                    id={generateId({
                        module: ModuleApp.TABLE,
                        submodule: `images-variants-${variant.id}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ROW,
                    })}
                    key={variant.id}
                >
                    <td className="add-image__table-row">{variant.name}</td>
                    <td className="add-image__table-row">
                        <SelectSearchMultiple
                            options={listOptions}
                            onChange={handleChangeSelect}
                            value={selectedImages[variant.id]}
                            name={`${variant.id}`}
                            showList={showSelectSearch}
                            toggleSelectSearch={toggleSelectSearch}
                            inputClass="add-image__table-search"
                            deleteTag={deleteTag}
                        />
                    </td>
                    <td className="add-image__table-row">
                        {variant?.images?.map((imageId: string, index: number) => (
                            <div
                                key={`image-${index}-${imageId}`}
                                className="relative items-center inline-block w-10 h-10 gap-1 ml-2 cursor-pointer product-management__render-image-table"
                                style={{
                                    backgroundImage: `url(${
                                        images.find((imageFile: IGenericRecord) => imageFile.id === imageId)?.url
                                    })`,
                                }}
                                onClick={(): void => selectMainImageTable(variant.id, imageId)}
                            >
                                {variant.bucket_details_main_id === imageId && (
                                    <div className="product-management__hover-image-table">
                                        <Icon name="starYellow" classIcon="w-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </td>
                </tr>
            ))}
        </Table>
    );
};

export const TableHeader: React.FC<IGenericRecord> = () => {
    return (
        <tr>
            <th className="add-image__table-name">Nombre</th>
            <th className="add-image__table-select">*Imagenes</th>
            <th className="add-image__table-main-image">Imagen principal</th>
        </tr>
    );
};
