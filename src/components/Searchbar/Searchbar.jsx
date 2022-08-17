import React from 'react';
import { DebounceInput } from 'react-debounce-input';

import css from './Searchbar.module.css';
import PropTypes from 'prop-types';

export const Searchbar = ({ onSearch }) => {
  return (
    <header className={css.Searchbar}>
      <div className={css.SearchForm}>
        <DebounceInput
          minLength={1}
          debounceTimeout={500}
          className={css.SearchFormInput}
          autoFocus
          placeholder="Search images and photos"
          onChange={e => {
            console.log(e.target.value);
            return onSearch(e.target.value.toLowerCase());
          }}
        />
      </div>
    </header>
  );
};

Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
