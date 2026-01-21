import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ALL_NOTIFICATIONS_REDIRECTION, MODULE_PAYMENT_PLANS, PENDING_NOTIFICATION, SECOND_PENDING_NOTIFICATION } from '@constants/Notifications';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute } from '@utils/Paths';

/**
 * This interface describes the properties that the useUnreadNotifications return
 *
 * @typeParam unreadNotifications: IGenericRecord[] - Variable with unread notifications
 */
interface IUseUnreadNotifications {
    unreadNotifications: IGenericRecord[];
}

/**
 * Custom hook that allows filter all notifications by pending status
 *
 * @returns IUseUnreadNotifications
 */
const useUnreadNotifications = (): IUseUnreadNotifications => {
    const { allNotifications = [], numberNotifications } = useSelector(({ notifications }: RootState) => notifications);

    const [unreadNotifications, setUnreadNotifications] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        if (lengthGreaterThanZero(allNotifications)) {
            const unreadNotifications = allNotifications
                .map((notification: IGenericRecord) => {
                    const notificationRedirect = ALL_NOTIFICATIONS_REDIRECTION.find(
                        (redirection: IGenericRecord) => redirection?.id === notification.type_notification.id
                    );

                    return {
                        ...notification,
                        redirect: notificationRedirect?.redirect || getRoute(Routes.HOME),
                    };
                })
                .filter(
                    (notification: IGenericRecord) =>
                        notification.state_notification.id === PENDING_NOTIFICATION ||
                        notification.state_notification.id === SECOND_PENDING_NOTIFICATION ||
                        notification.type_notification.id === MODULE_PAYMENT_PLANS
                );

            setUnreadNotifications(unreadNotifications);
        }
    }, [allNotifications, numberNotifications]);

    return { unreadNotifications };
};

export default useUnreadNotifications;
