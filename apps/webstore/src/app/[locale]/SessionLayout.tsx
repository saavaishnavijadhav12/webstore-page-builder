"use client";
import { SessionProvider } from "next-auth/react";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={null}>
      <div className="flex min-h-[20vh] flex-col justify-between">
        <main className="flex flex-col w-full mb-10 print-style">{children}</main>
      </div>
    </SessionProvider>
  );
}
