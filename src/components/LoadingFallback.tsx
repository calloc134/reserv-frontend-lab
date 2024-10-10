import { ClipLoader } from "react-spinners";

export const LoadingFallback = () => {
  return (
    <div className="flex h-screen justify-center items-center flex-col gap-4">
      <div className="p-16 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black">
        <ClipLoader color="#000" loading={true} size={50} />
      </div>
    </div>
  );
};
