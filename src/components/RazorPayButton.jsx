import React, {useEffect} from "react";
import {useDispatch} from 'react-redux'
import {displayRazorPayPanel, postBackendOrder} from "../features/razorpay/razorpaySlice";
import store from "../app/store";

function RazorPayButton(props) {

    const rpUrl = "https://checkout.razorpay.com/v1/checkout.js";

    useEffect( () => {
        const script = document.createElement('script');
        script.src = rpUrl;
        script.async = false;
        document.body.appendChild(script);
        console.log("add:" + script.src)
        return () => {
            document.body.removeChild(script);
            console.log("remove:" + script.src)
        }
    }, []);

    const dispatch = useDispatch()

    async function processPmt(amount, bidId, loanId, purpose) {
        const orderData = {
            amount: amount,
            bidId: bidId,
            currencyType: "INR",
            loanId: loanId,
            purpose: purpose
        }
        await dispatch(postBackendOrder(orderData));
        const req = store.getState().razorpay.rporder;
        if (!req.isError) {
            await dispatch(displayRazorPayPanel(req.responseObject));
        } else {
            alert(req.message)
        }
    }

    return (
        <div className="application">
            <p> Me trying something </p>
            <button onClick={() => processPmt(props.amount, props.bidId, props.loanId, props.purpose)}>PAY</button>
        </div>
    );
};

export default RazorPayButton;
