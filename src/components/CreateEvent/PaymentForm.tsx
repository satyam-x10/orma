import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import "./PaymentForm.css";
const API_URL = import.meta.env.VITE_API_URL;
const APP_URL = import.meta.env.VITE_APP_URL;
import Cookies from "js-cookie";
import axiosInstance from "../../api";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({
  price,
  price_id,
  event_hash,
}: {
  price: string;
  price_id: string;
  event_hash: string;
}) => {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [status, setStatus] = useState("paymentIntent");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  let token = Cookies.get("token");

  const qrValue = `${APP_URL}/${event_hash}`;

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (cardNumber) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
      });

      if (!token) {
        navigate("./login");
      }

      if (!error) {
        try {
          const { id } = paymentMethod;
          const response = await axiosInstance.post(
            `${API_URL}/events/payment`,
            {
              amount: parseFloat(price) * 100,
              id,
              event_hash,
              price_id,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          if (response.data.success) {
            setSuccess(true);
          }
        } catch (error) {
        }
      } else {
        setErrorMessage(error?.message);
      }
    }
    return false;
  };

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    // @ts-ignore
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Orma Pricing Plan",
        amount: parseFloat(price) * 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    if (pr) {
      pr.canMakePayment().then((result) => {
        if (result) {
          // @ts-ignore
          setPaymentRequest(pr);
        }
      });

      pr.on("paymentmethod", async (e) => {
        const response = await axiosInstance.post(
          `${API_URL}/events/paymentIntent`,
          {
            amount: parseFloat(price) * 100,
            event_hash,
            price_id,
            status,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const { clientSecret, backendError } = response.data;


        if (backendError || response.data?.success === false) {
          setErrorMessage(backendError.message ?? "There was an error processing your payment.");
          return;
        }

        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: e.paymentMethod.id,
            },
            { handleActions: false }
          );

        if (stripeError) {
          setErrorMessage(stripeError.message);
          return;
        }
        setStatus("confirmed");
        try {
          const changeResponse = await axiosInstance.post(
            `${API_URL}/events/paymentIntent`,
            {
              amount: parseFloat(price) * 100,
              event_hash,
              price_id,
              status,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (changeResponse.data.success) {
            console.log("Successful payment");
            setSuccess(true);
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      });
    }
  }, [stripe, elements, success]);

  return (
    <>
      {!success && price != "0" ? (
        <div className="payment-form">
          <h2 className="create-event-heading">Credit Card Details</h2>
          <div className="form-row">
            <label htmlFor="cardNumber">Card Number</label>
            <CardNumberElement id="cardNumber" className="card-input" />
          </div>
          <div className="form-row">
            <label htmlFor="cardExpiry">Expiry Date</label>
            <CardExpiryElement id="cardExpiry" className="card-input" />
          </div>
          <div className="form-row">
            <label htmlFor="cardCvc">CVC</label>
            <CardCvcElement id="cardCvc" className="card-input" />
          </div>
          <div className="form-row">
            <label htmlFor="Price">Price</label>
            <input
              type="text"
              disabled={true}
              value={`$${price}`}
              className="create-event-input-disabled"
            />
          </div>
          <button className="pay-button" onClick={handlePayment}>
            Pay
          </button>
          {paymentRequest && (
            /* @ts-ignore */
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          )}

          <div style={{ padding: "10px" }}>{errorMessage}</div>
        </div>
      ) : (
        <div>
          <h2>Your payment has been received successfully.</h2>
          <div
            className="qr-code"
            style={{ wordWrap: "break-word", textAlign: "center" }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "200px", width: "100%" }}
              value={qrValue}
              viewBox={`0 0 256 256`}
            />
            <h4 style={{ marginBottom: "0px" }}>
              Or you can click here as well:
            </h4>
            <a href={qrValue}>
              <h4 style={{ marginTop: "2px" }}> {qrValue} </h4>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
