import { UserButton } from "@clerk/clerk-react";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b-4 border-black rounded-b-md bg-slate-200 bg-gradient-to-r from-slate-200 to-slate-400">
        <div className="flex flex-row gap-2 justify-center items-center">
          <h1 className="text-2xl font-bold">部室予約サイト</h1>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            トップページへ
          </a>
        </div>
        <div>
          <UserButton />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};
