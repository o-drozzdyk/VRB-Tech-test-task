import React from "react";
import { Article } from "../../types/Article";
import './ArticleItem.scss';
import cn from 'classnames';
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteArticle, pinArticle, unpinArticle } from "../../store/articlesSlice";

type Props = {
  article: Article;
}

export const ArticleItem: React.FC<Props> = ({ article }) => {
  const {
    urlToImage,
    author,
    description,
    title,
    publishedAt,
  } = article;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { pinnedArticle } = useAppSelector(state => state.articles);

  const isArticlePinned = publishedAt === pinnedArticle?.publishedAt;

  const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
  const isCreatedByUser = savedArticles.find((item: Article) => item.publishedAt === publishedAt);

  const handlePinClick = () => {
    if (isArticlePinned) {
      dispatch(unpinArticle());
    } else {
      dispatch(pinArticle(article));
    }
  };

  return (
    <article className={cn('article', {
      'article--pinned': isArticlePinned,
    })}>
      <div className="article__row">
        <p className="article__title">{title}</p>

        <img
          src="img/pin.svg"
          alt="Pin article"
          className={cn('article__icon', {
            'article__icon--pinned': isArticlePinned,
          })}
          onClick={handlePinClick}
        />
      </div>

      <img
        src={urlToImage}
        alt="Article image"
        className="article__image"
      />

      {description.length > 0 && <p className="article__description">{description}</p>}
      <div className="article__row">
        <Link to={author} className="article__author">Author</Link>

        {isCreatedByUser && (<div className="article__icons">
          <img
            src="img/edit.svg"
            alt="Edit article"
            className="article__icon"
            onClick={() => navigate('/edit', { state: { article } })}
          />

          <img
            src="img/delete.svg"
            alt="Delete article"
            className="article__icon article__icon--delete"
            onClick={() => dispatch(deleteArticle(article))}
          />
        </div>
        )}
      </div>
    </article>
  );
};
