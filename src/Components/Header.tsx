import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSign,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface PropsType {
  user: User | null;
}
const Header = ({ user }: PropsType) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  const logouthandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setisOpen(false);
    } catch (error) {
      toast.error("Sign Out fail");
    }
  };

  return (
    <nav className="flex justify-between px-10 pl-20 h-24 items-center">
      {/* <Link to={"/"}>
        <div className="right flex items-end text-5xl text-pink-800 uppercase font-extrabold"><img width="80px" src="./assets/Rlogo.jpg" alt="Mr raju website Creater" /><h2 className="relative -left-3">aju</h2></div>
      </Link> */}<div></div>
      <div className="left flex gap-12 items-center text-xl">
        <Link onClick={() => setisOpen(false)} className="font-bold" to={"/"}>
          Home
        </Link>
        <Link onClick={() => setisOpen(false)} to={"/search"}>
          <FaSearch />
        </Link>
        <Link onClick={() => setisOpen(false)} to={"/cart"}>
          <FaShoppingBag />
        </Link>
        {user?._id ? (
          <div>
            <button onClick={() => setisOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog
              className="absolute left-[86%] top-24 border-2 p-4"
              open={isOpen}
            >
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link
                    onClick={() => setisOpen(false)}
                    to={"/admin/dashboard"}
                  >
                    Admin
                  </Link>
                )}
                <Link onClick={() => setisOpen(false)} to={"/orders"}>
                  Orders
                </Link>
                <button onClick={logouthandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </div>
        ) : (
          <Link onClick={() => setisOpen(false)} to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
