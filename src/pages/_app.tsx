import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import SideNav from "../components/SideNav";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Opinion</title>
        <meta
          name="description"
          content="This is a twitter clone made by Devraj Jhala using the t3 stack"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider attribute="class">
        <div className="container mx-auto flex sm:pr-4">
          <SideNav />
          <div className="min-h-screen flex-grow items-start border-x">
            <Component {...pageProps} />
            <Analytics />
          </div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
