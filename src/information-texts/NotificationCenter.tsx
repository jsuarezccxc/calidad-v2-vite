import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Routes } from '@constants/Paths';
import { getRouteKey } from '@utils/Translation';
import { IInformationProps } from '@components/information';

export const NOTIFICATION_INFORMATION = (translate: (key: string) => string, translationKey: string): IInformationProps => ({
    title: translate(getRouteKey(Routes.NOTIFICATION_CENTER)),
    description: (
        <>
            {translate(`${translationKey}.main-description`)} {PRODUCT_NAME}
        </>
    ),
});
