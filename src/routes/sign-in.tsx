import { SignIn } from "@clerk/clerk-react";
import SignUpImg from "./../assets/login.svg";

export default function SignInPage() {
  return (
    <div className="bg-gradient-to-tr from-blue-500 to-blue-800 h-screen w-screen flex flex-col">
      <p className="text-center text-5xl py-7 font-bold text-white">
        EnergyWise
      </p>
      <div className="flex items-center justify-around grow">
        <div className="w-[500px] h-[500px] flex justify-center items-center">
          <img src={SignUpImg} alt="logo" />
        </div>
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
