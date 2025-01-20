"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/darkModeIcon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";

export function SidebarLayout({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "ltr" | "rtl";
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar dir={dir} />}
      <div className="w-full">
        <main>
          {!isLoginPage && (
            <div className="border-b flex items-center justify-between py-3 px-4 sticky left-0 top-0 w-full bg-white dark:bg-[#09090B] z-10">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
            </div>
          )}
          <div className="p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
