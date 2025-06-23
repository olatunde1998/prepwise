"use client";
import { Bell, LogOut, PencilLine, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlinePriceChange } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiMenu, HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";
import PrepwiseLogo from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import { getUserById } from "@/app/actions";
import { Modal } from "./Modal";
import Image from "next/image";
import Logout from "./Logout";
import Link from "next/link";

export default function NavBar() {
  const [dropNav, setDropNav] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const { data: userData } = useQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  console.log("User Data: is here====", userData);

  // Handle Dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-white/2 backdrop-blur-2xl fixed top-0 left-0 right-0 z-[1000] border-b border-white/20 px-6 lg:px-12 xl:px-20 py-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-saturate-150">
        <div className="flex justify-between items-center lg:block">
          <div className="lg:flex justify-between items-center">
            <div className="flex items-center">
              <div onClick={() => router.back()} className="">
                <Image
                  src={PrepwiseLogo}
                  alt="Prepwise brand Logo"
                  width={38}
                  height={32}
                  priority
                  quality={100}
                />
              </div>
              <div className="border-l border-ring pl-3 ml-3 space-y-3 hidden md:inline-block">
                <p className="text-xs font-light">Hi {userData?.name}</p>
                <p>Welcome 👋</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-x-2 text-sm md:text-base cursor-pointer font-light w-fit">
              <Link href="#" className="flex items-center gap-2">
                <PencilLine className="size-4" />
                Blog
              </Link>
              <Link
                href="#"
                className="mx-6 flex items-center gap-2"
              >
                <MdOutlinePriceChange className="size-5" />
                Billing
              </Link>
              <Link href="#" className="">
                Notifications
              </Link>

              <div className="flex items-center space-x-3 ml-4">
                <div
                  onClick={() => setShowActions((prevState) => !prevState)}
                  className="flex justify-start"
                >
                  <div className="relative cursor-pointer">
                    {!userData?.avatarImage ? (
                      <div className="w-[40px] h-[40px] border border-sidebar-ring items-center justify-center flex rounded-full text-[20px] bg-muted text-white font-bold">
                        {userData?.name?.charAt(0)?.toUpperCase() ?? "N/A"}
                      </div>
                    ) : (
                      <Image
                        src={userData?.avatarImage}
                        alt="user avatar pics"
                        width={42}
                        height={42}
                        className="w-[42px] h-[42px] border border-ring items-center justify-center flex rounded-full object-cover"
                      />
                    )}
                    <div
                      ref={dropdownRef}
                      className={`${
                        showActions === true ? "block" : "hidden"
                      } bg-background text-foreground py-3  rounded-lg text-sm border  space-y-2 absolute right-[-1px] lg:right-[-18px] z-[1] top-[60px]`}
                    >
                      <Link
                        href="#"
                        className="hover:bg-sidebar-border flex items-center gap-x-2 cursor-pointer p-2 pr-10 pl-4"
                      >
                        <Settings size={18} className="" />
                        Settings
                      </Link>
                      <div
                        className="hover:bg-sidebar-border flex items-center gap-x-2 cursor-pointer text-red-600 p-2 pr-20 pl-4"
                        onClick={() => {
                          setShowActions(false);
                          setShowLogOut(true);
                        }}
                      >
                        <LogOut size={20} />
                        Logout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ======= Menu button (Hamburger button) ======*/}
          <div className="lg:hidden flex space-x-3">
            {/* <ModeToggle /> */}
            <Link
              href="#"
              className="bg-slate-300 dark:border-muted dark:border-[0.3px] dark:bg-background dark:hover:bg-muted p-2 rounded-lg flex items-center justify-center"
            >
              <div className="relative">
                <Bell size={18} />
              </div>
            </Link>

            <HiMenu
              className="transition"
              size={32}
              onClick={() => {
                setDropNav(true);
              }}
            />
          </div>
        </div>

        {/*====== Mobile view ======*/}
        <section className="lg:hidden text-black">
          <AnimatePresence>
            {dropNav && (
              <motion.div
                initial={{ x: "90vw" }}
                animate={{ x: 0 }}
                exit={{ x: "90vw" }}
                transition={{ type: "spring", duration: 3 }}
                className="fixed top-0 right-0 w-[80%] min-h-screen bg-[#F6F8FD] dark:bg-muted z-30 pl-4"
              >
                <div className="flex justify-between p-3 pr-6">
                  <a href="#" className="flex items-center">
                    <Image
                      src={PrepwiseLogo}
                      alt="Prepwise brand logo"
                      width={38}
                      height={32}
                      priority
                    />
                  </a>
                  <HiX
                    className="text-lg transition mt-2 dark:text-accent-foreground"
                    size={32}
                    onClick={() => {
                      setDropNav(false);
                    }}
                  />
                </div>
                <ul className="flex flex-col mt-4 font-light text-sm rounded-lg space-y-3">
                  {/* {studentMobileRoutes.map((route, index) => ( */}
                  <li
                    // key={index}
                    className="block py-2 pl-1.5 mx-2 pr-3 border-b border-ring dark:text-accent-foreground"
                  >
                    <Link
                      onClick={() => {
                        setDropNav(false);
                      }}
                      // href={route.href}
                      href="/sign-up"
                      className="w-full inline-block"
                    >
                      {/* {route.name} */}
                      Sign Up
                    </Link>
                  </li>
                  {/* ))} */}
                </ul>

                <div
                  onClick={() => setShowLogOut(true)}
                  className="mt-10 ml-3 text-sm flex items-center space-x-4 p-2 pr-3  cursor-pointer rounded-lg w-fit font-light text-white shadow-sm bg-gradient-to-r from-[#f40808] to-[#d97777]"
                >
                  <LogOut size={16} />
                  <p>Log out</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </nav>

      <Modal show={showLogOut} onClose={() => setShowLogOut(false)}>
        <Logout setShowLogOut={setShowLogOut} />
      </Modal>
    </>
  );
}
