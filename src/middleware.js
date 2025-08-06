import { NextResponse } from "next/server";

export function middleware(request) {
  const buyerId = request.cookies.get("buyerId");
  const sellerId = request.cookies.get("sellerId");
  const url = request.nextUrl.clone();

  if (buyerId) {
    if (url.pathname.startsWith("/join-room")) {
      url.pathname = `/buyer-panel/${buyerId.value}`;
      return NextResponse.redirect(url);
    } else if (url.pathname.startsWith(`/buyer-panel/${buyerId.value}`)) {
      return NextResponse.next();
    } else {
      url.pathname = `/join-room`;
      return NextResponse.redirect(url);
    }
  } else if (sellerId) {
    if (url.pathname.startsWith("/join-room")) {
      url.pathname = `/seller-panel/${sellerId.value}`;
      return NextResponse.redirect(url);
    } else if (url.pathname.startsWith(`/seller-panel/${sellerId.value}`)) {
      return NextResponse.next();
    } else {
      url.pathname = `/join-room`;
      return NextResponse.redirect(url);
    }
  } else if (url.pathname.startsWith("/buyer-panel") || url.pathname.startsWith("/seller-panel")) {
    url.pathname = "/join-room";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/buyer-panel/:path*", "/seller-panel/:path*", "/join-room"],
};
