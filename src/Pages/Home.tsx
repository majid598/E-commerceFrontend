import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
// import toast from "react-hot-toast";
import { Skeleton } from "../Components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { success } from "../main";

const Home = () => {
  const dispatch = useDispatch();
  const server = import.meta.env.VITE_SERVER;
  const { data, isLoading, isError } = useLatestProductsQuery("");

  if (isError) toast.error("Cannot fetch the Products");

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    success.play();
    toast.success("Added to cart");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col py-[2rem] px-[5%]">
        <section className="w-full h-[35vh] flex items-center overflow-hidden">
          <img
            className="w-full h-[100vh] selection:bg-transparent"
            src="./assets/bg.jpg"
            alt=""
          />
        </section>

        <div className="w-full text-zinc-500 mt-5 flex justify-between items-center">
          {" "}
          <h1 className="text-4xl ">Latest Products</h1>
          <Link
            className="text-2xl hover:underline text-zinc-500 font-semibold"
            to={"/search"}
          >
            More
          </Link>
        </div>
        <main className="w-full grid grid-cols-6 gap-12 min-h-screen">
          {isLoading ? (
            <Skeleton width="80vw" />
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={`${server}/${i.photo}`}
              />
            ))
          )}
        </main>
      </div>
      {/* <ToastContainer pauseOnHover={false} /> */}
    </div>
  );
};

export default Home;
