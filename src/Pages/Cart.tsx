import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../Components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { success } from "../main";

function Cart() {
  const server = import.meta.env.VITE_SERVER;
  const dispatch = useDispatch();
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setcouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    success.play()
    toast.success("Item Removed Successfully");
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeoutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setisValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setisValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
      cancel();
      setisValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart w-full">
      <div className="py-[2rem] px-[4rem] flex justify-between items-start w-full">
        <main className="main w-[70%] overflow-y-auto flex flex-col justify-start">
          {cartItems.length > 0 ? (
            cartItems.map((i, idx) => (
              <CartItemCard
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={idx}
                cartItem={i}
              />
            ))
          ) : (
            <h1 className="text-2xl font-semibold">No Items Added</h1>
          )}
        </main>
        <aside className="w-[30%] h-[70vh] flex flex-col justify-center p-[4rem] relative">
          <p className="text-[1.1rem]">Subtotal: PKR {subtotal}</p>
          <p className="text-[1.1rem]">
            ShippingCharges: PKR {shippingCharges}
          </p>
          <p className="text-[1.1rem]">Tax: PKR {tax}</p>
          <p className="text-[1.1rem]">
            Disscount: <em className="text-red-500"> - PKR {discount}</em>
          </p>
          <p className="text-[1.1rem]">
            <b>Total: PKR {total}</b>
          </p>
          <input
            type="text"
            className="p-[1rem] border-[1px] border-black/20 outline-none mt-10"
            value={couponCode}
            onChange={(e) => setcouponCode(e.target.value)}
            placeholder="Coupon Code"
          />

          {couponCode &&
            (isValidCouponCode ? (
              <span className="text-green-600 absolute mt-5 w-[19.6rem] top-[60%] items-center gap-2 flex justify-center">
                PKR {discount} off using the
                <code className="font-extrabold self-end">{couponCode}</code>
              </span>
            ) : (
              <span className="text-red-500 absolute flex w-[19.6rem] top-[60%] mt-5 justify-center items-center gap-2">
                Invalid Coupon <VscError />
              </span>
            ))}

          <div className="w-full bg-transparent h-28 relative">
            {cartItems.length > 0 && (
              <Link
                to="/shipping"
                className="p-5 w-full absolute uppercase bg-sky-600 rounded-md mt-16 text-center font-bold hover:opacity-80"
              >
                Cheakout
              </Link>
            )}
          </div>
        </aside>
      </div>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
}

export default Cart;
