import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaigns/new",
    "/campaigns/:id/apply",
    "/profile/:path*",
    "/applications/:path*",
    "/deals/:path*",
    "/creators/:path*",
    "/creator/:path*",
    "/brand/:path*",
  ],
};
