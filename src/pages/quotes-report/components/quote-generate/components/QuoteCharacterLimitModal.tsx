import React from 'react';
import { SharedModal } from '@components/modal';
import { TitleButtons } from '@constants/Buttons';
import { ModalType } from '@constants/Modal';
import { IQuoteWarningModalsProps } from '..';

export const QuoteCharacterLimitModal: React.FC<IQuoteWarningModalsProps> = ({ show, onClose, onAccept }) => {
    return (
        <SharedModal
            open={show}
            type={ModalType.Information}
            handleClosed={onClose}
            finalAction={onAccept}
            text={{
                title: '¡Ha superado el número de caracteres definido por la DIAN!',
                description: 'El valor total del documento ha superado el número de caracteres definido por la DIAN, verifique la información agregada.'
            }}
            finishButtonText={TitleButtons.ACCEPT}
        />
    );
};

