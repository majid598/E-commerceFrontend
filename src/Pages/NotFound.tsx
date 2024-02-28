import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate("/");
  };
  return (
    <div className="w-full h-[calc(100vh-10rem)] gap-4 flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">Page 404 Not Found</h1>
      <button
        onClick={back}
        className="py-4 px-20 text-2xl rounded-full bg-red-500 hover:scale-90 hover:bg-red-600 transition-all duration-300 text-white font-bold"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
