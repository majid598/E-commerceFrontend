import { useState } from "react";
import ProductCard from "../Components/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import { ToastContainer, toast } from "react-toastify";
import { Skeleton } from "../Components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { success } from "../main";

function Search() {

  const dispatch = useDispatch()

  const server = import.meta.env.VITE_SERVER;
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setsearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setmaxPrice] = useState(200000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const isPagePrev = page > 1;
  const isPageNext = page < 4;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  const AddtoCartHandler = (cartItem:CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock")

    dispatch(addToCart(cartItem))
    success.play()
    toast.success("Item Added To Cart")
  };

  return (
    <div className="flex w-full p-[2rem] items-start gap-[2rem] h-[calc(100vh-6rem)]">
      <aside className="w-[20rem] p-[2rem] flex flex-col border-2 border-black/40 rounded-md gap-5 h-full justify-start">
        <h2 className="text-4xl font-semibold">Fitlers</h2>
        <div>
          <h4>Sort</h4>
          <select
            value={sort}
            className="w-full p-3 cursor-pointer border-[1px] uppercase font-semibold border-black/40 rounded-md"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            className="w-full my-2 cursor-pointer"
            step="0.5"
            min={100}
            max={200000}
            value={maxPrice}
            onChange={(e) => setmaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold my-2 relative -top-10">Category</h4>
          <select
            value={category}
            className="w-full p-3 cursor-pointer border-[1px] uppercase border-black/40 font-semibold relative -top-10 rounded-md"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">None</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option value={i}>{i}</option>
              ))}
          </select>
        </div>
      </aside>
      <main className="w-[80%] h-full px-[2rem]">
        <h1 className="text-4xl font-semibold">Products</h1>
        <div className="relative ml-8 w-1/2 mt-4">
          <FaSearch className="absolute text-2xl top-1/2 text-zinc-500 -translate-y-1/2 left-4"/>
        <input
          type="text"
          className="outline-none w-full border-2 text-xl border-black/30 focus:border-black/70 rounded-full pl-12 p-2"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search By Name..."
        /></div>
        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="w-full h-[calc(100%-10rem)] grid grid-cols-5 overflow-y-auto">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={AddtoCartHandler}
                photo={`${server}/${i.photo}`}
              />
            ))}
          </div>
        )}
        {searchedData && searchedData.totalPage > 1 && (
          <article className="flex w-full justify-center items-center">
            <button
              disabled={!isPagePrev}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-2 disabled:cursor-not-allowed disabled:opacity-80 text-white font-semibold py-1 bg-blue-600 rounded-lg mx-5"
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isPageNext}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-2 disabled:cursor-not-allowed disabled:opacity-80 text-white font-semibold py-1 bg-blue-600 rounded-lg mx-5"
            >
              Next
            </button>
          </article>
        )}
      </main>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
}

export default Search;
