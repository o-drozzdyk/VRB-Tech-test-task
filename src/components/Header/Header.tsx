import React from "react";
import { Link } from "react-router-dom";
import './Header.scss';
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <Link to='/' className="header__logo">Articles</Link>

        <div className="header__links">
          <NavLink 
            to="/" 
            className={
              ({ isActive }) => {
                return isActive ? 'header__link header__link--active' : 'header__link';
              }
            }
          >
            Home
          </NavLink>

          <NavLink 
            to="/my-articles" 
            className={
              ({ isActive }) => {
                return isActive ? 'header__link header__link--active' : 'header__link';
              }
            }
          >
            My articles
          </NavLink>
        </div>

        <Link to='/create' className="header__button">Add article</Link>
      </nav>
    </header>
  );
};
