import { getUserById } from "@/app/actions";
import Agent from "@/components/Agent";
import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const user = await getUserById(userId);
  console.log(user, "Fetched user data here ===");

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
