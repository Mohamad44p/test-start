import type { Metadata } from "next";
import Preloader from "@/components/preloader/Preloader";
import { LoadingProvider } from "@/context/LoadingContext";
import LenisProvider from "@/components/lenis/ReactLenisW";
import { ConditionalNavbar } from "@/components/shared/Nav/ConditionalNavbar";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";
import FooterWrapper from "@/components/shared/Footer/FooterWrapper";
import { Montserrat , Almarai } from "next/font/google";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});


const almarai = Almarai({
  weight: '400',
  subsets: ["arabic"],
  variable: "--font-almarai",
  display: "swap",
}); 


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
    <div 
      dir={params.lang === 'ar' ? 'rtl' : 'ltr'} 
      lang={params.lang} 
      className={
        params.lang === 'en'
          ? `font-sans ${montserrat.variable}`
          : `font-serif ${almarai.variable}`
      }
    >
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
