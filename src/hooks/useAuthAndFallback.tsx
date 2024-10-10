import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export const useAuthAndFallback = (callback: () => void) => {
  const { isSignedIn, isLoaded } = useAuth();

  // 認証の判定
  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      // 関数の実行
      callback();
    }
  }, [isSignedIn, isLoaded, callback]);
};
