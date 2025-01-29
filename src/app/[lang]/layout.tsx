import type { Metadata } from "next";
import Preloader from "@/components/preloader/Preloader";
import { LoadingProvider } from "@/context/LoadingContext";
import LenisProvider from "@/components/lenis/ReactLenisW";
import { ConditionalNavbar } from "@/components/shared/Nav/ConditionalNavbar";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";
import FooterWrapper from "@/components/shared/Footer/FooterWrapper";

export const metadata: Metadata = {
  title: "Tech Start",
  description:
    "Tech Start is a tech company that provides advanced training programs.",
};

export default async function LanguageLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <div dir={params.lang === 'ar' ? 'rtl' : 'ltr'} lang={params.lang}>
      <LoadingProvider>
        <LanguageProvider defaultLang={params.lang}>
          <Preloader>
            <LenisProvider>
              <div className="flex min-h-screen flex-col">
                <ConditionalNavbar />
                {children}
                <FooterWrapper />
              </div>
              <Toaster />
            </LenisProvider>
          </Preloader>
        </LanguageProvider>
        <div id="modal-root" />
      </LoadingProvider>
    </div>
  )
}
