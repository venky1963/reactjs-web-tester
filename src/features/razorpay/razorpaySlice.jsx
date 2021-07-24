import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";
import 'regenerator-runtime/runtime';

const AUTHORIZATION = 'authtoken';
const API = axios.create({
    baseURL: "http://localhost:1117/api/v1"
});
const authorize = (token) => {
    if (token) {
        API.defaults.headers[AUTHORIZATION] = token;
    }
};
const token = "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJkOWVkZjBjZC03MTM2LTQ4ZWMtYTY4MC0wNjc2Y2ZkMjMzMTQiLCJzdWIiOiJ0ZXN0MTRAbWFpbGluYXRvci5jb21XRUIiLCJpYXQiOjE2MjcxNjUzNDAsImV4cCI6MTYyNzE2ODk0MH0.fgu_9DT1ZLjhtFn7ufwYr-3M4QBBNuTqF_Qch6utms5k_wNis9quVslbdYLV-OAi9NEEkeTU9A3yc2Qy_h9mxw"
const orderUrl = "/user/payment/order"
const verifyUrl = "/user/payment/verify"
const rpKey = "rzp_test_CDlmfMs1WmWLhk"

export const razorpaySlice = createSlice({
    name: 'razorpay',
    initialState: {
        operation: "idle",
        rporder: null,
        error: null
    },
    reducers: {
        initiateOrder: (state, action) => {
            state.operation = "order_initiated"
            state.rporder = action.payload
        },
        processRazorpay: (state, action) => {
            state.operation = "process_razorpay"
            state.rporder.responseObject.transactionId= action.payload.paymentId
            state.rporder.responseObject.pmtSignature= action.payload.signature
        },
        verifyPmt: (state, action) => {
            state.rporder.responseObject.transactionId= action.payload.paymentId
            state.rporder.responseObject.pmtSignature= action.payload.signature
        },
        pmtError: (state, action) => {
            console.log(action.payload)
            state.operation = "error_pmt"
            state.error = action.payload
        }
    }
})

export const postBackendOrder = (req) => async dispatch => {
    try {
        authorize(token);
        await API.post(orderUrl, req)
            .then(res => dispatch(initiateOrder(res.data)))
    } catch (e) {
        dispatch(pmtError(e.response.data))
    }
}

export const verifyBackendOrder = (req) => async dispatch => {
    try {
        authorize(token);
        await API.post(verifyUrl, req)
            .then(res => dispatch(verifyPmt(res.data)))
    } catch (e) {
        alert(e)
        dispatch(pmtError(e.response.data))
    }
}

export const displayRazorPayPanel = (req) => async dispatch => {
   const options = {
        key: rpKey,
        amount: Math.ceil(req.amount * 100),
        currency: req.currencyType,
        name: "Sleekfin India Pvt Ltd",
        description: req.purpose,
        image: "https://www.sleekfin.com/api/v1/document/static/SleekfinRoundLogo.png",
        order_id: req.order_id,
        handler: async function (response) {
            if (response.razorpay_payment_id == null) {
                alert("Payment failed");
                dispatch(pmtError(response.data))
                return;
            }
            const data = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
            };
            dispatch(processRazorpay(data));
            dispatch(verifyBackendOrder(data));
        },
        prefill: {
            name: req.userAbridgedResponse.firstName + " " + req.userAbridgedResponse.lastName,
            email: req.userAbridgedResponse.primaryEmail,
            //contact: req.userAbridgedResponse.phoneNumber,
            contact: "8248335667",
        },
        theme: {
            color: "#3179BE",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}

export const {initiateOrder, processRazorpay, verifyPmt, pmtError} = razorpaySlice.actions
export default razorpaySlice.reducer
