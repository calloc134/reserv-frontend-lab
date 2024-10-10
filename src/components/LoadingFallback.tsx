import { ClipLoader } from "react-spinners";

export const LoadingFallback = () => {
  return (
    <div className="flex h-screen justify-top items-center flex-col gap-4">
      <div className="flex w-1/2  flex-row gap-4 justify-center">
        <div className="p-2 rounded-lg border-2 border-black w-1/2 text-center bg-gray-200">
          予約一覧(週)
        </div>
        <div className="p-2 rounded-lg border-2 border-black w-1/2 text-center bg-gray-200">
          自分の予約一覧(週)
        </div>
      </div>
      <div className="p-16 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black">
        <ClipLoader color="#000" loading={true} size={50} />
      </div>
    </div>
  );
};
