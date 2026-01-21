import React from 'react';
import SunEditor from 'suneditor-react';
import { ModalCustom } from '@components/modal-custom';
import { ImageInput, TextArea, TextInput } from '@components/input';
import { Button } from '@components/button';
import { IModalBlogProps, MODAL_BUTTONS } from '.';
import './ModalBlog.scss';

export const ModalBlog: React.FC<IModalBlogProps> = ({ show = false, showModal = (): void => {} }) => {
    return (
        <ModalCustom show={show} showModal={showModal} classesModal="container-modal" classesWrapper="modal--full">
            <div className="pr-2 overflow-y-auto add-article-fields bg-green-scrollbar">
                <h3 className="mb-2 text-lg text-gray-dark font-allerbold">Agregar artículo</h3>
                <p className=" text-gray-dark mb-4.5">
                    Agregue el nombre, autor, síntesis y contenido del artículo. Además agregue la imagen que acompañará este
                    artículo, se recomienda que la imagen sea horizontal, si agrega una imagen vertical se adaptará al tamaño de
                    acuerdo a la plantilla.
                </p>
                <TextInput labelText="Nombre artículo:" classesWrapper="mb-4.5" />
                <TextInput labelText="Síntesis del artículo:" classesWrapper="mb-4.5" />
                <TextInput labelText="Autor del artículo:" classesWrapper="mb-4.5" />
                <ImageInput labelText="Imagen para el artículo:" classesWrapper="image-editor" />
                <label className="text-xs text-blue font-allerbold pl-1.5 inline-block">Contenido:</label>
                <div className="article-editor">
                    <SunEditor name="content" setDefaultStyle="font-size: 1rem" />
                </div>
                <TextArea labelText="Referencia bibliográfica:" classesWrapper="mb-4.5" />
            </div>
            <div className="flex justify-end gap-5 mt-6 xs:pr-2 lg:pr-3 xs:justify-center">
                {MODAL_BUTTONS.map(button => (
                    <Button key={button} text={button} onClick={(): void => showModal()} />
                ))}
            </div>
        </ModalCustom>
    );
};
