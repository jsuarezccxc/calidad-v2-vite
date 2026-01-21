/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Task } from '@pages/gantt/components/GanttTypes';
import { RootState } from '@redux/rootReducer';
import { urls } from '@api/urls';
import { apiDeleteBinnacle, apiGetBinnacle, apiPostBinnacle, apiPutBinnacle } from '@api/binnacle';
import { IGenericRecord } from '@models/GenericRecord';
import { getUserData } from '@utils/User';
import { ActionKeys, GanttActions, ISetTasks } from './types';
import { FetchRequest } from '@models/Request';

export const setTasks = (tasks: Task[]): ISetTasks => ({
    type: ActionKeys.SET_TASKS,
    payload: tasks,
});

export const getTasks = (): ThunkAction<Promise<void>, RootState, null, GanttActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, GanttActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const getTaskByCompanyIdUrl = urls.gantt.getTasks(company_id);
            const request = new FetchRequest(getTaskByCompanyIdUrl);
            const { data }: any = await apiGetBinnacle(request);
            if (data) dispatch(setTasks(data));
        } catch (error) {
            dispatch(setTasks([]));
        }
    };
};

export const postTask = (task: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, GanttActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, GanttActions>): Promise<boolean> => {
        const ganttsPostUrl = urls.gantt.postTask;
        const request = new FetchRequest(ganttsPostUrl, task);
        const { data }: any = await apiPostBinnacle(request);
        if (data) await dispatch(getTasks());
        return !!data;
    };
};

export const deleteTask = (taskId: string): ThunkAction<Promise<void>, RootState, null, GanttActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, GanttActions>): Promise<void> => {
        const ganttsDeleteByTaskIdUrl = urls.gantt.deleteTask(taskId);
        const request = new FetchRequest(ganttsDeleteByTaskIdUrl);
        const { data }: any = await apiDeleteBinnacle(request);
        if (data) await dispatch(getTasks());
    };
};

export const updateTasks = (tasks: IGenericRecord[]): ThunkAction<Promise<boolean>, RootState, null, GanttActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, GanttActions>): Promise<boolean> => {
        const ganttsPostUrl = urls.gantt.postTask;
        const request = new FetchRequest(ganttsPostUrl, tasks);
        const { data }: any = await apiPutBinnacle(request);
        if (data) await dispatch(getTasks());
        return !!data;
    };
};
