import { IGenericRecord } from "@models/GenericRecord";


// Function to get available warehouse quantities
export const availableWarehouseQuantity = (data: IGenericRecord, isPerishable: boolean): IGenericRecord[] => {
       const warehouse:IGenericRecord[] = []
        if(!isPerishable){
            const batch = data?.batches?.[0];
            batch?.warehouses?.forEach?.((item: IGenericRecord):void => {
                warehouse.push( {...item, warehouseName: item?.name, quantity: item?.quantity})
            })
            return warehouse;
        }
        const batch = data?.batches?.flatMap((item:IGenericRecord)=> item?.warehouses)
        batch?.forEach?.((item: IGenericRecord):void => {
            warehouse.push( {...item, warehouseName: item?.name, quantity: item?.quantity})
        })
       return warehouse;
}

//string to validate add inventory mode
export const ADD_INVENTORY = "Agregar entrada"
