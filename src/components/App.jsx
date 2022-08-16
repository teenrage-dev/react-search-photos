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

  useEffect(() => {
    if (value === '') {
      return;
    }

    setStatus(Status.PENDING);
    async function getImages() {
      try {
        const data = await fetchImages(value, page);
        console.log(data);
        if (data.hits.length === 0) {
          setError('No results found.');
          setStatus(Status.REJECTED);
          return new Error(`No results found.`);
        }
        setPhoto(prevState => {
          return page === 1 ? [...data.hits] : [...prevState, ...data.hits];
        });
        setStatus(Status.RESOLVED);
      } catch (error) {
        console.log(error);
        setError(error);
        setStatus(Status.REJECTED);
      }
    }
    getImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, page]);

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

  // const renderImagesFromStatus = () => {
  //   switch (status) {
  //     case Status.IDLE:
  //       return (
  //         <div className={css.ImageGalleryWrapper}>
  //           <MovingComponent
  //             type="pulse"
  //             duration="1000ms"
  //             delay="0s"
  //             direction="normal"
  //             timing="ease"
  //             iteration="infinite"
  //             fillMode="none"
  //           >
  //             <h2 className={css.IdleText}> Enter The Text</h2>
  //           </MovingComponent>
  //         </div>
  //       );
  //     case Status.PENDING:
  //       return (
  //         <div className={css.ImageGalleryContainer}>
  //           <InfinitySpin width="200" color="#3f51b5" />
  //         </div>
  //       );
  //     case Status.RESOLVED:
  //       return (
  //         <>
  //           <ul id="ImageGallery" className={css.ImageGallery}>
  //             <ImageGalleryItem photo={photo} />
  //           </ul>
  //           <Button onClick={loadMore} />
  //           {isOpen && <Modal onClose={closeModal} largeImgURL={largeImgURL} />}
  //         </>
  //       );
  //     case Status.REJECTED:
  //       return toast.error(`${error}`);
  //     default:
  //       return null;
  //   }
  // };

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
        {status === Status.RESOLVED && <Button onClick={loadMore} />}
        {isOpen && <Modal onClose={closeModal} largeImgURL={largeImgURL} />}
      </>
      {/* )} */}
    </div>
  );
};
