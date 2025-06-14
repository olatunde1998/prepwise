import { getUserById } from "@/app/actions";
import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const token = session?.accessToken as string;
  const user = await getUserById(userId);

  if (!token || !userId) {
    redirect("/");
  }

  return (
    <>
      <h3>Interview generation</h3>
      <Agent
        userName={user?.name!}
        userId={user?.id}
        // profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;
