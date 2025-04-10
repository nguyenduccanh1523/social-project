import { combineReducers, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import rootReducer from "./actions/reducers/rootReducer";
import settingReducer from "./store/setting/reducers";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['msg', 'loading', 'update'], // Không lưu trữ các trường này
};

// Cấu hình thêm để không lưu trữ thông báo của auth reducer
const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['setting'], // Không lưu setting reducer vào persist
};

const combinedReducers = combineReducers({
  root: rootReducer, // Your existing reducers
  setting: settingReducer, // Reducer from store1
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const reduxStore = () => {
  const store = createStore(persistedReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);

  return { store, persistor };
};

export default reduxStore;


