import React, { useEffect, useState } from "react";
import cn from 'classnames';
import { ArticleList } from "../../components/ArticleList";
import './HomePage.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchArticles, resetPage, setPage, setQuery } from "../../store/articlesSlice";
import { useAppDispatch } from "../../store/hooks";
import { useSearchParams } from "react-router-dom";

export const HomePage = () => {
  const [input, setInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const { query, page, status } = useSelector((state: RootState) => state.articles);

  const queryParam = searchParams.get('query') || query;

  useEffect(() => {
    dispatch(fetchArticles({ query: queryParam, page }));
  }, [])

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('query', query);

    setSearchParams(newSearchParams);
  }, [query, page])

  useEffect(() => {
    if (query !== queryParam && queryParam.length >= 3) {
      setInput(queryParam);
      dispatch(setQuery(queryParam));
      dispatch(resetPage());
      dispatch(fetchArticles({ query: queryParam, page: 1 }));
    }
  }, [queryParam])

  const search = (reset = false) => {
    if (reset) {
      if (input.length >= 3 && input !== query) {
        dispatch(fetchArticles({ query: input, page: 1 }));
        dispatch(setQuery(input));
        dispatch(resetPage());
      }
    } else {
      dispatch(setPage(page + 1));
      dispatch(fetchArticles({ query, page: page + 1 }));
    }
  };

  const handleEnterKeyClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      search(true);
    }
  };

  return (
    <div className="page">
      <form className="page__form">
        <input
          type="text"
          className="page__input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleEnterKeyClick}
        />

        <button
          type="button"
          className={cn('page__button page__button--search', {
            'page__button--disabled': status === 'loading',
          })}
          onClick={() => search(true)}
          disabled={status === 'loading'}

        >
          Search
        </button>
      </form>

      <ArticleList />

      <button
        type="button"
        className={cn('page__button page__button--more', {
          'page__button--disabled': status === 'loading',
        })}
        onClick={() => search()}
        disabled={status === 'loading'}
      >
        More
      </button>
    </div>
  );
};
