import { UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b-4 border-black rounded-b-md bg-slate-200 bg-gradient-to-r from-slate-200 to-slate-400">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Link to="/home">
            <h1 className="text-2xl font-bold">部室予約サイト</h1>
          </Link>

          <Link to="/home">
            <div className="bg-slate-300 px-2 py-1 rounded-lg">
              全ての予約(週)
            </div>
          </Link>
          <Link to="/home/my_reservations">
            <div className="bg-slate-300 px-2 py-1 rounded-lg">
              自分の予約(週)
            </div>
          </Link>
        </div>
        <div>
          <UserButton />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};
