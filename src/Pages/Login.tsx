import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { success } from "../main";

const Login = () => {
  const [gender, setgender] = useState("");
  const [date, setdate] = useState("");

  const [login] = useLoginMutation();

  const LoginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid!,
      });

      if ("data" in res) {
        success.play()
        toast.success(res.data.message);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
      }
    } catch (error) {
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
      <main className="w-full h-[80%] max-w-[400px] p-[2rem] border-2 border-black/40 rounded-md flex flex-col justify-center">
        <h1 className="text-4xl font-semibold text-center -mt-20">Login</h1>

        <div className="flex flex-col items-start">
          <label>Gender</label>
          <select
            className="w-full p-4 border-[1px] border-black/30 rounded-md my-3"
            value={gender}
            onChange={(e) => setgender(e.target.value)}
          >
            <option>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth</label>
          <input
            type="date"
            className="w-full p-4 border-[1px] border-black/30 rounded-md my-3"
            value={date}
            onChange={(e) => setdate(e.target.value)}
            name="date"
            id="date"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <p className="text-center font-semibold my-2">
            Already Signed In Once
          </p>
          <button
            onClick={LoginHandler}
            className="w-3/4 g-sky-300 flex items-center h-12 justify-between -mb-10 mt-10"
          >
            <FcGoogle className="h-full w-1/5 p-2 border-[1px] border-blue-400" />{" "}
            <span className="w-4/5 flex items-center justify-center font-semibold text-white text-[1.1rem] bg-sky-600 h-full">
              Sign in with Google
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
