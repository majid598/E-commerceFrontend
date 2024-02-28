import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NewOrderRequest } from "../types/api-types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";

const stripePromise = loadStripe(
  "pk_test_51Okn15HmzRzfXGvShWJ4qyaxo6gNmN4XbyDhm8fJD9mZqIUdAZiymjpTkXzfGRIqBh1nfDdyKANZQPkxZ9kb9wDU00vhjmQzsH"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setisProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submithandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setisProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setisProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");

      navigate("/orders");
    }
    setisProcessing(false);
  };
  return (
    <div className="w-full h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="w-1/4 border-2 border-black/40 p-12 rounded-xl">
        <form onSubmit={submithandler}>
          <PaymentElement />
          <input type="text" />
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 text-white font-bold rounded-md mt-5 text-2xl"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Cheakout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Cheakout;
