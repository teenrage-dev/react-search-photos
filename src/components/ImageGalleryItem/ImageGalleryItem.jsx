import css from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

export const ImageGalleryItem = ({ photo }) => {
  return (
    <>
      {photo?.map(({ id, webformatURL, tags, largeImageURL }) => {
        return (
          <li className={css.ImageGalleryItem} key={id}>
            <img
              src={webformatURL}
              alt={tags}
              className={css.ImageGalleryItemImage}
              data-large-img={largeImageURL}
              loading="lazy"
            />
          </li>
        );
      })}
    </>
  );
};

ImageGalleryItem.propTypes = {
  photo: PropTypes.array,
};
