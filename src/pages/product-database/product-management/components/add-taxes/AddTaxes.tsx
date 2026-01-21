import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ProductDatabaseContext, initialRenderTaxes } from '@pages/product-database/context';
import { ITaxOption } from '@pages/product-database';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Information } from '@components/information';
import { BreadCrumb } from '@components/bread-crumb';
import { MultiSelectInput } from '@components/input';
import { PageTitle } from '@components/page-title';
import { ModalType } from '@components/modal';
import { ADD_TAXES, EDIT } from '@information-texts/ProductDatabase';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { NEW_VERSION } from '@constants/AssembleProduct';
import { Routes } from '@constants/Paths';
import { Ibua } from './components/Ibua';
import { Icui, Inc, Iva } from './components';
import { SectionKeys, conflictTax, routesAddTaxes } from '.';
import './AddTaxes.scss';

export const AddTaxes: React.FC<IGenericRecord> = ({ showCatalog }) => {
    const {
        toggleSection,
        setTaxesRender,
        taxesRender,
        setTaxesSelectedValues,
        taxesSelectedValues,
        setSelectedTaxes,
        selectedTaxes,
        ivaRateArray,
        incRateArray,
        edit,
    } = useContext(ProductDatabaseContext);

    const history = useHistory();

    const [taxError, setTaxError] = useState('');

    useEffect(() => {
        const result: Record<SectionKeys, boolean> = { ...initialRenderTaxes };

        selectedTaxes.forEach((item: IGenericRecord) => {
            const key = item.key.toUpperCase() as SectionKeys;
            result[key] = item.multiSelectCheck.value;
        });

        setTaxesRender(result);
    }, [taxesSelectedValues]);

    const handleChangeTaxes = (e: ITaxOption): void => {
        if (conflictTax[e.key] && taxesSelectedValues.includes(conflictTax[e.key])) return setTaxError(e.key);

        const updatedTaxes = selectedTaxes.map(tax =>
            tax.key === e.key ? { ...tax, multiSelectCheck: { value: !tax.multiSelectCheck.value } } : tax
        );

        setSelectedTaxes(updatedTaxes);

        const selectValue = updatedTaxes
            .filter(tax => tax.multiSelectCheck.value)
            .map(tax => tax.key)
            .join(', ');

        setTaxesSelectedValues(selectValue);
    };

    const handleErrorTaxes = (): void => {
        const updatedTaxes = selectedTaxes.map(tax =>
            tax.key === taxError || tax.key === conflictTax[taxError]
                ? { ...tax, multiSelectCheck: { value: !tax.multiSelectCheck.value } }
                : tax
        );

        setSelectedTaxes(updatedTaxes);

        const selectValue = updatedTaxes
            .filter(tax => tax.multiSelectCheck.value)
            .map(tax => tax.key)
            .join(', ');

        setTaxesSelectedValues(selectValue);
        setTaxError('');
    };

    const toggleRenderTaxes = (option: SectionKeys): void => {
        setTaxesRender(taxesRender => ({ ...taxesRender, [option]: !taxesRender[option] }));
        const updatedTaxes = selectedTaxes.map(tax =>
            tax.key === option ? { ...tax, multiSelectCheck: { value: !tax.multiSelectCheck.value } } : tax
        );

        setSelectedTaxes(updatedTaxes);

        const selectValue = updatedTaxes
            .filter(tax => tax.multiSelectCheck.value)
            .map(tax => tax.key)
            .join(', ');

        setTaxesSelectedValues(selectValue);
    };

    return (
        <div className="add-taxes">
            <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-base" />
            <BreadCrumb routes={routesAddTaxes(showCatalog, (): void => toggleSection('taxes'), edit)} />
            <Information
                title={edit ? EDIT.TITLE_TAX : ADD_TAXES.TITLE}
                color="blue"
                classNameTitle="product-management__title"
                description={edit ? ADD_TAXES.DESCRIPTION(edit) : ADD_TAXES.DESCRIPTION()}
            />
            <div className="mt-5 product-management__add-taxes">
                <MultiSelectInput
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                        submodule: `database-inventory-taxes`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    classesWrapper="w-full lg:w-73 mt-2"
                    labelText="Impuestos:"
                    classListSelect
                    options={selectedTaxes}
                    isNewSelect
                    newSelectFields={{
                        trashClick: (): void => {},
                        editClick: (): void => {},
                        footerClick: (): void => history.push(`${getRoute(Routes.GENERAL_TAX_SETTINGS)}?${NEW_VERSION}=true`),
                        nameFooter: '+ Agregar nuevo impuesto',
                        isEdit: false,
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    optionSelected={(option: any): void => handleChangeTaxes(option)}
                    value={taxesSelectedValues}
                />
                {taxesRender.IVA && <Iva toggleRenderTaxes={toggleRenderTaxes} ivaRateArray={ivaRateArray} />}
                {taxesRender.IBUA && <Ibua toggleRenderTaxes={toggleRenderTaxes} />}
                {taxesRender.ICUI && <Icui toggleRenderTaxes={toggleRenderTaxes} />}
                {taxesRender.INC && <Inc toggleRenderTaxes={toggleRenderTaxes} incRateArray={incRateArray} />}
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                titleButtonLeft="Atras"
                onClickButtonLeft={(): void => {
                    toggleSection('taxes');
                }}
            />
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}-add-taxes`}
                iconName="triangleInfoMulticolor"
                open={!!taxError.length}
                handleClosed={(): void => {
                    setTaxError('');
                }}
                otherButton={{ textButton: 'cancelar', onClick: (): void => setTaxError('') }}
                finalAction={(): void => {
                    handleErrorTaxes();
                }}
                text={{
                    title: 'Información',
                    description: (
                        <>
                            Tenga en cuenta que si selecciona <span className="font-allerbold">{taxError}</span>, no podrá
                            seleccionar la opción de <span className="font-allerbold">{conflictTax[taxError]}</span>
                        </>
                    ),
                }}
            />
        </div>
    );
};
