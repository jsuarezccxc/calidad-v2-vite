import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { SelectSearchInput } from '@components/input';
import { Modal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { RadioButton } from '@components/radiobutton';
import { Routes } from '@constants/Paths';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { COLLECTION_OPTIONS } from '@pages/website-inventory/components/form';
import Information from '@pages/website-inventory/components/information';
import { getProductServices } from '@redux/product-catalog/actions';
import { RootState } from '@redux/rootReducer';
import { getWarehouseInitialInventory, getWarehousesData, saveWarehouseInitialInventory } from '@redux/warehouses/actions';
import { sortArrayAlphabetically } from '@utils/Array';
import { buttonsFooterProps } from '@utils/Button';
import { buildOptionsSearch } from '@utils/Company';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import Table from './components/table/Table';
import './WebsiteInventory.scss';
import { IValidations } from './components/table';
import { ADD_INVENTORY } from '.';

const WebsiteInventoryMovement: React.FC = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const [dataToSend, setDataToSend] = useState<IGenericRecord[]>([]);
    const [validate, setValidate] = useState<IValidations>({ validate: false, quantityValidate: false });
    const [isSaveModal, setIsSaveModal] = useState(false);
    const {
        productCatalog: {
            productServices: { data: productServices },
        },
    } = useSelector((state: RootState) => state);
    const { disabledInputs } = usePermissions();

    const [isOutput, setIsOutput] = useState(ADD_INVENTORY);
    const [currentProduct, setCurrentProduct] = useState<IGenericRecord>({});

    const isDualModule =
        pathname === getRoute(Routes.WEBSITE_INVENTORY_MOVEMENTS) || pathname === getRoute(Routes.INVENTORY_MOVEMENTS);

    useEffect(() => {
        dispatch(getProductServices(true));
        dispatch(getWarehousesData(true));
    }, []);

    const handleSelectProduct = async (selectValue: string): Promise<void> => {
        const previousData: IGenericRecord = await dispatch(getWarehouseInitialInventory(selectValue));
        if (previousData) setCurrentProduct(previousData);
    };

    const validateRequiredFields = (): boolean => {
        setValidate({ validate: false, quantityValidate: false });
        const objData = dataToSend?.at(0);
        if (objData?.batches.filter((batch: IGenericRecord) => batch.is_delete).length === objData?.batches.length) return true;
        if (!objData?.batches.filter((batch: IGenericRecord) => !batch.is_delete).length) return false;
        for (const batch of objData.batches) {
            if (
                objData?.is_perishable &&
                (!batch.number ||
                    !batch.date_expired ||
                    !batch.warehouses.filter((warehouse: IGenericRecord) => !warehouse.is_delete).length)
            ) {
                setValidate({ validate: true, quantityValidate: false });
                return false;
            }
            for (const warehouse of batch.warehouses) {
                if (!warehouse.name || !Number(warehouse.quantity)) {
                    setValidate({ validate: true, quantityValidate: false });
                    return false;
                }
                if (warehouse?.originalValue && warehouse?.quantity > warehouse?.originalValue && isOutput !== ADD_INVENTORY) {
                    setValidate({ validate: true, quantityValidate: true });
                    return false;
                }
            }
        }
        setValidate({ validate: false, quantityValidate: false });
        return true;
    };

    const handleSaveWebsiteInventory = async (): Promise<void> => {
        if (validateRequiredFields()) {
            if (await dispatch(saveWarehouseInitialInventory(dataToSend[0]))) setIsSaveModal(!isSaveModal);
            handleSelectProduct(currentProduct.id);
        }
    };

    return (
        <div>
            <Modal
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: ModuleApp.MODALS,
                    action: ActionElementType.SUCCESS,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => setIsSaveModal(!isSaveModal)}
                open={isSaveModal}
            >
                <div className="success-modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        Información Guardada
                    </p>
                    <p className="text-base text-center text-gray-dark">¡Su información ha sido guardada con éxito!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.INVENTORY_MOVEMENTS,
                                submodule: `${ModuleApp.MODALS}-sucess`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => setIsSaveModal(!isSaveModal)}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <Information isDualModule={isDualModule} />
            <form>
                <RadioButton
                    moduleId={ModuleApp.INVENTORY_MOVEMENTS}
                    selected={isOutput}
                    entities={COLLECTION_OPTIONS}
                    setSelected={(isOutput: string): void => setIsOutput(isOutput)}
                    classesContainer="mb-4 gap-8"
                    classesRadioButton="w-60 input-radio"
                />
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.INVENTORY_MOVEMENTS,
                        submodule: `product`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    labelText="Producto"
                    classesWrapper="w-45"
                    optionSelect={sortArrayAlphabetically(buildOptionsSearch(productServices))}
                    isNew
                    classesWrapperInput="bg-white"
                    selectIconType="arrowDownGreen"
                    onChangeSelect={(selectValue): void => {
                        handleSelectProduct(selectValue);
                    }}
                />
            </form>
            <Table
                validations={validate}
                data={currentProduct}
                dataToSend={dataToSend}
                setDataToSend={setDataToSend}
                isOutput={isOutput}
            />
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.INVENTORY_MOVEMENTS, history, getRoute(Routes.WEBSITE_ANALYTICS), {
                    name: getRouteName(Routes.WEBSITE_ANALYTICS),
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
                threeButtons
                disabledCenter={disabledInputs}
                onClickButtonCenter={handleSaveWebsiteInventory}
            />
        </div>
    );
};

export default WebsiteInventoryMovement;
