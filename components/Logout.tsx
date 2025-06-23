"use client";
import { CircleAlert, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutProps {
  setShowLogOut?: any;
}

export default function Logout({ setShowLogOut }: LogoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <div className="bg-secondary p-8 rounded-[0.63rem]  mx-auto">
      <div className="bg-[#FEF3F2] p-3 w-fit rounded-full mx-auto">
        <div className="bg-[#FEE4E2] p-3 rounded-full">
          <CircleAlert color="#DE3024" size={32} />
        </div>
      </div>
      <h2 className="text-xl mb-4 text-center mt-6 ">Log out</h2>
      <p className="text-md  text-center text-foreground">
        Are you sure you want to log out?
      </p>
      {/*======= Cancel Button and Delete Button ====== */}
      <div className="mt-12 grid grid-cols-2 gap-2">
        <div
          className="border hover:bg-muted/50 transition-colors duration-200 rounded-[8px] px-[28px] py-[12px] cursor-pointer text-center w-full lg:w-[230px]"
          onClick={() => setShowLogOut(false)}
        >
          Cancel
        </div>
        <button
          type="button"
          className={
            "bg-[#D92D20] hover:bg-[#D92D20]/90 rounded-[8px] px-[28px] cursor-pointer py-[12px]  text-center  w-full lg:w-[230px] whitespace-nowrap"
          }
          onClick={() => {
            setIsLoggingOut(true);
            signOut();
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <span className="flex items-center justify-center gap-1">
              <Loader2 className="mr-2 h-4 w-4 animate-spin duration-500" />
              <span className="hidden md:block"> Logging out...</span>
            </span>
          ) : (
            "Log out"
          )}
        </button>
      </div>
    </div>
  );
}
