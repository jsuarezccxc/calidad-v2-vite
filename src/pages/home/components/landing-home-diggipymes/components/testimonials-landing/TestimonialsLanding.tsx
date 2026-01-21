import React from 'react';
import ReactPlayer from 'react-player';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';

import { IMAGES_REVIEWS } from '.';
import './TestimonialsLanding.scss';

export const TestimonialsLanding: React.FC = () => {
    return (
        <section className="testimonials">
            <h2
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'testimonials-section-title',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="text-center"
            >
                Testimonios de nuestros clientes
            </h2>
            <div className="testimonials--video-slider-container">
                <div>
                    <ReactPlayer url="https://www.youtube.com/watch?v=vfAFjxV0Gig" width="auto" />
                </div>
                <div className="review-slider">
                    {IMAGES_REVIEWS.map(image => (
                        <div className="xs:w-full" key={image}>
                            <img src={image} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
