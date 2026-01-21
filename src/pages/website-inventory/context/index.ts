import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { createContext } from 'react';

/**
 * This constant represent not elements
 */
export const NO_ELEMENT = 0;
/**
 * This describes the website inventory context
 *
 * @typeParam productServices: IGenericRecord[] - List of product services available
 * @typeParam warehousesList: IGenericRecord[] - List of warehouse records
 * @typeParam inventoryData: IGenericRecord - Data structure containing the inventory details
 * @typeParam validate: boolean - Flag to determine if the validation should be triggered
 * @typeParam countCheckedElements: number - Number of checked elements in the inventory
 * @typeParam showSaveSuccess: boolean - Flag to show or hide the success message modal after saving data
 * @typeParam showConfirmDeleteModal: boolean - Flag to show or hide the confirm delete modal
 * @typeParam blockIsPerishable: boolean - Flag to block the perishable status of an item
 * @typeParam handleChangeIsPerishable: () => void - Function to handle changes in the perishable status
 * @typeParam handleAddWarehouse: (idBatch: string) => void - Function to add a new warehouse to a batch
 * @typeParam handleAddBatch: () => void - Function to add a new batch
 * @typeParam handleChangeField: (value: string | number | boolean, name: string, idBatch: string, idWarehouse?: string) => void - Function to handle field changes within batches or warehouses
 * @typeParam handleChangeWarehouse: (option: IOptionSelect, idBatch: string, idWarehouse?: string) => void - Function to change warehouse details in a batch
 * @typeParam getWarehousesExcluded: (idBatch: string) => IGenericRecord[] - Function to retrieve a list of warehouses excluded from a batch
 * @typeParam handleTrash: () => void - Function to handle the deletion of selected items
 * @typeParam handleShowModalSuccess: () => void - Function to toggle the display of the success modal
 * @typeParam handleShowConfirmDeleteModal: () => void - Function to toggle the display of the confirm delete modal
 * @typeParam handleSaveWebsiteInventory: () => void - Function to save the current state of website inventory
 * @typeParam handleSelectProduct: (idProduct: string) => void - Function to select a product based on its ID
 * @typeParam totalsQuantities: ITotalsQuantities - Aggregated totals of quantities available for sale and per warehouse
 * @typeParam includesBatchesToDelete: boolean - Flag to indicate if includes batches to delete
 * @typeParam showPerishableModal: boolean - Flag to indicate if show modal perishable
 * @typeParam togglePerishableModal: () => void - Function to close modal perishable
 * @typeParam originalData: IGenericRecord - Original data structure before any modifications
 * @typeParam quantityValidate: boolean - Flag to validate the quantity of items in the inventory
 */
export interface IWebsiteInventoryContext {
    productServices: IGenericRecord[];
    warehousesList: IGenericRecord[];
    inventoryData: IGenericRecord;
    validate: boolean;
    countCheckedElements: number;
    showSaveSuccess: boolean;
    showConfirmDeleteModal: boolean;
    blockIsPerishable: boolean;
    handleChangeIsOutput: (isOutput: string) => void;
    handleChangeIsPerishable: () => void;
    handleAddWarehouse: (idBatch: string) => void;
    handleAddBatch: () => void;
    handleChangeField: (value: string | number | boolean, name: string, idBatch: string, idWarehouse?: string) => void;
    handleChangeWarehouse: (option: IOptionSelect, idBatch: string, idWarehouse?: string) => void;
    getWarehousesExcluded: (idBatch: string) => IGenericRecord[];
    handleTrash: () => void;
    handleShowModalSuccess: () => void;
    handleShowConfirmDeleteModal: () => void;
    handleSaveWebsiteInventory: () => void;
    handleSelectProduct: (idProduct: string, isOutput: string) => void;
    totalsQuantities: ITotalsQuantities;
    showModalErrorDelete: boolean;
    nonRemovableInventory: IGenericRecord[];
    toggleModalErrorDelete: () => void;
    closeModalErrorDelete: () => void;
    includesBatchesToDelete: boolean;
    showPerishableModal: boolean;
    togglePerishableModal: () => void;
    originalData:IGenericRecord;
    quantityValidate: boolean;
}

/**
 * This describes the structure for totaling quantities in the inventory system
 *
 * @typeParam totalAvailableForSale: number - Total quantity of items available for sale across all warehouses
 * @typeParam availablePerWarehouse: IGenericRecord - Record detailing the quantities available per specific warehouse
 */
export interface ITotalsQuantities {
    totalAvailableForSale: number;
    availablePerWarehouse: IGenericRecord;
}

/**
 * Website Inventory context
 */
export const WebsiteInventoryContext = createContext<IWebsiteInventoryContext>({
    productServices: [],
    warehousesList: [],
    inventoryData: {},
    validate: false,
    countCheckedElements: 0,
    showSaveSuccess: false,
    showConfirmDeleteModal: false,
    blockIsPerishable: false,
    handleChangeIsOutput: (): void => {},
    handleChangeIsPerishable: (): void => {},
    handleAddWarehouse: (): void => {},
    handleAddBatch: (): void => {},
    handleChangeField: (): void => {},
    handleChangeWarehouse: (): void => {},
    getWarehousesExcluded: (): IGenericRecord[] => [],
    handleTrash: (): void => {},
    handleShowModalSuccess: (): void => {},
    handleShowConfirmDeleteModal: (): void => {},
    handleSaveWebsiteInventory: (): void => {},
    handleSelectProduct: (): void => {},
    totalsQuantities: {
        totalAvailableForSale: 0,
        availablePerWarehouse: {},
    },
    showModalErrorDelete: false,
    nonRemovableInventory: [],
    toggleModalErrorDelete: (): void => {},
    closeModalErrorDelete: (): void => {},
    includesBatchesToDelete: false,
    showPerishableModal: false,
    togglePerishableModal: (): void => {},
    originalData: {},
    quantityValidate: false,
});


//variable to validate if the inventory is output
export const ADD_OUTPUT = 'Agregar salida';
