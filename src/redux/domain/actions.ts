/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiDomain } from '@api/domain';
import { urls } from '@api/urls';
import { FetchRequest } from '@models/Request';
import { CommonProperty } from '@models/WebsiteNode';
import { RootState } from '@redux/rootReducer';
import { deleteCommonProperty, getCommonProperties, upsertCommonProperty } from '@redux/website-node/actions';
import { ActionKeys, DomainActions, ISetError, ISetStepsCompletes, ISetTypeDomain } from './types';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import { IGenericRecord } from '@models/GenericRecord';
import { HOSTED_ZONE_PROPERTIES, SubStepSelection } from '@constants/Domain';

export const setStepsCompleted = (stepsCompleted: SubStepSelection[]): ISetStepsCompletes => ({
    type: ActionKeys.SET_STEPS_COMPLETED,
    payload: stepsCompleted,
});

export const setTypeDomain = (typeDomain: string): ISetTypeDomain => ({
    type: ActionKeys.SET_TYPE_DOMAIN,
    payload: typeDomain,
});

export const setError = (error: IGenericRecord): ISetError => ({
    type: ActionKeys.SET_ERROR,
    payload: error,
});

export const createHostedZone = (domain: string): ThunkAction<Promise<boolean>, RootState, null, DomainActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, DomainActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.domain.createHostedZone, {
                domain_name: domain,
            });
            const { data: dns }: any = await apiDomain(request);
            if (dns === 'El dominio no pudo ser creado' || dns === 'El dominio ya existe') return false;
            if (dns) return !!(await dispatch(upsertCommonProperty(CommonProperty.HostedZone, dns)));
            return false;
        } catch (error) {
            return false;
        }
    };
};

export const deleteSubdomain = (domain: string): ThunkAction<Promise<void>, RootState, null, DomainActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, DomainActions>): Promise<void> => {
        const request = new FetchRequest(urls.domain.delete, {
            domain_name: domain,
        });
        const { statusCode }: any = await apiDomain(request);
        if (isCorrectResponse(statusCode)) {
            await dispatch(deleteCommonProperty(CommonProperty.Domain));
        }
    };
};

export const deleteHostedZone = (data: {
    domain_name: string;
    hosted_zone_id: string;
}): ThunkAction<Promise<void>, RootState, null, DomainActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, DomainActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.domain.deleteHostedZone, data);
            const { statusCode }: any = await apiDomain(request);
            if (isCorrectResponse(statusCode)) {
                await Promise.all(HOSTED_ZONE_PROPERTIES.map(property => dispatch(deleteCommonProperty(property))));
                await getCommonProperties(HOSTED_ZONE_PROPERTIES);
            }
        } catch (error) {
            dispatch(setError({ error }));
        }
    };
};

export const saveDomainInAWS = (domain: string): ThunkAction<Promise<boolean>, RootState, null, DomainActions> => {
    return async (): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.domain.nginx, {
                company_id,
                domain,
            });
             const { status_code, status }: any = await apiDomain(request);
            return isCorrectResponse(status_code || status);
        } catch (error) {
            return false;
        }
    };
};
