import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import image1 from '../../Images/cara1.png';
import image2 from '../../Images/cara2.png';
import homeVideo from '../../../public/home video.mp4';
import gran1 from '../../Images/gran1.jpg'
import gran2 from '../../Images/gran2.jpg'
import gran3 from '../../Images/gran3.jpg'
import gran4 from '../../Images/gran4.jpeg'
import gran5 from '../../Images/gran5.jpg'
import gran6 from '../../Images/gran6.jpg'


const ImageCarousel = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      {/* <div className="h-[34rem] opacity-90">
        <video
          className="h-full w-full object-cover"
          src={homeVideo}
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div> */}

      <div className="h-[34rem] ">
        <img
          src={gran1}
          className="h-full w-full object-cover"
          alt="Slide 1"
        />
      </div>
      <div className="h-[34rem] ">
        <img
          src={gran2}
          className="h-full w-full object-cover"
          alt="Slide 2"
        />
      </div>
      <div className="h-[34rem] ">
        <img
          src={gran3}
          className="h-full w-full object-cover"
          alt="Slide 3"
        />
      </div>
      <div className="h-[34rem] ">
        <img
          src={gran4}
          className="h-full w-full object-cover"
          alt="Slide 4"
        />
      </div>
      <div className="h-[34rem] ">
        <img
          src={gran5}
          className="h-full w-full object-cover"
          alt="Slide 5"
        />
      </div>
      <div className="h-[34rem] ">
        <img
          src={gran6}
          className="h-full w-full object-cover"
          alt="Slide 6"
        />
      </div>
 

    </Carousel>
  );
};

export default ImageCarousel;
