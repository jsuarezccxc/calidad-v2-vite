import React, { useEffect, useState } from 'react';
import { ADD_PRODUCT, ADD_TAXES } from '@constants/AssembleProduct';
import useParam from '@hooks/useParam';
import ProductManagement from './product-management';
import ProductCatalog from './product-catalog';
import { ProductDatabaseProvider } from './context/ProductDatabaseProvider';

const ProductDatabase: React.FC = () => {
    const { queryParam } = useParam(ADD_PRODUCT);
    const { queryParam: taxesQueryParam } = useParam(ADD_TAXES);
    const addProduct = Boolean(queryParam);
    const addTaxes = Boolean(taxesQueryParam);

    const [showCatalog, setShowCatalog] = useState(true);

    const toggleShowCatalog = (): void => {
        setShowCatalog(!showCatalog);
    };

    useEffect(() => {
        if (addProduct || addTaxes) {
            setShowCatalog(false);
        }
    }, [addProduct, addTaxes]);

    return (
        <ProductDatabaseProvider>
            <div className="xs:px-2">
                {showCatalog ? (
                    <ProductCatalog toggleShowCatalog={toggleShowCatalog} setShowCatalog={setShowCatalog} />
                ) : (
                    <ProductManagement toggleShowCatalog={toggleShowCatalog} addTaxes={addTaxes} />
                )}
            </div>
        </ProductDatabaseProvider>
    );
};

export default ProductDatabase;
