/*
* Bootstrap Image Carousel for Individual Listing Detail page
*
*/
import React from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';

const OverallDiv = styled(Carousel)`
  border-radius: 18px;
  width: 50%;
  height: 370px;
  overflow: hidden;
  @media screen and (max-width: 850px) {
    width: 100%;
  }
`;

const Img = styled.img`
  max-width: 100%;
  height: 370px;
  margin-top: 8px;
`;

export const ImageGallery = ({ images }) => {
  return (
    /* Bootstrap Carousel */
    <OverallDiv>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <Img className="d-block w-100" src={image.src} alt={image.alt} />
        </Carousel.Item>
      ))}
    </OverallDiv>
  );
}

export default ImageGallery;
