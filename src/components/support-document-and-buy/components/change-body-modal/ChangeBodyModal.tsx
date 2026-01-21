import React from 'react';
import { SUPPORT_DOCUMENT } from '@information-texts/SupportDocumentAndBuy';
import { TYPE_MODAL } from '..';
import { Button } from '@components/button';
import { Icon } from '@components/icon';

export const changeBodyModal = (typeModal: TYPE_MODAL, closeModal: () => void): React.ReactElement => {
    switch (typeModal) {
        case TYPE_MODAL.INFO_PAGE_SUPPORT:
            return (
                <>
                    <div className="xs-h-auto modal--response">
                        <div className="section-title">
                            <Icon name="infoBlue" />
                            <h3 className="modal-title">{SUPPORT_DOCUMENT.MODAL_TITLE}</h3>
                        </div>
                        {SUPPORT_DOCUMENT.MODAL}
                        <div className="justify-center hidden w-full mt-7 xs:flex">
                            <Button text="Atrás" onClick={(): void => closeModal()} />
                        </div>
                    </div>
                </>
            );
        case TYPE_MODAL.TABLE:
            return (
                <>
                    <div className="xs-h-auto modal--response">
                        <div className="section-title">
                            <Icon name="infoBlue" />
                            <h3 className="modal-title">{SUPPORT_DOCUMENT.TABLE_TITLE}</h3>
                        </div>
                        {SUPPORT_DOCUMENT.TABLE}
                        <div className="justify-center hidden w-full mt-7 xs:flex">
                            <Button text="Atrás" onClick={(): void => closeModal()} />
                        </div>
                    </div>
                </>
            );
        case TYPE_MODAL.NEW_SUPPLIER:
            return (
                <>
                    <div className="xs-h-auto xs-w-m-modal modal--response">
                        <div className="mb-2 section-title">
                            <h3 className="modal-supplier">{SUPPORT_DOCUMENT.MODAL_TITLE_FORM}</h3>
                        </div>
                        {SUPPORT_DOCUMENT.MODAL_FORM_TEXT}
                    </div>
                </>
            );
        default:
            return <>Nothing</>;
    }
};
