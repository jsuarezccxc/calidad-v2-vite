import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { USERS_VALUE } from '@constants/Memberships';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMoney } from '@utils/Decimals';

const ModalExtraUser: React.FC<IGenericRecord> = ({
    show = false,
    setShow = (): void => {},
    nextButton = (): void => {},
    membershipSelected,
}) => {
    const userValue = (): string => {
        const maxMembershipIdSelected = Math.max(
            ...membershipSelected.map((membership: IGenericRecord) => membership.membership_type_id)
        );

        if (USERS_VALUE.some((user: IGenericRecord) => user.membership_id === maxMembershipIdSelected)) {
            return formatMoney(
                USERS_VALUE.find((user: IGenericRecord) => user.membership_id === maxMembershipIdSelected)?.value || '',
                0
            );
        }
        return '';
    };

    return (
        <ModalCustom
            show={show}
            showModal={setShow}
            classesWrapper="xs:h-full xs:w-full"
            classesModal="w-120.9 xs:h-full xs:w-full"
        >
            <div className="px-0 xs:flex xs:justify-center xs:h-full xs:flex-col xs:px-20">
                <div className="flex mt-2 mb-2">
                    <Icon name="infoBlue" />
                    <h1 className="text-xl text-blue font-allerbold ml-2.5">Información</h1>
                </div>
                <p className="text-gray-dark">
                    Usted va a adquirir un Usuario adicional a lo incluido en su membresía, por un precio de:
                </p>
                <p className="font-allerbold text-blue my-4.5">
                    Usuario adicional membresía &nbsp;
                    {membershipSelected.find((membership: IGenericRecord) => membership.is_active)?.membership_type_id} &nbsp;
                    {userValue()}
                </p>
                <span className="text-mtiny text-gray-dark">*A continuación será redirigido al método de pago</span>
                <div className="flex flex-row justify-center mt-2 space-x-4">
                    <Button text="Atrás" onClick={setShow} background="white" />
                    <Button text="Siguiente" onClick={nextButton} />
                </div>
            </div>
        </ModalCustom>
    );
};

export default ModalExtraUser;
