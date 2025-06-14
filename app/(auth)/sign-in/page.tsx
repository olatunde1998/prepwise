import AuthForm from "@/components/AuthForm";

const Page = () => {
  return (
    <div className="flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4 max-sm:py-8">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default Page;
