import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { InformationNextModal } from './index';
import { IContentTableProduct } from '.';

const NextModalCustom: React.FC<IContentTableProduct> = ({ saveChanges, setShowModal, showModal }) => {
    const history = useHistory();
    return (
        <div className="px-0 xs:px-20">
            <div className="flex mb-2">
                <Icon name="infoBlue" />
                <h1 className="text-xl text-blue font-allerbold ml-2.5">{InformationNextModal.title}</h1>
            </div>
            <p className="text-base font-normal leading-base text-gray-dark">
                {InformationNextModal.description_header}
                <br />
                <br />
                {InformationNextModal.description_body}
            </p>
            <div className="flex flex-row justify-center space-x-4 mt-7">
                <Button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-product-shipping-cost-next`,
                        action: ActionElementType.SAVE,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.SAVE}
                    onClick={(): void => {
                        saveChanges();
                        setShowModal(!showModal);
                    }}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-product-shipping-cost-next`,
                        action: ActionElementType.NEXT,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.NEXT}
                    onClick={(): void => history.push(getRoute(Routes.INFORMATION_PROVISION_OF_SERVICES))}
                />
            </div>
        </div>
    );
};

export default NextModalCustom;
