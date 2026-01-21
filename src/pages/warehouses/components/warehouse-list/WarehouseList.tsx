import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BreadCrumb } from '@components/bread-crumb';
import { SimpleButton } from '@components/button';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { Information } from '@components/information';
import { SearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TitleButtons } from '@constants/Buttons';
import { THREE } from '@constants/ElectronicInvoice';
import { paginationDataFormat } from '@constants/PaginationBack';
import { Routes } from '@constants/Paths';
import { INFORMATION } from '@information-texts/Warehouses';
import { IGenericRecord } from '@models/GenericRecord';
import { getWarehousesData } from '@redux/warehouses/actions';
import { RootState } from '@redux/rootReducer';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { WarehousesTable } from './components/WarehousesTable';
import { routesWarehouseList } from '.';
import './WarehouseList.scss';

export const WarehouseList: React.FC<IGenericRecord> = ({ warehouseList, metaTable }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { loader: loaderState } = useSelector(({ loader }: RootState) => ({ ...loader }));

    const [warehouses, setWarehouses] = useState<IGenericRecord>(paginationDataFormat);
    const [searchValue, setSearchValue] = useState('');

    const { WAREHOUSE } = INFORMATION;

    useEffect(() => {
        setWarehouses({ data: warehouseList, ...metaTable });
    }, [warehouseList]);

    useEffect(() => {
        !warehouseList.length && !searchValue && history.push(`${getRoute(Routes.WAREHOUSES)}?mode=add`);
    }, [warehouseList]);

    useEffect(() => {
        if (searchValue?.length >= THREE || !searchValue) dispatch(getWarehousesData(false, searchValue));
    }, [searchValue]);

    return (
        <div>
            <BreadCrumb routes={routesWarehouseList} />
            <Information
                title={WAREHOUSE.TITLE}
                description={WAREHOUSE.DESCRIPTION}
                color="blue"
                classNameTitle="warehouse-list__title"
                classNameSubContainer="flex justify-center"
            />
            <Form className="flex justify-between mt-4.5 xs:flex-col-reverse xs:gap-4.5">
                <SearchInput
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: 'filter-search',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.BTN,
                    })}
                    name="search"
                    labelText="Buscador:"
                    placeholder="..."
                    classesWrapperInput="mb-5 xs:w-full"
                    classesWrapper="relative w-45 xs:w-full"
                    value={searchValue}
                    onChange={(e): void => setSearchValue(e.target.value)}
                />
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        action: ActionElementType.ADD,
                        elementType: ElementType.BTN,
                    })}
                    className="warehouse-list__add-warehouse"
                    onClick={(): void => history.push(`${getRoute(Routes.WAREHOUSES)}?mode=add`)}
                >
                    <Icon name="addWhite" classIcon="w-5 h-5" />
                    Agregar bodega
                </SimpleButton>
            </Form>
            <WarehousesTable setWarehouses={setWarehouses} warehouseList={warehouses} isLoadingTable={loaderState} />
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                    history,
                    getRoute(Routes.CUSTOMER_DATABASE),
                    { name: '', moduleName: '' },
                    TitleButtons.NEXT,
                    getRoute(Routes.DATABASE_MENU)
                )}
            />
        </div>
    );
};
