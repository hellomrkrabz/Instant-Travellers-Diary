import { React } from 'react';
import { useSwiper } from 'swiper/react';

function SlideNextButton() {
  const swiper = useSwiper();
  
  console.log(swiper);

  return (
    <button onClick={() => swiper.slideNext()}>Slide to the next slide</button>
  );
}

export default SlideNextButton;