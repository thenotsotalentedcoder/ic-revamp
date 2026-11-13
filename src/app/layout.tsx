import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONFERENCE } from "@/lib/site";
import "./globals.css";

const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], axes: ["opsz"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });

const description = `The ${CONFERENCE.edition} ${CONFERENCE.name} (${CONFERENCE.short}), ${CONFERENCE.dates}, ${CONFERENCE.venue}, Karachi. Peer-reviewed papers, keynotes and workshops.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://iconics.neduet.edu.pk"),
  title: {
    default: `${CONFERENCE.short} · ${CONFERENCE.name}`,
    template: `%s · ${CONFERENCE.short}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: CONFERENCE.short,
    title: `${CONFERENCE.short} · ${CONFERENCE.edition} ${CONFERENCE.name}`,
    description,
    images: [{ url: "/photos/2022-stage-inaugural.jpg", width: 2048, height: 1370 }],
  },
};

export const viewport: Viewport = { themeColor: "#0b1b33" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${sourceSerif.variable} ${sourceSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {/* Route changes crossfade only the page content; header and footer stay still. */}
          <ViewTransition default="page">{children}</ViewTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
