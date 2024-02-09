import React, { useEffect, useState } from "react";
import { ArticleItem } from "../ArticleItem";
import './ArticleList.scss';
import { useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import { Article } from "../../types/Article";

export const ArticleList = () => {
  const location = useLocation();
  const areMyArticlesShown = location.pathname.includes('/my-articles');

  const [localArticles, setLocalArticles] = useState<Article[]>([]);

  const { articles } = useAppSelector(state => state.articles);

  useEffect(() => {
    if (areMyArticlesShown) {
      setLocalArticles(JSON.parse(localStorage.getItem('articles') || '[]'));
    }
  }, [])

  useEffect(() => {
    if (areMyArticlesShown) {
      setLocalArticles(JSON.parse(localStorage.getItem('articles') || '[]'));
    }
  }, [...JSON.parse(localStorage.getItem('articles') || '[]')])

  return (
    <div className="articles">
      {
        areMyArticlesShown
          ? localArticles.map((article: Article) => <ArticleItem article={article} key={article.publishedAt} />)
          : articles.map((article: Article) => <ArticleItem article={article} key={article.publishedAt} />)
      }
    </div>
  );
};
