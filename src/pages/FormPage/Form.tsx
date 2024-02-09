import React, { useState } from "react";
import './Form.scss';
import { useAppDispatch,  } from "../../store/hooks";
import { createArticle, updateArticle } from "../../store/articlesSlice";
import { useLocation, useNavigate } from "react-router-dom";

export const Form = () => {
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.article.title || '');
  const [description, setDescription] = useState(location.state?.article.description || '');
  const [photoUrl, setPhotoUrl] = useState(location.state?.article.urlToImage || '');
  const [author, setAuthor] = useState(location.state?.article.author || '');

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title && author) {
      if (location.state) {
        dispatch(updateArticle({
          ...location.state?.article,
          title,
          urlToImage: photoUrl,
          description,
          author,
        }));
      } else {
        dispatch(createArticle({
          title,
          urlToImage: photoUrl,
          description,
          author,
        }));
      }

      navigate('/');
    }
  };

  const handleCancelClick = () => {
    navigate('/');
  };

  return (
    <form action="submit" className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label htmlFor="title" className="form__label">Title:</label>

        <input
          type="text"
          id="title"
          name="title"
          value={title}
          className="form__input"
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="form__group">
        <label htmlFor="photoUrl" className="form__label">Photo URL:</label>

        <input
          type="url"
          id="photoUrl"
          name="photoUrl"
          value={photoUrl}
          className="form__input"
          onChange={(event) => setPhotoUrl(event.target.value)}
        />
      </div>

      <div className="form__group">
        <label htmlFor="description" className="form__label">Description:</label>

        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          className="form__input form__input--resize"
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>
      </div>

      <div className="form__group">
        <label htmlFor="originalUrl" className="form__label">URL to Original:</label>

        <input
          type="url"
          id="originalUrl"
          name="originalUrl"
          value={author}
          className="form__input"
          onChange={(event) => setAuthor(event.target.value)}
          required
        />
      </div>

      <div className="form__buttons">
        <button
          type="button"
          className="form__button form__button--cancel"
          onClick={handleCancelClick}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="form__button form__button--submit"
        >
          {location.state ? 'Update' : 'Add article'}
        </button>
      </div>
    </form>
  );
};
