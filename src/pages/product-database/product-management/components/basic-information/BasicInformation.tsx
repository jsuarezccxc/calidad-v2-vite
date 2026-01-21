import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import SunEditor from 'suneditor-react';
import { v4 as uuid } from 'uuid';
import { buildOptionsSearch } from '@utils/Company';
import { removeTags } from '@utils/Text';
import { lengthEqualToZero } from '@utils/Length';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ItemFieldProduct } from '@utils/AssembleProduct';
import { RootState } from '@redux/rootReducer';
import { SearchDropdownPaginate } from '@components/search-dropdown-paginate/SearchDropdownPaginate';
import { Information } from '@components/information';
import { SimpleButton } from '@components/button';
import { Text } from '@components/table-input';
import { Tooltip } from '@components/tooltip';
import { TextInput } from '@components/input';
import { Table } from '@components/table';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { ProductDatabaseContext } from '@pages/product-database/context';
import { BASIC_INFORMATION } from '@information-texts/ProductDatabase';
import informationGreen from '@assets/images/info-green.svg';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { VariantOption } from './components';
import usePopper from '@hooks/usePopper';
import { MAX_LENGHT_DESCRIPTION, getReferences, newVariant, separateVariants } from '.';
import './BasicInformation.scss';

export const BasicInformation: React.FC<IGenericRecord> = ({ unitMeasurement }) => {
    const { utils: options = { unit_measurements: [], main_unit_measurements: [] } } = useSelector(
        (state: RootState) => state.utils
    );

    const {
        variants,
        variantList,
        data,
        setData,
        setVariants,
        isUniqueProduct,
        toggleIsUniqueProduct,
        setVariantList,
        validate,
        edit,
    } = useContext(ProductDatabaseContext);

    const unitOptions = useMemo(() => buildOptionsSearch(options.unit_measurements), [options.unit_measurements]);

    const { disabledInputs } = usePermissions();

    const hasEmptyVariants = useMemo(() => variants.some((variant: IGenericRecord) => !variant.name.trim()), [variants]);

    useEffect(() => {
        handleChangeInVariants();
    }, [variants]);

    const { anchorEl, mouseProps } = usePopper();
    const { anchorEl: anchorVariants, mouseProps: mouseVariants } = usePopper();

    const hoverVariants = {
        mouseProps: { ...mouseVariants },
        anchorElTitle: anchorVariants,
        description: BASIC_INFORMATION.VARIANTS_DESCRIPTION_TOOLTIP,
    };

    const handleChangeVariant = (id: string, value: string): void => {
        setVariants(variants.map((variant: IGenericRecord) => (variant.id === id ? { ...variant, name: value } : variant)));
    };

    const addVariant = (): void => {
        setVariants(variants => [
            ...variants,
            { ...newVariant, id: uuid(), variant_details: [{ edit: true, name: '', id: uuid() }] },
        ]);
    };

    const handleEditVariant = (variantId: string, detailId: string, newName: string, shouldAddNew = false): void => {
        setVariants(variants =>
            variants.map(variant => {
                if (variant.id !== variantId) return variant;
                if (!variant.name && shouldAddNew) {
                    return variant;
                }
                const updatedDetails = variant.variant_details.map((detail: IGenericRecord) => {
                    if (detail.id === detailId) {
                        return { ...detail, name: newName, edit: !shouldAddNew };
                    }
                    return detail;
                });

                if (shouldAddNew) {
                    return {
                        ...variant,
                        variant_details: [...updatedDetails, { name: '', edit: true, id: uuid() }],
                    };
                }

                return { ...variant, variant_details: updatedDetails };
            })
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, variantId: string, detailId: string): void => {
        if (!e.currentTarget.value.length) return;
        if (e.key === 'Enter') {
            handleEditVariant(variantId, detailId, e.currentTarget.value, true);
        }
    };

    const deleteOptionVariant = (variantId: string, optionId: string): void => {
        setVariants(variants =>
            variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          variant_details: variant.variant_details.filter((option: IGenericRecord) => option.id !== optionId),
                      }
                    : variant
            )
        );
    };

    const deleteVariant = (idVariant: string): void => {
        setVariants(variants => variants.filter(variant => variant.id !== idVariant));
    };

    const handleChangeSelect = ({ id }: IGenericRecord): void => {
        id && setData(data => ({ ...data, unit_measurement_id: id }));
    };

    const handleChangeInVariants = (): void => {
        const getVariants = variants?.flatMap(({ variant_details, id: variant_id }: IGenericRecord, index: number) => {
            return variant_details?.flatMap((detail: IGenericRecord) =>
                !detail.edit
                    ? {
                          name: detail.name,
                          id: detail.id,
                          variant_id,
                          order: index + 1,
                      }
                    : []
            );
        });
        const references = separateVariants(getVariants);
        const newReferences = references.length ? getReferences(references) : [];
        const includeVariants = newReferences.map(variant => {
            const normalizedVariantRef = variant.reference.trim().replace(/\s+/g, ' ');

            const oldData = variantList.find((item: IGenericRecord) => {
                const normalizedItemRef = item.reference.trim().replace(/\s+/g, ' ');

                return normalizedItemRef === normalizedVariantRef;
            });
            return {
                id: uuid(),
                ...variant,
                name: `${data.name || ''} ${variant.reference}`,
                reference: variant.reference,
                is_mandate: false,
                sku_internal: '',
                images: [],
                ...(oldData && oldData),
            };
        });

        setVariantList(includeVariants);

        const cleanVariant = variants.map(({ checked, editParent, ...variant }: IGenericRecord) =>
            variant ? variant : { checked, editParent }
        );
        setData({ ...data, variants: cleanVariant });
    };

    const contentEditor = (content: string): void => {
        const plainTextContent = removeTags(content);
        if (plainTextContent.length < MAX_LENGHT_DESCRIPTION)
            setData((data: IGenericRecord) => ({ ...data, description: plainTextContent }));
        return;
    };

    const handleChangeName = ({ target: { value, name } }: IGenericRecord): void => {
        const uniqueProduct = data.unique_products[0];
        setData(data => ({
            ...data,
            [name]: value,
            unique_products: isUniqueProduct ? [{ ...uniqueProduct, name: value }] : data.unique_products,
        }));
    };

    return (
        <div className="product-management__method-add">
            <Information title={BASIC_INFORMATION.TITLE} description={BASIC_INFORMATION.DESCRIPTION} color="blue" />
            <Form className="flex xs:flex-col gap-4.5 mt-2">
                <TextInput
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: 'product-service-name',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Nombre del producto/servicio:"
                    placeholder="..."
                    classesWrapper="basic-information__name"
                    name="name"
                    tooltipInfo
                    value={data.name}
                    descTooltip="nombre único que identifica este artículo."
                    titleTooltip="Nombre del producto/servicio:"
                    onChange={(e): void => handleChangeName(e)}
                    disabled={disabledInputs}
                    required={validate && !data.name}
                />
                <SearchDropdownPaginate
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: 'product-service-unit-measurement',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    onChangeSelected={handleChangeSelect}
                    name={ItemFieldProduct.UnitId}
                    options={unitOptions}
                    firstView={options.main_unit_measurements}
                    valueSelected={unitMeasurement}
                    title="*Unidad de medida:"
                    disabled={disabledInputs}
                    required={validate && !data.unit_measurement_id}
                />
            </Form>
            <div
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-description',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                className="mt-4.5"
            >
                <>
                    <div className="flex mb-2">
                        <img alt="Información" src={informationGreen} className="w-5.5 h-5.5" {...mouseProps} />
                        <span className="ml-2 text-sm text-blue font-allerbold">Descripción del producto/servicio</span>
                    </div>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-description',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        placement="bottom-start"
                        anchorEl={anchorEl}
                        iconName="infoBlue"
                        description={BASIC_INFORMATION.SUN_EDITOR}
                        title={BASIC_INFORMATION.SUN_EDITOR_TITLE}
                    />
                </>
                <SunEditor
                    setDefaultStyle="font-size: .8125rem"
                    name="content"
                    setContents={data.description}
                    height="auto"
                    disable={disabledInputs}
                    onChange={(content): void => contentEditor(content)}
                />
            </div>
            <Information
                title="Variantes"
                color="blue"
                classNameIcon="w-5.5 h-5.5"
                classNameTitle="basic-information__title-variants"
                description={BASIC_INFORMATION.VARIANTS_DESCRIPTION}
                hoverIcon={hoverVariants}
                classNameContainer={`${edit && isUniqueProduct ? 'basic-information__hidden-edit' : 'mt-4.5'}`}
            />
            {isUniqueProduct ? (
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: 'product-service-variants',
                        action: ActionElementType.ADD,
                        elementType: ElementType.BTN,
                    })}
                    className={`${
                        edit && isUniqueProduct ? 'basic-information__hidden-edit' : 'basic-information__add-variants'
                    }`}
                    onClick={(): void => toggleIsUniqueProduct(false)}
                    disabled={disabledInputs}
                >
                    <Icon name="addWhite" classIcon="w-5 h-5" /> Agregar variantes
                </SimpleButton>
            ) : (
                <div className="flex flex-col w-full">
                    <Icon name="trashBlue" onClick={(): void => toggleIsUniqueProduct(true)} classIcon="self-end mt-2" />
                    {BASIC_INFORMATION.VARIANTS_DESCRIPTION_ADD}
                    <Table
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: 'product-service-variants',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        customTable
                        isHeaderRowsCustom
                        data={[]}
                        isNew
                        headerRowsCustom={<TableHeader />}
                        className="basic-information__table-container"
                    >
                        {variants.map((variant: IGenericRecord) => (
                            <tr
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: `product-service-variants-${variant.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={variant.id}
                            >
                                <td className="h-10 xs:h-8.75 border-b border-gray">
                                    <Text
                                        text={variant.name}
                                        type="text"
                                        editTable
                                        name="name"
                                        onChange={(e): void => handleChangeVariant(variant.id, e.target.value)}
                                        className="basic-information__table-input"
                                    />
                                </td>
                                <td className="h-10 xs:h-8.75 border-b border-gray flex gap-2.5 content-center">
                                    {variant.variant_details
                                        ?.filter((option: IGenericRecord) => !option.edit)
                                        ?.map((option: IGenericRecord) => (
                                            <VariantOption
                                                key={option.id}
                                                text={option.name}
                                                actionDelete={(): void => deleteOptionVariant(variant.id, option.id)}
                                            />
                                        ))}
                                    <Text
                                        text={variant.variant_details?.find((detail: IGenericRecord) => detail.edit)?.name}
                                        type="text"
                                        editTable
                                        name="name"
                                        onChange={(e): void =>
                                            handleEditVariant(
                                                variant.id,
                                                variant.variant_details.find((detail: IGenericRecord) => detail.edit)?.id,
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e): void =>
                                            handleKeyPress(
                                                e,
                                                variant.id,
                                                variant.variant_details.find((detail: IGenericRecord) => detail.edit)?.id
                                            )
                                        }
                                        className="basic-information__table-input"
                                    />
                                </td>
                                <td>
                                    <Icon
                                        name="trashBlue"
                                        className={`w-5.5 h-5.5 ${
                                            edit ? 'basic-information__hidden-edit' : 'ml-2 cursor-pointer'
                                        }`}
                                        onClick={(): void => deleteVariant(variant.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {(hasEmptyVariants || (validate && lengthEqualToZero(variants))) && (
                        <label className="mt-2 text-base text-purple">
                            *Ingrese la variante para poder agregar las opciones.
                        </label>
                    )}
                    <span
                        className={`${edit ? 'basic-information__hidden-edit' : 'basic-information__add-variants-table'}`}
                        onClick={addVariant}
                    >
                        +Agregar variante
                    </span>
                </div>
            )}
        </div>
    );
};

const TableHeader: React.FC = () => {
    return (
        <tr>
            <th className="basic-information__table-name">Variantes</th>
            <th className="basic-information__table-options">Opción</th>
            <th className="w-10"></th>
        </tr>
    );
};
