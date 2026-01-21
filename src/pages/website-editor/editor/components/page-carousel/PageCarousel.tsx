import React, { useContext, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { createOrUpdateElement, setActivePage } from '@redux/website-node/actions';
import { SimpleButton } from '@components/button';
import { Icon } from '@components/icon';
import { IPageWebsite } from '@models/WebsiteNode';
import { addPageToWebsite } from '@utils/WebsiteNode';
import { lengthEqualToZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ElementsContext } from '../../context';
import { Button } from './Button';
import './PageCarousel.scss';

export const PageCarousel: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedWebsite } = useSelector((state: RootState) => state.websiteNode);
    const { saveChanges, selectElement } = useContext(ElementsContext);
    const sliderRef = useRef<Slider | null>(null);
    const pageNumberRef = useRef<number>();

    useEffect(() => {
        const currentPageCount = selectedWebsite?.pages.length;

        if (pageNumberRef.current && currentPageCount > pageNumberRef.current && sliderRef.current) {
            sliderRef.current.slickGoTo(currentPageCount - 1);
        }
        pageNumberRef.current = currentPageCount;
        if (lengthEqualToZero(selectedWebsite?.pages) && selectedWebsite?.id) createNewPage();
    }, [selectedWebsite]);

    const createNewPage = async (): Promise<void> => {
        selectElement(null);
        saveChanges();
        await dispatch(createOrUpdateElement(addPageToWebsite(selectedWebsite, lengthEqualToZero(selectedWebsite?.pages)), true));
    };

    const handleCurrentPage = async (page: IPageWebsite): Promise<void> => {
        selectElement(null);
        await saveChanges();
        dispatch(setActivePage(page));
    };

    return (
        <div className="page-carousel">
            <div className="page-carousel__items bg-green-scrollbar">
                {selectedWebsite?.pages?.map(page => (
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-page-carousel-${page.id}`,
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        page={page}
                        key={page.id}
                        onClick={handleCurrentPage}
                    />
                ))}
            </div>
            <SimpleButton
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-page-carousel-new-page`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.BTN,
                })}
                onClick={createNewPage}
                className="w-35.25 h-8.6 flex items-center page-carousel__button-plus"
            >
                <Icon name="addGreen" className="mr-1 icon--add" />
                <span className="text-xs underline text-green">Agregar página</span>
            </SimpleButton>
        </div>
    );
};
