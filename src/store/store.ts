import {configureStore,combineReducers} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import storage from 'redux-persist/lib/storage';
import { persistStore } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import clientReducer from './slices/client_slice'
const rootPersistConfig = {
    key:'session',
    storage,
}

const rootReducer = combineReducers({
    client:clientReducer
	
})

const persistedReducer = persistReducer(rootPersistConfig,rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
});

export const persistor =persistStore(store)

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch =()=>useDispatch<AppDispatch>()