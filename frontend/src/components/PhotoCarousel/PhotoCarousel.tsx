import React, { useState } from 'react';
import Slider from 'react-slick';
import './PhotoCarousel.scss';

interface Props {
    images: string[];
}

const PhotoCarousel: React.FC<Props> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images) {
        return <div>Loading...</div>; // Ou tout autre élément de substitution
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20%',
                },
            },
        ],
    };

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    return (
        <div className="photo-carousel">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} onClick={() => handleImageClick(image)}>
                        <div className="image-container">
                            <img
                                src={image}
                                alt={`Carousel slide ${index}`}
                                className="carousel-image"
                            />
                        </div>
                    </div>
                ))}
            </Slider>
            {selectedImage && (
                <div className="modal">
                    <div className="modal-content">
            <span className="close" onClick={() => setSelectedImage(null)}>
              &times;
            </span>
                        <img src={selectedImage} alt="Selected slide" className="selected-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoCarousel;
