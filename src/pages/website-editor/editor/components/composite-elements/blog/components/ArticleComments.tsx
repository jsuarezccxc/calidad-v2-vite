import React, { useState } from 'react';
import check from '@assets/images/check-blue-blog.svg';
import { Link, LinkColor } from '@components/button';
import { Icon } from '@components/icon';
import { TextArea } from '@components/input';

export const ArticleComments: React.FC = () => {
    const [replyComment, setReplyComment] = useState(false);
    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h3 className="text-xl text-blue font-allerbold mb-0.5">Nombre cliente</h3>
                <Icon name="trashBlue" className="w-4.5 cursor-pointer" />
            </div>
            <p className="text-tiny text-gray-dark">Fecha de publicación dd/mm/aaaa</p>
            <p className="my-2 text-gray-dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua. Ut enim ad min veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in vuptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            {replyComment ? (
                <div className="flex">
                    <TextArea labelText="Respuesta:" classesWrapper="w-150 mb-2.5" />
                    <img src={check} alt="check" className="w-4.5 h-4.5 cursor-pointer my-auto ml-2.5 mr-2" />
                    <Icon
                        name="closeBlue"
                        className="w-4.5 h-4.5 cursor-pointer my-auto"
                        onClick={(): void => setReplyComment(false)}
                    />
                </div>
            ) : (
                <Link
                    href="#"
                    text="Responder comentario"
                    linkColor={LinkColor.GREEN}
                    classes="text-tiny mb-2.5"
                    onClick={(): void => setReplyComment(true)}
                />
            )}
        </div>
    );
};
