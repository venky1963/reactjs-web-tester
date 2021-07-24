import { configureStore } from '@reduxjs/toolkit'
import razorpayReducer from '../features/razorpay/razorpaySlice'

export default configureStore({
    reducer: {
        razorpay: razorpayReducer
    }
})
