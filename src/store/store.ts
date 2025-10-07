import {configureStore,combineReducers} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import storage from 'redux-persist/lib/storage';
import { persistStore,persistReducer } from "redux-persist";
import clientReducer from './slices/client_slice'
import turfOwnerReducer from './slices/turfOwner_slice'
import adminReducer from './slices/admin_slice'
const rootPersistConfig = {
    key:'session',
    storage,
}

const rootReducer = combineReducers({
    client:clientReducer,
	turfOwner:turfOwnerReducer,
	admin:adminReducer
	
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