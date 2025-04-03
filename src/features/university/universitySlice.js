// src/features/university/universitySlice.js
import { createSlice } from '@reduxjs/toolkit';


const loadFavoritesFromLocalStorage = () => {
  try {
    const favorites = localStorage.getItem('favoriteUniversities');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const initialState = {
  searchTerm: '',
  country: '',
  offset: 0,
  limit: 10,
  universities: [],
  loading: false,
  error: null,
  favorites: loadFavoritesFromLocalStorage(),
};

const universitySlice = createSlice({
  name: 'university',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.offset = 0;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
      state.offset = 0;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setUniversities: (state, action) => {
      state.universities = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addToFavorites: (state, action) => {
      const university = action.payload;
      if (!state.favorites.some(fav => 
        fav.name === university.name && fav.country === university.country
      )) {
        state.favorites.push(university);
        try {
          localStorage.setItem('favoriteUniversities', JSON.stringify(state.favorites));
        } catch (error) {
          console.error('Error saving favorites to localStorage:', error);
        }
      }
    },
    removeFromFavorites: (state, action) => {
      const university = action.payload;
      state.favorites = state.favorites.filter(
        fav => !(fav.name === university.name && fav.country === university.country)
      );
      try {
        localStorage.setItem('favoriteUniversities', JSON.stringify(state.favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    },
  },
});

export const {
  setSearchTerm,
  setCountry,
  setOffset,
  setUniversities,
  setLoading,
  setError,
  addToFavorites,
  removeFromFavorites,
} = universitySlice.actions;

export default universitySlice.reducer;