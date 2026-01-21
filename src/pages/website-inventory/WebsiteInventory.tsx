import React from 'react';
import { useLocation } from 'react-router-dom';
import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import WebsiteInventoryMovement from '@pages/website-inventory-movement/WebsiteInventoryMovement';
import { WebsiteInventoryProvider } from './context/WebsiteInventoryProvider';
import Table from './components/table';
import Modals from './components/modals';
import Footer from './components/footer';
import Information from './components/information';
import Form from './components/form';
import './WebsiteInventory.scss';

const WebsiteInventory: React.FC = () => {
    const { pathname } = useLocation();

    const isDualModule =
        pathname === getRoute(Routes.WEBSITE_INVENTORY_MOVEMENTS) || pathname === getRoute(Routes.INVENTORY_MOVEMENTS);

    return pathname === getRoute(Routes.WEBSITE_INVENTORY_MOVEMENTS) ? (
        <WebsiteInventoryMovement />
    ) : (
        <WebsiteInventoryProvider>
            <Modals />
            <Information isDualModule={isDualModule} />
            <section className="flex flex-col">
                <Form isDualModule={isDualModule} />
                <Table />
            </section>
            <Footer />
        </WebsiteInventoryProvider>
    );
};

export default WebsiteInventory;
