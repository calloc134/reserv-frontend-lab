import { UserButton } from "@clerk/clerk-react";
import { useMatchRoute } from "@tanstack/react-router";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const match = useMatchRoute();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div>
          <h1 className="text-2xl font-bold">部室予約サイト</h1>
        </div>
        <div>
          <UserButton />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};
