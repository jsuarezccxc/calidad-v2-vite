import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { getListEmployees } from '@redux/company/actions';
import { PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { lengthGreaterThanZero } from '@utils/Length';
import { ModuleApp } from '@utils/GenerateId';
import { CardDatabase } from './components';
import { DATA_CARDS_MENU } from '.';
import './DatabaseMenu.scss';

const DatabaseMenu: React.FC = () => {
    const [dispatch] = [useDispatch()];
    const history = useHistory();
    const {
        company: { employees },
    } = useSelector(({ company }: RootState) => ({ company }));

    useEffect(() => {
        (async (): Promise<void> => {
            await dispatch(getListEmployees());
        })();
    }, []);

    return (
        <div className="xs:px-2">
            <div className="database-menu">
                <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-left text-base" classContainer="w-full" />
                <h2 className="text-26lg mt-3.5 text-blue font-allerbold">{getRouteName(Routes.DATABASE_MENU)}</h2>
                <p className="text-gray-dark mt-4.5 mb-7 mr-auto">
                    Administre y centralice la información clave de su empresa de manera organizada. Seleccione una de las
                    siguientes secciones para gestionar: productos/servicios, bodegas, clientes, proveedores y empleados. Cada
                    sección le permite agregar, editar y consultar información esencial para optimizar la operación de su empresa.
                    Esta información será útil para la gestión en los módulos de {PRODUCT_NAME}.
                </p>
                <div className="database-menu__container-cards">
                    {DATA_CARDS_MENU(lengthGreaterThanZero(employees.data)).map((item, index) => (
                        <CardDatabase {...item} key={index} />
                    ))}
                </div>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.TECHNICAL_SHEET, history, getRoute(Routes.PRODUCT_DATABASE), {
                    name: '#',
                    moduleName: getRouteName(Routes.DATABASE_MENU),
                })}
            />
        </div>
    );
};

export default DatabaseMenu;
