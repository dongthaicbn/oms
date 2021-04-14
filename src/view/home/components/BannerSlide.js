import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Home.scss';

const BannerSlide = props => {
  const { banners } = props;
  const settings = {
    className: '',
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    customPaging: idx => <div className="dot-custom" />
  };
  console.log('banners', banners);
  return (
    <>
      <Slider {...settings}>
        {banners.map((el, i) => (
          <div key={i}>
            <img
              src={el.url}
              alt=""
              style={{
                maxHeight: 420,
                maxWidth: 1024,
                margin: '0 auto',
                width: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        ))}
      </Slider>
    </>
  );
};

export default BannerSlide;
