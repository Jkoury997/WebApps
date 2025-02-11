import React from "react";
import { getUserRoleFromCookie } from "@/utils/auth";

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const role = getUserRoleFromCookie();

    try {
      const response =await fetch("/api/auth/user/token")
    }

    if (role !== "admin") {
      return null; // No renderiza nada si el usuario no es admin
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
