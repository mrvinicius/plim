import { combineReducers } from 'redux';
import shoppingListReducer from './shopping-list/shopping-list.reducer';

export default combineReducers({ shoppingListReducer });