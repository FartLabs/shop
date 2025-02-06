"use client";
import { SWRConfig } from "swr";

// https://swr.vercel.app/docs/with-nextjs#client-components
export const SWRProvider = ({ children }: { children: any }) => {
  return <SWRConfig>{children}</SWRConfig>;
};
