import React from 'react';

const ImagePane = ({ path, data }) => {
  let imagesrc = 'data:image/png;base64,' + data.image;
  return (
    <div className='pane image'>
      <img src={imagesrc} draggable='false' />
    </div>
  );
}

export default ImagePane;
