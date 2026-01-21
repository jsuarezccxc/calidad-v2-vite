import React from 'react';
import { useDispatch } from 'react-redux';
import { INFORMATION } from '@information-texts/GeneralDashboard';
import { setModalRedirectPlans } from '@redux/menu/actions';
import { ISetModalRedirectPlans } from '@redux/menu/types';

export const CardDisabled: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <div className="card-disabled" onClick={(): ISetModalRedirectPlans => dispatch(setModalRedirectPlans())}>
            {INFORMATION.DISABLED_TEXT}
        </div>
    );
};
