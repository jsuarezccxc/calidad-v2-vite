import React from 'react';
import { useSelector } from 'react-redux';
import { ILoaderProps } from './';
import { RootState } from '@redux/rootReducer';
import { ModalCustom } from '@components/modal-custom';
import LoadingIcon from '@assets/images/loading.svg';

import './Loader.scss';

const Loader: React.FC<ILoaderProps> = props => {
    const { classes } = props;
    const loaderState = useSelector((state: RootState) => state.loader);

    return (
        <ModalCustom
            show={loaderState.loader}
            showModal={(): void => {}}
            closeIcon={false}
            classesWrapper="min-w-loader animate-loader-modal"
            classesModal="min-w-loader justify-center"
            isLoader
        >
            <div id="loader" className={`${classes} flex justify-center items-center`}>
                <img src={LoadingIcon} alt="Icono de carga" />
            </div>
        </ModalCustom>
    );
};

export default Loader;
