import React, { useContext, useEffect, useState } from 'react';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { ChangeEvent } from '@components/radiobutton';
import { SimpleButton } from '@components/button';
import { IGenericRecord } from '@models/GenericRecord';
import { Modal } from '@components/modal';
import { Form } from '@components/form';
import { ColorPicker } from '@components/color-picker';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { EditInput, TextFields } from '../components';
import { AddArticle } from './AddArticle';
import { ARTICLE_TO_EDIT, NUMBER_OF_ARTICLES } from '.';
import './BlogEditor.scss';

export const BlogEditor: React.FC = () => {
    const { selectedElement, handleSettingChange, handleStyleChange } = useContext(ElementsContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { styleKey } = useContext(ScreensContext);

    const backgroundColor = selectedElement?.[styleKey]?.action?.backgroundColor;

    useEffect(() => {
        if (!selectedElement?.setting?.numberOfArticles) {
            const articles = selectedElement?.setting?.numberOfArticles ?? [];
            handleSettingChange({
                name: NUMBER_OF_ARTICLES,
                value: [
                    ...articles,
                    {
                        date: new Date().toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                        }),
                    },
                ],
            });
        }
    }, []);

    const changeButtonValue = (e: ChangeEvent): void => {
        handleSettingChange({ name: 'formButtonText', value: e.target.value });
    };

    const addArticle = (): void => {
        const articles = selectedElement?.setting?.numberOfArticles ?? [];
        handleSettingChange({
            name: NUMBER_OF_ARTICLES,
            value: [
                ...articles,
                {
                    date: new Date().toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    }),
                },
            ],
        });
    };

    const closeModal = (): void => {
        setOpenModal(false);
    };

    const getArticleToModifier = (index: number): void => {
        setOpenModal(true);
        handleSettingChange({
            name: ARTICLE_TO_EDIT,
            value: index,
        });
    };

    const deleteArticle = (indexToDelete: number): void => {
        handleSettingChange({
            name: NUMBER_OF_ARTICLES,
            value: selectedElement?.setting?.numberOfArticles?.filter(
                (_: IGenericRecord, index: number) => index !== indexToDelete
            ),
        });
    };

    return (
        <div className="blog-editor">
            <h3 className="text-sm text-blue font-allerbold">Artículos</h3>
            {selectedElement?.setting?.numberOfArticles?.map((_: IGenericRecord, index: number) => (
                <Form key={`editInput${index}`}>
                    <EditInput
                        value={selectedElement?.setting?.formButtonText}
                        handleChange={changeButtonValue}
                        placeholder={`Articulo ${index + 1}`}
                        wrapperClassName="mt-2"
                        iconName="editBlue"
                        iconTrash
                        handleClickIconTrash={(): void => {
                            deleteArticle(index);
                        }}
                        handleClickIcon={(): void => {
                            getArticleToModifier(index);
                        }}
                    />
                </Form>
            ))}
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-composite-element-blog`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                modalClassName="editor"
                open={openModal}
                handleClose={closeModal}
            >
                <AddArticle toggleModal={closeModal} />
            </Modal>
            <SimpleButton
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-article`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.BTN,
                })}
                onClick={addArticle}
                className="underline cursor-pointer w-27 text-tiny text-green mb-4.5"
            >
                + Agregar articulo
            </SimpleButton>
            <TextFields wrapperClassName="mb-4.5" item="articles" labelText="Nombre del artículo" />
            <TextFields item="author" labelText="Síntesis y autor de artículos" />
            <p className="text-sm text-blue mt-4.5 mb-1 font-allerbold font-bold">Botón de acción</p>
            <TextFields item="action" wrapperClassName="mt-2" />
            <p className="font-bold text-tiny text-blue font-allerbold mt-4.5">Fondo botón</p>
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-article-background-btn`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ item: 'action', name: 'backgroundColor', value })}
                value={backgroundColor}
            />
        </div>
    );
};
