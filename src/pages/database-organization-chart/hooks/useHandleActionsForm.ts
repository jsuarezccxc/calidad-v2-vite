import { v4 as uuid } from 'uuid';
import { cloneDeep } from "@utils/Clone";
import { IDeleteData } from '@models/DataEmployees';
import { IAreaData } from '../models/DatabaseOrganizationChart';

export const useHandleActionsForm = (): {
    handleAddData: (data: IAreaData[], areaId?: string) => IAreaData[],
    handleEditData: (data: IAreaData[], value: string, areaId: string, positionId?: string) => IAreaData[],
    handleDeleteData: (dataToDelete: IDeleteData, dataTable: IAreaData[]) => IAreaData[],
    getDataFilled: (dataTable: IAreaData[]) => IAreaData[]
} => {
    const handleAddData = (data: IAreaData[], areaId?: string): IAreaData[] => {
        const newData = cloneDeep(data);

        if (!areaId) {
            newData.push({
                id: null,
                temporal_id: uuid(),
                name: '',
                positions: [],
            });
        }
        if (areaId) {
            newData.forEach(area => {
                if (area.id === areaId || area.temporal_id === areaId) {
                    area.positions.push({
                        id: null,
                        temporal_id: uuid(),
                        name: '',
                        area_id: area.id || area.temporal_id || '',
                    });
                }
            });
        }

        return newData;
    };

    const handleEditData = (data: IAreaData[], value: string, areaId: string, positionId?: string): IAreaData[] => {
        const newAreaList = cloneDeep(data);

        return newAreaList.map(area => {
            let positionList = cloneDeep(area.positions);
            if ((area?.id === areaId || area?.temporal_id === areaId) && !positionId) {
                return {
                    ...area,
                    name: value,
                };
            }
            if ((area?.id === areaId || area?.temporal_id === areaId) && positionId) {
                positionList = positionList.map(position => {
                    if (position.id === positionId || position.temporal_id === positionId) {
                        return {
                            ...position,
                            name: value,
                        };
                    }
                    return position;
                });
                return {
                    ...area,
                    positions: positionList,
                };
            }
            return area;
        });
    };

    const handleDeleteData = (dataToDelete: IDeleteData, dataTable: IAreaData[]): IAreaData[] => {
        const newData = cloneDeep(dataTable);
        const { areas, positions } = dataToDelete;

        return newData
        .filter(({ id, temporal_id }) => !areas.includes(id || temporal_id || ''))
        .map(area => ({
          ...area,
          positions: area.positions.filter(position => !positions.includes(position.id || position.temporal_id || ''))
        }))
    };

    const getDataFilled = (dataTable: IAreaData[]): IAreaData[] => {
        const data = cloneDeep(dataTable);
        const uniqueAreas = new Set();

        return data
            ?.map(area => 
                area.name ? 
                { 
                    ...area, 
                    positions: area?.positions?.filter(position => position.name) 
                } 
                : area
            )
            ?.filter(({ name }) => {
                if (name && !uniqueAreas.has(name)) {
                    uniqueAreas.add(name);
                    return true;
                }
                return false;
            });
    };

    return {
        handleAddData,
        handleEditData,
        handleDeleteData,
        getDataFilled
    }
}
