import { redirect } from "next/navigation";
import NavBar from "@/components/Navbar";
import { ReactNode } from "react";
import { auth } from "@/auth";
import "../globals.css";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const token = session?.accessToken as string;

  if (!token || !userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex mx-auto max-w-7xl flex-col gap-12 my-12 px-16 max-sm:px-4 max-sm:my-8">
      <nav className="mb-10">
        <NavBar />
      </nav>
      {children}
    </div>
  );
};

export default Layout;
