import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // Handle video files
  if (request.nextUrl.pathname.startsWith("/videos/")) {
    // Remove any language prefix from the path
    const path = request.nextUrl.pathname.replace(/^\/[a-z]{2}\//, "/");
    const response = NextResponse.rewrite(new URL(path, request.url));

    // Add necessary headers for video streaming
    response.headers.set("Accept-Ranges", "bytes");
    response.headers.set("Content-Type", "video/mp4");

    // Add CSP headers
    response.headers.set(
      "Content-Security-Policy",
      `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: *.ytimg.com;
        media-src 'self' blob: https: http:;
        frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
        connect-src 'self' https:;
        worker-src 'self' blob:;
        frame-ancestors 'self';
      `
        .replace(/\s{2,}/g, " ")
        .trim(),
    );

    // Set cookie policies
    response.headers.set("Set-Cookie", "SameSite=Lax; Secure; Path=/;");

    // Set permissions policy
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );

    // Add additional security headers
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Permissions-Policy",
      "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), encrypted-media=(), fullscreen=*, gyroscope=(), magnetometer=(), microphone=(), picture-in-picture=*, sync-xhr=(), usb=()",
    );

    return response;
  }

  // Handle video file requests
  if (request.nextUrl.pathname.startsWith('/uploads/videos/')) {
    const response = NextResponse.next();
    
    // Add proper headers for video streaming
    response.headers.set('Accept-Ranges', 'bytes');
    response.headers.set('Content-Type', 'video/mp4');
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Range');
    
    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.match(/\.(ico|jpg|jpeg|png|gif|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const pathnameParts = pathname.split("/");
  const pathnameLocale = pathnameParts[1];

  if (!locales.includes(pathnameLocale)) {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();

  if (pathnameLocale !== savedLocale) {
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      path: "/",
      maxAge: 31536000, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      partitioned: true,
    });
  }

  // Set cookie policies
  response.headers.set("Set-Cookie", "SameSite=Lax; Secure; Path=/; Partitioned");

  // Add CSP headers
  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: *.ytimg.com;
      media-src 'self' blob: https: http:;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      connect-src 'self' https:;
      worker-src 'self' blob:;
      frame-ancestors 'self';
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  );

  // Set permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Add additional security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), clipboard-write=(), encrypted-media=(), fullscreen=*, gyroscope=(), magnetometer=(), microphone=(), picture-in-picture=*, sync-xhr=(), usb=()",
  );

  return response;
}

export const config = {
  matcher: ["/videos/:path*", "/((?!api|_next|admin|assets|favicon.ico).*)", "/uploads/videos/:path*", '/api/upload-video', '/api/delete-video'],
};