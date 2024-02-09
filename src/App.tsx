import React from 'react';
import './App.scss';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { Header } from './components/Header';
import { Form } from './pages/FormPage';
import { ArticleList } from './components/ArticleList';

function App() {
  return (
    <Router>
      <div className='app'>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-articles" element={<ArticleList />} />
          <Route path="/create" element={<Form />} />
          <Route path="/edit" element={<Form />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
