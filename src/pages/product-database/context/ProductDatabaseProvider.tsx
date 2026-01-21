import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IVariantValues } from '@models/Taxes';
import { IOptionSelect } from '@components/input';
import LocalStorage from '@utils/LocalStorage';
import { LITER_ID } from '@constants/Product';
import { INC_UNTAXED_ID, IVA_UNTAXED_ID, sortRates } from '../product-management/components';
import { ITaxOption } from '..';
import {
    EMPTY_TAX,
    ProductDatabaseContext,
    SectionKeys,
    eTaxes,
    initialData,
    initialRenderTaxes,
    taxValues,
    taxesOptions,
    initialStateSections,
    EDIT_VARIANT_SELECTED,
    UNIQUE_PRODUCT_INDEX,
    NO_EDIT_IMAGE,
    CREATE_IMAGE,
    UNIQUE_WAREHOUSE_INDEX,
    MILLILITER_TEXT,
    LITER_TEXT,
} from '.';

export const ProductDatabaseProvider: React.FC = ({ children }) => {
    const editId = LocalStorage.get(EDIT_VARIANT_SELECTED) ?? '';

    const { productEdit, companyTaxes } = useSelector(({ productCatalog, company }: RootState) => ({
        ...productCatalog,
        ...company,
    }));

    //data
    const [data, setData] = useState<IGenericRecord>(initialData);
    //variants
    const [variants, setVariants] = useState<IGenericRecord[]>([]);
    const [variantList, setVariantList] = useState<IGenericRecord[]>([]);
    //images
    const [images, setImages] = useState<IGenericRecord[]>([]);
    const [selectedImages, setSelectedImages] = useState<IGenericRecord>({});
    const [markedForDeletion, setMarkedForDeletion] = useState<string[]>([]);
    //taxes
    const [localValues, setLocalValues] = useState(taxValues);
    const [taxesRender, setTaxesRender] = useState<Record<string, boolean>>(initialRenderTaxes);
    const [taxesSelectedValues, setTaxesSelectedValues] = useState('');
    const [selectedTaxes, setSelectedTaxes] = useState<ITaxOption[]>(taxesOptions);
    const [ivaRateArray, setIvaRateArray] = useState<IOptionSelect[]>([]);
    const [incRateArray, setIncRateArray] = useState<IOptionSelect[]>([]);
    const [ibuaRateSelected, setIbuaRateSelected] = useState('');
    const [netContent, setNetContent] = useState('');
    const [unitMeasure, setUnitMeasure] = useState('');
    const [variantsNetContent, setVariantsNetContent] = useState<IVariantValues[]>([]);
    //inventory
    const [dataTable, setDataTable] = useState<IGenericRecord[]>([]);

    //functional
    const [isUniqueProduct, setIsUniqueProduct] = useState(true);
    const [sections, setSections] = useState<Record<SectionKeys, boolean>>(initialStateSections);
    const [validate, setValidate] = useState(false);

    const edit = useMemo(() => productEdit?.unique_products?.some((variant: IGenericRecord) => variant.id === editId), [
        editId,
        productEdit,
    ]);

    const productIdEdit = useMemo(() => productEdit.unique_products?.[UNIQUE_PRODUCT_INDEX].product_id, [productEdit]);

    useEffect(() => {
        const filteredValues = Object.fromEntries(Object.entries(localValues).filter(([, value]) => value.tax_id !== ''));
        if (isUniqueProduct) {
            const newTaxes = flattenTaxesWithoutVariants(filteredValues);
            return setData(data => ({
                ...data,
                unique_products: data.unique_products.map((item: IGenericRecord) => ({ ...item, taxes: newTaxes })),
            }));
        }

        const newArrayTaxes = addParentInfoToAllVariants(filteredValues);

        const newProducts = data.unique_products.map((product: IGenericRecord) => {
            const matchingData = newArrayTaxes.filter(item => item.id === product.id);
            if (matchingData) {
                return {
                    ...product,
                    taxes: matchingData.map((tax: IGenericRecord) => ({
                        custom_tall: null,
                        company_tax_id: tax.tax_id,
                        tax_value: tax.tax_value || tax.value,
                    })),
                };
            }
            return product;
        });
        setData(data => ({ ...data, unique_products: newProducts }));
    }, [localValues]);

    useEffect(() => {
        processImageData();
    }, [images]);

    useEffect(() => {
        if (variantList.length) updateVarianData();
    }, [variantList]);

    const updateVariants = (): void => {
        const newVariants = productEdit.variants.map((variant: IGenericRecord) => ({
            ...variant,
            variant_details: variant.variant_details.filter((option: IGenericRecord) => option.name),
        }));
        setVariants(newVariants);
    };

    const buildNonPerishableDataTable = (variant: IGenericRecord): void => {
        const { name, reference } = variant.initial_inventory;
        const newBatches = variant.batches.map((batch: IGenericRecord) => ({
            ...batch,
            warehouses: [...batch.warehouses, batch.warehouses[0]],
        }));

        const newDataTable =
            newBatches?.flatMap((batch: IGenericRecord) => {
                if (!Array.isArray(batch.warehouses)) {
                    return [];
                }
                return (
                    batch.warehouses?.map((warehouse: IGenericRecord, index: number) => ({
                        variantId: variant.id,
                        variant: reference,
                        variantName: name,
                        warehouseId: warehouse.idReference,
                        batchesId: batch.id,
                        render: !index,
                        addWarehouse: batch.warehouses.length - 1 === index,
                        renderBatch: false,
                        totalRows: batch.warehouses.length,
                        id: warehouse.id,
                        warehouse: warehouse.id,
                        quantity: warehouse.quantity,
                        is_perishable: batch.is_perishable,
                        date_expired: '',
                        lot: '',
                    })) || []
                );
            }) || [];

        setDataTable(dataTable => [...dataTable, ...newDataTable]);
    };

    const buildPerishableData = (variant: IGenericRecord): void => {
        const { name, reference } = variant.initial_inventory;

        const newBatches = variant.batches.map((batch: IGenericRecord, index: number) => ({
            ...batch,
            warehouses: [
                ...batch.warehouses,
                batch.warehouses[UNIQUE_WAREHOUSE_INDEX],
                ...(index === variant.batches.length - 1 ? [batch.warehouses[UNIQUE_WAREHOUSE_INDEX]] : []), // Si es el último batch, agrega otro
            ],
        }));

        const totalRows = newBatches.reduce((total: number, item: IGenericRecord) => {
            return total + (item.warehouses ? item.warehouses.length : 0);
        }, 0);

        const newDataTable =
            newBatches?.flatMap((batch: IGenericRecord, batchIndex: number) => {
                const isLastBatch = batchIndex === newBatches.length - 1;
                if (!Array.isArray(batch.warehouses)) {
                    return [];
                }
                return (
                    batch.warehouses?.map((warehouse: IGenericRecord, index: number) => {
                        return {
                            variantId: variant.id,
                            variant: reference,
                            variantName: name,
                            warehouseId: warehouse.idReference,
                            batchesId: batch.id,
                            render: !index && !batchIndex,
                            addWarehouse:
                                batch.warehouses.length - 2 === index && isLastBatch
                                    ? batch.warehouses.length - 2 === index
                                    : batch.warehouses.length - 1 === index,
                            renderBatch: !index,
                            totalRows: totalRows,
                            id: warehouse.id,
                            warehouse: warehouse.id,
                            quantity: warehouse.quantity,
                            is_perishable: batch.is_perishable,
                            date_expired: '',
                            dateBatch: batch.warehouses.length - 1 !== index && batch.date_expired,
                            addBatch: batch.warehouses.length - 1 === index && isLastBatch,
                            lot: batch.warehouses.length - 1 !== index ? batch.number : '',
                            rowBatches: !index && isLastBatch ? batch.warehouses.length - 1 : batch.warehouses.length,
                        };
                    }) || []
                );
            }) || [];
        setDataTable(dataTable => [...dataTable, ...newDataTable]);
    };

    const buildInventoryEdit = (): void => {
        const newInventory = productEdit.unique_products.map((variant: IGenericRecord) => ({
            ...variant,
            batches: (variant?.initial_inventory?.batches ?? []).map((batch: IGenericRecord) => {
                const batchId = uuid();
                return {
                    ...batch,
                    is_perishable: variant.initial_inventory.is_perishable ?? false,
                    id: batch.id ?? batchId,
                    warehouses: batch.warehouses.map((warehouse: IGenericRecord) => {
                        const warehouseId = uuid();
                        return {
                            ...warehouse,
                            idReference: warehouseId,
                        };
                    }),
                };
            }),
        }));

        setData(data => ({
            ...data,
            unique_products: newInventory.map((newVariant: IGenericRecord) => {
                const existingVariant = data.unique_products.find((variant: IGenericRecord) => variant.id === newVariant.id);

                return {
                    ...newVariant,
                    images: existingVariant?.images ?? [],
                };
            }),
        }));

        newInventory.flatMap((variant: IGenericRecord) => {
            return variant.batches.some((batch: IGenericRecord) => batch.is_perishable)
                ? buildPerishableData(variant)
                : buildNonPerishableDataTable(variant);
        }) || [];
    };

    useEffect(() => {
        const includesVariants = !!productEdit.variants?.length;
        const imagesProducts = productEdit.images?.[UNIQUE_PRODUCT_INDEX]?.bucket_details;
        setIsUniqueProduct(!includesVariants);
        if (!Object.keys(productEdit).length) return;
        const uniqueProduct = productEdit.unique_products[UNIQUE_PRODUCT_INDEX];
        if (uniqueProduct) {
            setUnitMeasure(uniqueProduct?.unit_measure_milliliter_id === LITER_ID ? LITER_TEXT : MILLILITER_TEXT);
            setNetContent(uniqueProduct.unit_measure_milliliters ?? '');
        }

        if (includesVariants) {
            updateVariants();

            const existingVariants = productEdit.unique_products.map(
                ({ name, reference, id, sku_internal, unit_value, images }: IGenericRecord) => ({
                    name,
                    reference,
                    id,
                    sku_internal,
                    select: true,
                    images,
                    details: [],
                    unit_value,
                })
            );
            setVariantList(existingVariants);
        }
        const newCategories = productEdit.categories.map((category: IGenericRecord) => ({
            id: category.id,
            name: category.name,
        }));

        setVariantsNetContent(
            productEdit.unique_products.map((variant: IGenericRecord) => ({
                id: variant.id,
                unitMeasureMilliliters:
                    variant.unit_measure_milliliter_id === LITER_ID
                        ? variant.unit_measure_milliliters * 1000
                        : variant.unit_measure_milliliters,
                calculateValue:
                    variant.unit_value + variant.taxes.find((tax: IGenericRecord) => tax.tax_name === eTaxes.IBUA)?.tax_value,
            }))
        );

        const newData = {
            ...productEdit,
            name: uniqueProduct.name,
            categories: newCategories,
            sale_channel: uniqueProduct.sale_channel,
            images: imagesProducts ?? [],
            unique_products: productEdit.unique_products?.map((variant: IGenericRecord) => ({
                ...variant,
                images: variant.images?.map((image: IGenericRecord) => image.bucket_detail_id),
            })),
        };

        if (imagesProducts) {
            setImages(imagesProducts.map((image: IGenericRecord) => ({ ...image, name: image.file_original_name })));
            const idVariants = productEdit.unique_products.map((variant: IGenericRecord) => variant.id);
            const imagesVariants: IGenericRecord = {};

            idVariants.forEach((id: string) => {
                imagesVariants[id] = newData.unique_products?.find((variant: IGenericRecord) => variant.id === id)?.images;
            });

            setSelectedImages(imagesVariants);
        }

        const existingTaxes = productEdit.unique_products[UNIQUE_PRODUCT_INDEX].taxes?.map((tax: IGenericRecord) => tax.tax_name);
        setSelectedTaxes(selectedTaxes =>
            selectedTaxes.map(tax => {
                return existingTaxes.includes(tax.key) ? { ...tax, multiSelectCheck: { value: true } } : tax;
            })
        );
        setTaxesSelectedValues(existingTaxes.join(', '));
        const taxesVariant = productEdit.unique_products[UNIQUE_PRODUCT_INDEX].taxes.map((tax: IGenericRecord) => ({
            ...tax,
            unit_measure_milliliters:
                productEdit.unique_products[UNIQUE_PRODUCT_INDEX].unit_measure_milliliter_id === LITER_ID
                    ? productEdit.unique_products[UNIQUE_PRODUCT_INDEX].unit_measure_milliliters * 1000
                    : productEdit.unique_products[UNIQUE_PRODUCT_INDEX].unit_measure_milliliters,
            unit_value: productEdit.unique_products[UNIQUE_PRODUCT_INDEX].unit_value,
        }));

        const newTaxValues = { ...localValues };
        const groupedTaxes: IGenericRecord = {
            [eTaxes.IVA]: [],
            [eTaxes.ICUI]: [],
            [eTaxes.INC]: [],
            [eTaxes.IBUA]: [],
        };

        const buildTaxes = (): void => {
            existingTaxes.forEach((tax: string) => {
                const existingTax = taxesVariant.find((item: IGenericRecord) => item.tax_name === tax);

                newTaxValues[tax] = {
                    tax_id: existingTax.id,
                    tax_value: existingTax.tax_value,
                    tax_rate: existingTax.tax_rate,
                    tax_calculated_value: existingTax.tax_value,
                    unit_measure_milliliters: existingTax.unit_measure_milliliters,
                    variants: [],
                };
            });
        };

        const buildTaxesVariants = (): void => {
            productEdit.unique_products.forEach((product: IGenericRecord) => {
                product.taxes.forEach((tax: IGenericRecord) => {
                    const taxGroup = groupedTaxes[tax.tax_name];
                    if (taxGroup) {
                        taxGroup.push({
                            ...tax,
                            id: tax.unique_product_id,
                            calculateValue: tax.tax_value + product.unit_value,
                        });
                    }
                });
            });
            existingTaxes.forEach((tax: string) => {
                const existingTax = taxesVariant.find((item: IGenericRecord) => item.tax_name === tax);
                newTaxValues[tax] = {
                    tax_id: existingTax.company_tax_id,
                    tax_value: existingTax.tax_value,
                    tax_rate: existingTax.tax_rate,
                    tax_calculated_value: existingTax.tax_value + existingTax.unit_value,
                    unit_measure_milliliters: existingTax.unit_measure_milliliters,
                    variants: groupedTaxes[tax],
                };
            });
        };

        buildTaxes();
        setLocalValues(newTaxValues);
        buildTaxesVariants();
        setData(newData);
        buildInventoryEdit();
    }, [edit]);

    const handleContentMilliliters = (value: string): void => {
        setNetContent(value);
        if (isUniqueProduct) {
            return setData({
                ...data,
                unique_products: data.unique_products?.map((variant: IGenericRecord) => ({
                    ...variant,
                    unit_measure_milliliters: value,
                })),
            });
        }
    };

    const handleContentMillilitersVariants = (value: string, id: string): void => {
        const existingVariant = variantsNetContent.some(item => item.id === id);
        setVariantsNetContent(variantsNetContent =>
            existingVariant
                ? variantsNetContent.map(variant =>
                      variant.id === id ? { ...variant, unitMeasureMilliliters: Number(value) } : variant
                  )
                : [...variantsNetContent, { unitMeasureMilliliters: Number(value) || 0, id }]
        );
        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((variant: IGenericRecord) =>
                variant.id === id
                    ? {
                          ...variant,
                          unit_measure_milliliters: value,
                      }
                    : variant
            ),
        }));
    };

    const handleUnitMeasureVariant = (value: string, id: string): void => {
        setData(data => ({
            ...data,
            unique_products: data.unique_products.map((variant: IGenericRecord) =>
                variant.id === id
                    ? {
                          ...variant,
                          unit_measure_milliliter_id: value,
                      }
                    : variant
            ),
        }));
    };

    const resetData = (): void => {
        setLocalValues(taxValues);
        setTaxesSelectedValues('');
        setSelectedTaxes(taxesOptions);
        setData(initialData);
        setVariantList([]);
        setVariants([]);
        setVariantsNetContent([]);
        setIbuaRateSelected('');
        setUnitMeasure('');
        setNetContent('');
        setIsUniqueProduct(true);
        setImages([]);
        setSelectedImages([]);
        setDataTable([]);
    };

    const updateVarianData = (): void => {
        const selectedVariants = variantList
            .filter(variant => variant.select)
            .map(({ includes_mandate, select, mandate_id, ...variant }) =>
                variant
                    ? { ...variant, is_mandate: includes_mandate, mandate_id: includes_mandate ? mandate_id : null }
                    : { select, includes_mandate }
            );

        if (selectedVariants) {
            const details = selectedVariants.map((variant: IGenericRecord) => {
                const newVariant = { ...variant };
                (newVariant.unique_product_details = newVariant.details.map((detail: string) => ({
                    variant_detail_id: detail,
                }))),
                    delete newVariant.details;
                return newVariant;
            });

            setData(data => {
                const updatedProducts = details.map(newVariant => {
                    const existingProduct = data.unique_products.find((product: IGenericRecord) => product.id === newVariant.id);

                    return existingProduct
                        ? {
                              ...existingProduct,
                              unit_value: newVariant.unit_value,
                              sku_internal: newVariant.sku_internal,
                              name: newVariant.name,
                          }
                        : { ...newVariant, ...(edit ? { product_id: productIdEdit } : {}) };
                });

                return { ...data, unique_products: updatedProducts };
            });
        }
    };

    const processImageData = (): void => {
        const imagesInDb = productEdit.images?.[UNIQUE_PRODUCT_INDEX]?.bucket_details;
        if (imagesInDb?.length) {
            const idImages = imagesInDb.map((image: IGenericRecord) => image.id);
            setData({
                ...data,
                images: images.map(image => ({
                    name: image.name,
                    file: image.file ?? {},
                    id: image.id,
                    action: idImages.includes(image.id) ? NO_EDIT_IMAGE : CREATE_IMAGE,
                })),
            });
            return;
        }

        setData({
            ...data,
            images: images.map(image => ({ name: image.name, file: image.file ?? {}, id: image.id, action: 1 })),
        });
    };

    const deleteImage = (deleteId: string): void => {
        const imagesInDb = productEdit.images?.[UNIQUE_PRODUCT_INDEX].bucket_details;
        if (imagesInDb?.length) {
            const idImages = imagesInDb.map((image: IGenericRecord) => image.id);
            if (idImages.includes(deleteId)) setMarkedForDeletion(list => [...list, deleteId]);
        }
        setImages(images.filter(image => image.id !== deleteId));
        const newData = data.unique_products.map((product: IGenericRecord) => ({
            ...product,
            main_image: product.main_image === deleteId ? '' : product.main_image,
            images: product.images.filter((item: string) => item !== deleteId),
        }));
        setData({ ...data, unique_products: newData });
    };

    const toggleIsUniqueProduct = (): void => {
        setIsUniqueProduct(!isUniqueProduct);
    };

    const toggleSection = (section: SectionKeys): void => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const closeSections = (): void => {
        setSections(initialStateSections);
    };

    //In this section you will find the tax code for the taxes

    useEffect(() => {
        buildRateArrays();
    }, [companyTaxes]);

    const buildRateArrays = (): void => {
        const tempRateArrays = {
            [eTaxes.IVA]: [] as IOptionSelect[],
            [eTaxes.INC]: [] as IOptionSelect[],
        };
        companyTaxes?.forEach((tax: IGenericRecord) => {
            if (tax.is_active) {
                const rateOption: IOptionSelect = {
                    id: tax.id,
                    key: tax.rate,
                    value: tax.rate_name === null ? `${tax.rate}%` : tax.rate_name,
                };

                if (tax.tax_name === eTaxes.IVA && tax.tax_id !== IVA_UNTAXED_ID) tempRateArrays[eTaxes.IVA].push(rateOption);
                if (tax.tax_name === eTaxes.INC && tax.tax_id !== INC_UNTAXED_ID) tempRateArrays[eTaxes.INC].push(rateOption);
            }
        });

        tempRateArrays[eTaxes.IVA].sort(sortRates);
        tempRateArrays[eTaxes.INC].sort(sortRates);

        setIvaRateArray(tempRateArrays[eTaxes.IVA]);
        setIncRateArray(tempRateArrays[eTaxes.INC]);
    };

    const addParentInfoToAllVariants = (taxesArray: IGenericRecord): IGenericRecord[] => {
        return Object.keys(taxesArray).flatMap(taxKey => {
            const taxInfo = taxesArray[taxKey];

            if (taxInfo.variants && taxInfo.variants.length > 0) {
                return taxInfo.variants.map((variant: IGenericRecord) => ({
                    ...variant,
                    tax_calculated_value: taxInfo.tax_calculated_value,
                    tax_id: taxInfo.tax_id,
                    tax_value: taxInfo.tax_value,
                }));
            }

            return [];
        });
    };

    const flattenTaxesWithoutVariants = (taxesArray: IGenericRecord): IGenericRecord[] => {
        return Object.keys(taxesArray).map(taxKey => {
            const taxInfo = taxesArray[taxKey];

            return {
                custom_tax: null,
                company_tax_id: taxInfo.tax_id,
                tax_value: taxInfo.tax_value,
            };
        });
    };

    const deleteTax = (tax: string): void => {
        setLocalValues(localValues => ({ ...localValues, [tax]: EMPTY_TAX }));
    };

    return (
        <ProductDatabaseContext.Provider
            value={{
                data,
                setData,
                variantList,
                setVariantList,
                toggleIsUniqueProduct,
                isUniqueProduct,
                toggleSection,
                sections,
                variants,
                setVariants,
                selectedImages,
                setSelectedImages,
                images,
                setImages,
                localValues,
                setLocalValues,
                setTaxesRender,
                taxesRender,
                setTaxesSelectedValues,
                taxesSelectedValues,
                setSelectedTaxes,
                selectedTaxes,
                ivaRateArray,
                setIvaRateArray,
                incRateArray,
                setIncRateArray,
                deleteTax,
                setValidate,
                validate,
                closeSections,
                edit,
                productEdit,
                resetData,
                setIbuaRateSelected,
                ibuaRateSelected,
                setNetContent,
                netContent,
                setUnitMeasure,
                unitMeasure,
                setVariantsNetContent,
                variantsNetContent,
                handleContentMilliliters,
                handleContentMillilitersVariants,
                deleteImage,
                setDataTable,
                dataTable,
                markedForDeletion,
                buildInventoryEdit,
                handleUnitMeasureVariant,
            }}
        >
            {children}
        </ProductDatabaseContext.Provider>
    );
};
