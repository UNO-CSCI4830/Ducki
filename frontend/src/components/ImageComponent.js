import React from 'react';

// Accept 'src' and 'alt' as props
const ImageComponent = ({ src, alt }) => {
  return (
    <div>
      <img src={src} alt={alt} />
    </div>
  );
};

export default ImageComponent;
