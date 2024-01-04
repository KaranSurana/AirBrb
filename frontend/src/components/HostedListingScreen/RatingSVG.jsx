import React from 'react';
import { StarContainer, Star } from '../../styles/Ratings';

// Rating Component Here
const RatingSVG = ({ reviewPoints }) => {
  const wholeStar = Math.floor(reviewPoints);
  const percentage = (reviewPoints % 1) * 100;
  // Render stars according to the calculated percentage: full/partial/no star.
  return (
    <StarContainer>
      { Array.from({ length: 5 }, (_, ith) => (
        <Star key={ith} active={ith < wholeStar || (ith === wholeStar && percentage > 0)}>
          {ith + 1 <= wholeStar
            ? '\u2605'
            : ith === wholeStar && percentage > 0
              ? '\u00bd'
              : '\u2606'
          }
        </Star>
      ))}
    </StarContainer>
  );
};

export default RatingSVG;
