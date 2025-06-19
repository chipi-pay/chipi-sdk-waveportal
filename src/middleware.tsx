import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definir las rutas públicas y las rutas que no necesitan pre-renderizado
const isPublicRoute = createRouteMatcher(["/", "/onboarding", "/transfer"]);
const isStaticRoute = createRouteMatcher(["/api", "/_next", "/static"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Si es una ruta estática, permitir el acceso sin verificación
  if (isStaticRoute(req)) {
    return NextResponse.next();
  }

  // If user is not authenticated and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Redirect to onboarding if user is logged in and has not completed onboarding
  if (userId && !sessionClaims?.metadata?.walletCreated && req.nextUrl.pathname !== "/onboarding" && req.nextUrl.pathname !== "/transfer") {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Allow access to all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude static routes and files
    '/((?!_next|static|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};