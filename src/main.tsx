import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./route.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";

const PUBLISHABLE_KEY =
  "pk_test_ZGFyaW5nLWJhc3MtNDcuY2xlcmsuYWNjb3VudHMuZGV2JA";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
);
