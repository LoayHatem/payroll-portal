"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, validateToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();

      if (pathname === "/") {
        // Allow access to homepage for everyone
        return;
      }

      if (["/login", "/register"].includes(pathname)) {
        if (isValid) {
          router.push("/dashboard");
        }
        return;
      }

      if (!isValid) {
        router.push("/login");
      }
    };
    if (!isAuthenticated) {
      checkAuth().finally(() => setIsLoading(false));
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
          <p className="mt-2 text-gray-500">Please wait while we set things up for you.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
