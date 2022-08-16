import React, { useState, useEffect } from 'react';
import css from './App.module.css';

import { fetchImages } from '../fetchImages';
import { Searchbar } from './Searchbar/Searchbar';
import { Modal } from './Modal/Modal';
import { InfinitySpin } from 'react-loader-spinner';
import { Button } from './Button/Button';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';

import MovingComponent from 'react-moving-text';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Status = {
  IDLE: 'Idle',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

export const App = () => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [largeImgURL, setLargeImgURL] = useState('');

  useEffect(() => {
    window.addEventListener('click', handleClickList);
    return () => {
      window.removeEventListener('click', handleClickList);
    };
  });
  // useEffect(() => {
  //   if (value === '') {
  //     return;
  //   }
  //   async function getImages() {
  //     try {
  //       const { data } = await fetchImages(value, page);
  //       console.log(data);
  //       setPhoto(data);
  //       setStatus(Status.RESOLVED);
  //     } catch (error) {
  //       setError(error);
  //       setStatus(Status.REJECTED);
  //     }
  //   }
  //   getImages();
  // }, [value, page]);

  useEffect(() => {
    // fetchImages(value, page).then(data => {
    //   console.log(data);
    // });

    if (value === '') {
      return;
    }

    setStatus(Status.PENDING);
    fetch(
      `https://pixabay.com/api/?q=${value}&page=${page}&key=28032528-2733f4db32465b2bae0fa9703&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(
          new Error(
            `The query with the name ${value} does not exist. Try another one.`
          )
        );
      })
      .then(data => {
        if (data.hits.length === 0) {
          return Promise.reject(new Error(`No results found.`));
        }
        setPhoto(prevState => {
          return page === 1 ? [...data.hits] : [...prevState, ...data.hits];
        });
        setStatus(Status.RESOLVED);
      })
      .catch(err => {
        setError(err);
        setStatus(Status.REJECTED);
      });
  }, [page, value]);

  // Funtion to Submit the form
  const handleSubmitForm = value => {
    setValue(value);
    setPage(1);
  };

  // Function to handle the click on the list of images
  const handleClickList = e => {
    if (e.target.tagName === 'IMG') {
      openModal(e.target.dataset.largeImg);
    }
  };

  // Load more images
  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  // Function to open the modal
  const openModal = largeImgURL => {
    setLargeImgURL(largeImgURL);
    setIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
    setLargeImgURL('');
  };

  // RENDER

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSubmitForm} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {status === Status.IDLE && (
        <div className={css.ImageGalleryWrapper}>
          <MovingComponent
            type="pulse"
            duration="1000ms"
            delay="0s"
            direction="normal"
            timing="ease"
            iteration="infinite"
            fillMode="none"
          >
            <h2 className={css.IdleText}> Enter The Text</h2>
          </MovingComponent>
        </div>
      )}
      {status === Status.PENDING && (
        <div className={css.ImageGalleryContainer}>
          <InfinitySpin width="200" color="#3f51b5" />
        </div>
      )}
      {status === Status.REJECTED && toast.error(`${error}`)}

      {/* {status === Status.RESOLVED && ( */}
      <>
        <ul id="ImageGallery" className={css.ImageGallery}>
          <ImageGalleryItem photo={photo} />
        </ul>
        <Button onClick={loadMore} />
        {isOpen && <Modal onClose={closeModal} largeImgURL={largeImgURL} />}
      </>
      {/* )} */}
    </div>
  );
};
