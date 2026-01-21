import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { Form } from '@components/form';
import { createDraggableElement, getCenterCoordinates } from '@utils/WebsiteNode';
import { ChangeEvent, TextInput } from '@components/input';
import { ElementType } from '@models/WebsiteNode';
import { isValidYoutubeLink } from '@utils/SocialNetworks';
import { ElementsContext } from '../../../../editor/context';

export const VideoField: React.FC = () => {
    const { activePage } = useSelector((state: RootState) => state.websiteNode);
    const { addElement, saveElement, selectedElement } = useContext(ElementsContext);
    const [isValidLink, setIsValidLink] = useState<boolean>(true);
    const [video, setVideo] = useState<string>('');

    useEffect(() => setInitialData(), [selectedElement?.value]);

    const setInitialData = (): void => {
        const video = selectedElement?.value ?? '';
        setVideo(video);
        setIsValidLink(isValidYoutubeLink(video));
    };

    const handleVideoChange = ({ target: { value } }: ChangeEvent): void => {
        setVideo(value);
        const isValid = isValidYoutubeLink(value);
        setIsValidLink(isValid);
        if (isValid) {
            if (selectedElement) return saveElement({ ...selectedElement, value });
            const centerCoordinates = getCenterCoordinates({ height: 178, width: 328 });
            addElement(
                createDraggableElement({
                    style: { zIndex: 2, ...centerCoordinates },
                    type: ElementType.Video,
                    value,
                    activePageId: activePage?.id,
                })
            );
        }
    };

    const isRequired = video && !isValidLink;

    return (
        <Form className="flex justify-center my-2">
            <TextInput
                labelText="Link:"
                classesWrapper="w-57"
                onChange={handleVideoChange}
                placeholder="https://www.ejemplo.com/"
                value={video}
                {...(isRequired && { required: true, requiredText: 'Verifica la URL del vídeo y vuelve a intentarlo.' })}
            />
        </Form>
    );
};
