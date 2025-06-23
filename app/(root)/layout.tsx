import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import Link from "next/link";
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
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
