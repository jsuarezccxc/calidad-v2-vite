import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from '@components/form';
import { Switch } from '@components/switch';
import { SimpleButton } from '@components/button';
import { ChangeEvent, ImageInput } from '@components/input';
import { IMAGE_WEIGHT_ERROR, MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ONE } from '@constants/Numbers';
import { ZERO } from '@constants/UtilsConstants';
import { ElementOption } from '@models/WebsiteNode';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { uploadImage } from '@redux/website-node/actions';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import PriceRangeManager from './PriceRangeManager';
import { Select } from '../../select';
import { TextFields } from '../components';
import { DEFAULT_PRICE_RANGE, Filter, OPTIONS } from '../..';
import { CatalogModalThree, FilterOption } from '.';

export const CatalogEditor: React.FC = () => {
    const dispatch = useDispatch();

    const { handleSettingChange, selectedElement, saveElement } = useContext(ElementsContext);
    const [selectProduct, setSelectProduct] = useState(false);
    const [isSizeExceeded, setIsSizeExceeded] = useState<boolean>(false);

    const handleImageChange = async ({ target }: ChangeEvent): Promise<void> => {
        if (!target.files) return;
        if (target.files[ZERO].size > MAXIMUM_IMAGE_SIZE) {
            setIsSizeExceeded(true);
            return;
        }
        const src = String(await dispatch(uploadImage(target.files[ZERO])));
        if (src) {
            handleSettingChange({ name: 'imageBannerFile', value: src });
            setIsSizeExceeded(false);
        }
    };

    const deleteImage = (): void => {
        handleSettingChange({ name: 'imageBannerFile', value: '' });
    };

    useEffect(() => {
        handleItemPerPage();
    }, [selectedElement?.setting?.itemsPerPage]);

    const handleItemPerPage = (): void => {
        selectedElement &&
            saveElement({ ...selectedElement, style: { ...selectedElement?.style, top: selectedElement?.style?.top + ONE } });
    };

    const handleFilterChange = (value: string): void => {
        const prevFilters = selectedElement?.setting?.filters || '';
        const wasPresent = prevFilters.includes(Filter.PRICE_RANGE);
        const isPresent = value.includes(Filter.PRICE_RANGE);

        if (!selectedElement) return;

        let newPriceRanges = selectedElement?.setting?.priceRanges || [];

        if (!wasPresent && isPresent) {
            newPriceRanges = [DEFAULT_PRICE_RANGE];
        } else if (wasPresent && !isPresent) {
            newPriceRanges = [];
        }

        saveElement({
            ...selectedElement,
            setting: {
                ...selectedElement?.setting,
                filters: value,
                priceRanges: newPriceRanges,
            },
        });
    };

    return (
        <>
            {selectProduct && (
                <CatalogModalThree
                    toggleModal={(): void => setSelectProduct(false)}
                    handleSettingChange={(products): void => handleSettingChange({ name: 'productList', value: products })}
                    dataSelectProducts={selectedElement?.setting?.productList}
                />
            )}
            <Form className="pt-1">
                {selectedElement?.option === ElementOption.Two && (
                    <>
                        <h3 className="my-2 composite-editor__caption">¿Visualizar banner de imágenes?</h3>
                        <Switch
                            checked={selectedElement?.setting?.imageBanner ?? true}
                            handleChange={({ target: { checked } }): void =>
                                handleSettingChange({ name: 'imageBanner', value: checked })
                            }
                        />
                        {selectedElement?.setting?.imageBanner && (
                            <div className="mb-4.5 mt-2.5">
                                <p className="mb-2 text-left text-tiny text-blue font-allerbold">Banner catálogo:</p>
                                <ImageInput
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `editor-composite-element-catalog-image`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.UPL,
                                    })}
                                    placeholder="Subir archivo jpg, jpeg, png"
                                    customHandleChangeImage={handleImageChange}
                                    image={{ src: selectedElement?.setting?.imageBannerFile }}
                                    name="src"
                                    cleanImage={deleteImage}
                                    classesWrapper="mr-2"
                                />
                                {isSizeExceeded && <p className="text-purple text-tiny w-41">{IMAGE_WEIGHT_ERROR}</p>}
                            </div>
                        )}
                    </>
                )}
                <TextFields item="product" labelText="Nombre productos/servicios" />
                <h3 className="composite-editor__caption mt-4.5">Valor unitario productos/servicios</h3>
                <h3 className="my-2 composite-editor__caption">
                    ¿Visualizar el valor unitario de sus productos/servicios en su sitio web?
                </h3>
                <Switch
                    checked={selectedElement?.setting?.showUnitValue ?? true}
                    handleChange={({ target: { checked } }): void =>
                        handleSettingChange({ name: 'showUnitValue', value: checked })
                    }
                />
                {selectedElement?.setting?.showUnitValue && <TextFields item="price" wrapperClassName="mt-2" />}
                {selectedElement?.option === ElementOption.Three && (
                    <>
                        <h3 className="my-2 composite-editor__caption">¿Visualizar banner de prductos destacados?</h3>
                        <Switch
                            checked={selectedElement?.setting?.productsBanner ?? true}
                            handleChange={({ target: { checked } }): void =>
                                handleSettingChange({ name: 'productsBanner', value: checked })
                            }
                        />
                        {selectedElement?.setting?.productsBanner && (
                            <SimpleButton
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `editor-composite-element-catalog-products-selected`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                className="mt-4.5 text-tiny text-green"
                                onClick={(): void => setSelectProduct(true)}
                            >
                                + Seleccionar productos a destacar
                            </SimpleButton>
                        )}
                    </>
                )}
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-catalog-items-per-page`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    handleChange={(value): void => handleSettingChange({ name: 'itemsPerPage', value })}
                    isStyle={false}
                    labelText="Número de productos/servicios por página"
                    options={OPTIONS.PAGINATOR_ITEMS}
                    value={selectedElement?.setting?.itemsPerPage}
                />
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-catalog-ordering`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    handleChange={(value): void => handleSettingChange({ name: 'ordering', value })}
                    isStyle={false}
                    labelText="Ordenar por"
                    options={OPTIONS.ORDERING}
                    wrapperClassName="mt-2"
                    value={selectedElement?.setting?.ordering}
                />
                <h2 className="composite-editor__title mt-7 mb-4.5">Búsqueda</h2>
                <div className="catalog-config">
                    <Select
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-catalog-filters`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        customOption={FilterOption}
                        handleChange={(value): void => handleFilterChange(value)}
                        isStyle={false}
                        labelText="Filtros"
                        multiple
                        options={OPTIONS.FILTERS}
                        value={selectedElement?.setting?.filters || ''}
                        wrapperClassName="select__filters"
                    />
                    {selectedElement?.setting?.filters?.includes(Filter.PRICE_RANGE) && (
                        <PriceRangeManager
                            priceRanges={selectedElement?.setting?.priceRanges}
                            onUpdate={(ranges): void => handleSettingChange({ name: 'priceRanges', value: ranges })}
                        />
                    )}
                    <TextFields wrapperClassName="w-56" item="category" labelText="Nombre categoría" />
                </div>
            </Form>
        </>
    );
};
