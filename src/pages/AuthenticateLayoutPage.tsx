import { useNavigate } from "@tanstack/react-router";
import { useAuthAndFallback } from "@/hooks/useAuthAndFallback";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { HomeLayout } from "@/components/HomeLayout";

export const AuthenticateLayoutPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const callback = useCallback(() => {
    toast.error("ログインしてください");
    navigate({
      to: "/",
    });
  }, [navigate]);
  useAuthAndFallback(callback);

  return <HomeLayout>{children}</HomeLayout>;
};
