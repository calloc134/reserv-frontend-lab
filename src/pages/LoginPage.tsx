import { SignIn } from "@clerk/clerk-react";

export const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <SignIn fallbackRedirectUrl={"/home"} />
    </div>
  );
};
