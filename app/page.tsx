import LoginPage from "@/components/Login";
import TableDesign from "@/components/table/Table";
import { useTranslations } from "next-intl";

export default function Home() {
  return (
    <main>
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 dark:text-gray-100`}
      >
        All Services
      </h2>
      <TableDesign />
    </main>
  );
}
