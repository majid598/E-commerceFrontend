import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shippingInfo, setshippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setshippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submithandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="shipping w-full h-[calc(100vh-6rem)] flex items-start justify-center">
      <button
        className="back h-12 w-12 bg-black/90 rounded-full hover:bg-black transition-all duration-300 text-white text-xl border-none outline-none flex items-center justify-center fixed top-24 left-10"
        onClick={() => navigate("/cart")}
      >
        <BiArrowBack className="arr transition-all duration-300" />
      </button>

      <div className="flex flex-col items-center w-[450px] -mt-10 p-[2rem]">
        <h1 className="text-4xl font-semibold uppercase mb-5">
          Shipping <br /> Address
        </h1>
        <form className="flex flex-col w-full h-full" onSubmit={submithandler}>
          <input
            required
            className="p-3 my-3 text-xl w-full outline-none border-2 border-black/40 rounded-md focus:border-black transition-all duration-300"
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={changeHandler}
          />
          <input
            type="text"
            required
            className="p-3 my-3 text-xl w-full outline-none border-2 border-black/40 rounded-md focus:border-black transition-all duration-300"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={changeHandler}
          />
          <input
            required
            className="p-3 my-3 text-xl w-full outline-none border-2 border-black/40 rounded-md focus:border-black transition-all duration-300"
            type="text"
            name="state"
            placeholder="State"
            value={shippingInfo.state}
            onChange={changeHandler}
          />
          <select
            required
            className="p-3 my-3 text-xl w-full outline-none border-2 border-black/40 rounded-md focus:border-black transition-all duration-300"
            name="country"
            value={shippingInfo.country}
            onChange={changeHandler}
            id="country"
          >
            <option value="">Choose Country</option>
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Japan">Japan</option>
            <option value="Israel">Israel</option>
          </select>

          <input
            required
            className="p-3 my-3 text-xl w-full outline-none border-2 border-black/40 rounded-md focus:border-black transition-all duration-300"
            type="number"
            name="pinCode"
            placeholder="PinCode"
            value={shippingInfo.pinCode}
            onChange={changeHandler}
          />
          <input
            className="cursor-pointer w-full uppercase bg-sky-500 hover:bg-sky-600 transition-all duration-300 rounded-md font-bold text-xl text-white p-3 mt-5"
            type="submit"
            value="Pay Now"
          />
        </form>
      </div>
    </div>
  );
};

export default Shipping;
