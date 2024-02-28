import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="ProductCard w-52 p-5 h-[42vh] flex flex-col items-center justify-start mt-6 relative">
      <div className="flex justify-center items-start w-[100%] h-3/4">
        <img
          className="w-full h-[22vh] m-[1rem] object-center"
          src={photo}
          alt="Mr raju webiste Creater"
        />
      </div>
      <Link
        to={`/product/${productId}`}
        className="text-2xl leading-6 relative z-[999] hover:underline font-semibold mt-8"
      >
        {name}
      </Link>
      <span className="font-bold mt-2">PKR {price}</span>
      <div className="btn-card bg-black/50 opacity-0  hover:opacity-100 transition-all duration-200 w-full h-full absolute top-0 left-0 flex items-center justify-center text-white">
        <button
          onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }
          className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-xl"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
