import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers';

import {
  bookListReducer,
  bookDetailsReducer,
  bookCreateReducer,
  bookUpdateReducer,
  bookDeleteReducer,
} from './reducers/bookReducers';

import {
  borrowingCreateReducer,
  borrowingDetailsReducer,
  borrowingListReducer,
  borrowingReturnReducer,
  borrowingRenewReducer,
  borrowingMyListReducer,
  borrowingOverdueListReducer,
} from './reducers/borrowingReducers';

import {
  categoryListReducer,
  categoryDetailsReducer,
  categoryCreateReducer,
  categoryUpdateReducer,
  categoryDeleteReducer,
} from './reducers/categoryReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  
  bookList: bookListReducer,
  bookDetails: bookDetailsReducer,
  bookCreate: bookCreateReducer,
  bookUpdate: bookUpdateReducer,
  bookDelete: bookDeleteReducer,
  
  borrowingCreate: borrowingCreateReducer,
  borrowingDetails: borrowingDetailsReducer,
  borrowingList: borrowingListReducer,
  borrowingReturn: borrowingReturnReducer,
  borrowingRenew: borrowingRenewReducer,
  borrowingMyList: borrowingMyListReducer,
  borrowingOverdueList: borrowingOverdueListReducer,
  
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,
});

// 从localStorage获取用户信息
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store; 