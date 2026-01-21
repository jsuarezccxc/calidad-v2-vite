import React from 'react';
import { Popper } from '@components/popper';
import { Divider } from '@mui/material';
import { IPageTitlePopperProps, dividerStyle } from '.';

export const PageTitlePopper: React.FC<IPageTitlePopperProps> = ({
    anchorEl,
    handlePageTitle,
    handleDeletePage,
    closePopper,
    handleDuplicatePage,
}) => {
    return (
        <Popper
            wrapperClassName="page-title-popper bg-white text-center z-50 w-35.25 h-25 rounded-lg border border-gray"
            anchorEl={anchorEl}
            placement="right-end"
        >
            <>
                <button onClick={handlePageTitle} className="text-sm cursor-pointer text-blue">
                    Editar nombre
                </button>
                <Divider sx={dividerStyle} />
                <button
                    className="text-sm text-blue"
                    onClick={(): void => {
                        handleDeletePage();
                        closePopper();
                    }}
                >
                    Eliminar
                </button>
                <Divider sx={dividerStyle} />
                <button
                    onClick={(): void => {
                        handleDuplicatePage();
                        closePopper();
                    }}
                    className="text-sm text-blue"
                >
                    Duplicar
                </button>
            </>
        </Popper>
    );
};
