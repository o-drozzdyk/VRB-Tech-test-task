import React, { useEffect, useState } from "react";
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
  const { query, page } = useSelector((state: RootState) => state.articles);

  const queryParam = searchParams.get('query') || query;
  const pageParam = +(searchParams.get('page') || page);

  useEffect(() => {
    dispatch(fetchArticles({ query: queryParam, page: pageParam }));
  }, [])

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('query', query);
    newSearchParams.set('page', page.toString());

    setSearchParams(newSearchParams);
  }, [query, page])

  useEffect(() => {
    if (query !== queryParam && queryParam.length >= 3) {
      setInput(queryParam);
      dispatch(setQuery(queryParam));
      dispatch(resetPage());
      dispatch(fetchArticles({ query: queryParam, page: 1 }));
    } 
    
    if (+pageParam && page !== +pageParam) {
      dispatch(setPage(+pageParam));
      dispatch(fetchArticles({ query, page: +pageParam }));
      dispatch(setPage(+pageParam));
    }


  }, [queryParam, pageParam])

  const search = (reset = false) => {
    if (reset && input.length >= 3) {
      dispatch(fetchArticles({ query: input, page: 1 }));
      dispatch(setQuery(input));
      dispatch(resetPage());
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
          className="page__button page__button--search"
          onClick={() => search(true)}
        >
          Search
        </button>
      </form>

      <ArticleList />

      <button
        type="button"
        className="page__button page__button--more"
        onClick={() => search()}
      >
        More
      </button>
    </div>
  );
};
