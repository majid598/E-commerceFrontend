import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};
const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cartItem p-[2rem] flex justify-start items-center">
      <img
        className="w-[10rem] object-contain"
        src={photo}
        alt="Mr raju website creater"
      />
      <article className="flex flex-col justify-center ml-10 items-start">
        <Link
          className="text-xl font-semibold hover:underline text-black/70 hover:text-black"
          to={`/product/${productId}`}
        >
          {name}
        </Link>
        <span className="font-extrabold">PKR {price}</span>
      </article>
      <div className="ml-auto flex gap-5 items-center">
        <button
          onClick={() => decrementHandler(cartItem)}
          className="h-8 w-8 text-3xl flex items-center justify-center bg-black/20 hover:bg-black/50"
        >
          -
        </button>
        <p className="flex items-center text-xl justify-center">{quantity}</p>
        <button
          onClick={() => incrementHandler(cartItem)}
          className="h-8 w-8 text-3xl flex items-center justify-center bg-black/20 hover:bg-black/50"
        >
          +
        </button>
      </div>

      <button  onClick={() => removeHandler(productId)} className="ml-8 text-xl hover:text-red-600">
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
