import React from 'react';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Home.scss';
import { routes } from 'utils/constants/constants';

const BannerSlide = (props) => {
  const { banners } = props;
  const settings = {
    className: '',
    dots: true,
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    customPaging: (idx) => <div className="dot-custom" />,
  };
  const gotoDetail = (id) => {
    props.history.push(routes.NEWS_AND_PROMOTION + `/detail/${id}`);
  };
  return (
    <>
      <Slider {...settings}>
        {banners.map((el, i) => (
          <div key={i}>
            <img
              src={el.url}
              alt=""
              onClick={() => gotoDetail(el.id)}
              style={{
                maxHeight: 420,
                maxWidth: 1024,
                margin: '0 auto',
                width: '100%',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </Slider>
    </>
  );
};

export default withRouter(BannerSlide);
