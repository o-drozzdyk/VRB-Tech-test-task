import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types/Article';

interface State {
  articles: Article[];
  query: string;
  page: number;
  pinnedArticle: Article | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: null | unknown;
}

const initialState: State = {
  articles: [],
  query: 'ukraine',
  page: 1,
  pinnedArticle: null,
  status: 'idle',
  error: null
};

// const API_KEY = '83ecf594ab5b45378737d06162869a68';
const API_KEY = 'ee10448230dc480e879d39e5b76aa37c';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ query, page }: { query: string, page: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&pageSize=10&page=${page}&apiKey=${API_KEY}`);
      const data = await response.json();
      return data.articles;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload.toLowerCase();
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    resetPage: (state) => {
      state.page = 1;
    },

    pinArticle: (state, action: PayloadAction<Article>) => {
      state.pinnedArticle = action.payload;

      const articleIndex = state.articles.indexOf(action.payload);

      if (articleIndex !== 0) {
        state.articles = 
          [state.pinnedArticle, 
            ...state.articles.filter(article => article.publishedAt !== state.pinnedArticle?.publishedAt)];
      }

      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      const savedArticleIndex = savedArticles
        .findIndex((article: Article) => article.publishedAt === state.pinnedArticle?.publishedAt);

      if (savedArticleIndex !== -1) {
        const sortedArticles = [action.payload, 
          ...savedArticles.filter((article: Article) => article.publishedAt !== state.pinnedArticle?.publishedAt)];

        localStorage.setItem('articles', JSON.stringify(sortedArticles));
      }
    },

    unpinArticle: (state) => {
      state.pinnedArticle = null;
    },

    createArticle: (state, action: PayloadAction<Omit<Article, 'publishedAt'>>) => {
      const newArticle = { ...action.payload, publishedAt: '' + new Date() };

      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      localStorage.setItem('articles', JSON.stringify([...savedArticles, newArticle]));
    },

    deleteArticle: (state, action: PayloadAction<Article>) => {
      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      localStorage.setItem('articles', JSON.stringify(savedArticles
        .filter((article: Article) => article.publishedAt !== action.payload.publishedAt)));

      if (state.pinnedArticle === action.payload) {
        state.pinnedArticle = null;
      }
    },

    updateArticle: (state, action: PayloadAction<Article>) => {
      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      const updatedArticles = savedArticles.map((article: Article) => {
        return article.publishedAt === action.payload.publishedAt
          ? { ...action.payload }
          : article;
      });

      localStorage.setItem('articles', JSON.stringify(updatedArticles));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = state.page === 1 ? action.payload : [...state.articles, ...action.payload];
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  setQuery, setPage, resetPage, 
  createArticle, deleteArticle, updateArticle, 
  pinArticle, unpinArticle 
} = articlesSlice.actions;

export default articlesSlice.reducer;
