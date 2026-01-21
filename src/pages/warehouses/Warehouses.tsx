import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailWarehouse, getDynamicData, getWarehousesData } from '@redux/warehouses/actions';
import { PageTitle } from '@components/page-title';
import { paginationDataFormat } from '@constants/PaginationBack';
import { RootState } from '@redux/rootReducer';
import { getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { ID } from '@constants/BuildProduct';
import useParam from '@hooks/useParam';
import { AddWarehouses, WarehouseDetail, WarehouseList } from './components';
import { dynamicData } from '.';

const Warehouses: React.FC = () => {
    const { warehouseList: { data: warehouseList, ...metaTable } = paginationDataFormat, warehouseDetail } = useSelector(
        (state: RootState) => state.warehouses
    );

    const { queryParam: detail } = useParam('detail');
    const { queryParam: mode } = useParam('mode');
    const { queryParam: idEdit } = useParam(ID);

    const warehouseEdit = useMemo(() => warehouseList?.find(warehouse => warehouse.id === idEdit), [idEdit, warehouseList]);

    const dispatch = useDispatch();

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getDynamicData(dynamicData)), dispatch(getWarehousesData())]);
        })();
    }, []);

    useEffect(() => {
        if (detail) dispatch(getDetailWarehouse(detail));
    }, [detail]);

    const renderContent = (): React.ReactNode => {
        if (detail) return <WarehouseDetail warehouse={warehouseDetail} />;
        if (!warehouseList?.length || mode === 'add') return <AddWarehouses warehouseList={warehouseList} />;
        if (mode === 'edit' && idEdit)
            return <AddWarehouses edit={idEdit} warehouseEdit={warehouseEdit} warehouseList={warehouseList} />;
        return <WarehouseList warehouseList={warehouseList} metaTable={metaTable} />;
    };

    return (
        <div className="xs:px-2">
            <PageTitle title={getRouteName(Routes.DATABASE_MENU)} />
            {renderContent()}
        </div>
    );
};

export default Warehouses;
