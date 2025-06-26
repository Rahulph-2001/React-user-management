import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/userSlices'
import adminReducer from './slices/adminSlices'

const store=configureStore({
    reducer:{
        user:userReducer,
        admin:adminReducer
    },
    devTools:true
})

export default store