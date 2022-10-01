import { createSlice, createSelector } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { Alert } from "rsuite";
import { gameServer } from "../../config";


// Create entity slice of the store
const slice = createSlice({
  name: "articles",
  initialState: {
    list: [],
    hidden: [],
    loading: false,
    new: [],
    lastFetch: null,
    newarticles: 0
  },
  // Reducers - Events
  reducers: {
    articlesRequested: (articles, action) => {
      console.log(`${action.type} Dispatched...`)
      articles.loading = true;
    },
    articlesReceived: (articles, action) => {
      console.log(`${action.type} Dispatched...`);
      // Alert.info('article State Loaded!', 3000);
      articles.list = action.payload;
      articles.loading = false;
      articles.lastFetch = Date.now();
    },
    articlesRequestFailed: (articles, action) => {
      console.log(`${action.type} Dispatched`)
      Alert.error(`${action.type}: ${action.payload}`, 4000);
      articles.loading = false;
    },
    articleAdded: (articles, action) => {
      console.log(`${action.type} Dispatched`)
      articles.list.push(action.payload);
    },
    articleHidden:(articles, action) => {
      console.log(`${action.type} Dispatched`)
      let index = articles.list.findIndex(el => el._id === action.payload._id);
      articles.list[index].hidden = true;
      articles.list = articles.list.filter(item => item.hidden === false);
      articles.hidden = articles.list.filter(item => item.hidden === true);
    },
		articleUpdated: (articles, action) => {
      console.log(`${action.type} Dispatched...`);
      const index = articles.list.findIndex(el => el._id === action.payload._id);

      if(index > -1) {
        if (action.payload.tags.some(el => el.toLowerCase() === 'published') && articles.list[index].tags.some(el => el.toLowerCase() === 'draft')) {
          articles.new.push(action.payload);
        }
        articles.list[index] = action.payload;
      }
      else {
        articles.list.push(action.payload);
        if (action.payload.tags.some(el => el.toLowerCase() === 'published')) articles.new.push(action.payload);
      }
      articles.lastFetch = Date.now();
    },
		articleDeleted: (articles, action) => {
      console.log(`${action.type} Dispatched`)
      const index = articles.list.findIndex(el => el._id === action.payload._id);
      articles.list.splice(index, 1);
    },
    clearNewArticle: (articles, action) => {
      console.log(`${action.type} Dispatched`)
      const index = articles.new.findIndex(el => el._id === action.payload._id);
      articles.new.splice(index, 1);
    },
  }
});

// Action Export
export const {
  articleAdded,
  articleHidden,
	articleUpdated,
	articleDeleted,
  clearNewArticle,
  articlesReceived,
  articlesRequested,
  articlesRequestFailed
} = slice.actions;

export default slice.reducer; // Reducer Export

// Selector
export const getMyArticles = createSelector(
  state => state.articles.list,
  state => state.characters.list.find(el => el.username === state.auth.user.username),
  (articles, myCharacter) => articles.filter(
    article => (( article.creator?._id === myCharacter?._id ) ))
);

export const getPublishedArticles = createSelector(
  state => state.articles.list,
  state => state.characters.list.find(el => el.username === state.auth.user.username),
  (articles) => articles.filter(
    article => ( article.tags.some(tag => tag === 'Published')))
);

export const getCurrentArticles = createSelector(
  state => state.articles.list,
	state => state.gamestate.round,
  (articles, round) => articles.filter(
    article => ( article.round <= round))
);


// Action Creators (Commands)
const url = `${gameServer}api/articles`;

// article Loader into state
export const loadArticles = (payload) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
			data: payload,
      onStart:articlesRequested.type,
      onSuccess:articlesReceived.type,
      onError:articlesRequestFailed.type
    })
  );
};

// Add a article to the list of articles
export const addarticle = article =>
  apiCallBegan({
    url,
    method: "post",
    data: article,
    onSuccess: articleAdded.type
  });