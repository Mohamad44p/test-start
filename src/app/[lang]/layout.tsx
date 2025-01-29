import type { Metadata } from "next";
import Preloader from "@/components/preloader/Preloader";
import { LoadingProvider } from "@/context/LoadingContext";
import LenisProvider from "@/components/lenis/ReactLenisW";
import { ConditionalNavbar } from "@/components/shared/Nav/ConditionalNavbar";
import Footer from "@/components/shared/Footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Tech Start",
  description:
    "Tech Start is a tech company that provides advanced training programs.",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const dir = params.lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={params.lang} dir={dir} className="lenis lenis-smooth">
      <body>
        <LoadingProvider>
          <LanguageProvider>
            <Preloader>
              <LenisProvider>
                <div className="flex min-h-screen flex-col">
                  <ConditionalNavbar />
                  {children}
                  <Footer />
                </div>
                <Toaster />
              </LenisProvider>
            </Preloader>
          </LanguageProvider>
          <div id="modal-root" />
        </LoadingProvider>
      </body>
    </html>
  );
}