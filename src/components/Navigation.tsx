"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

export default function Navigation() {
  const t = useTranslations("common");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/datetime", label: t("datetime") },
    { href: "/color", label: t("color") },
  ];

  return (
    <nav
      className="bg-white dark:bg-gray-800 shadow-sm"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <ul className="flex space-x-1 md:space-x-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    block px-4 py-3 text-sm md:text-base font-medium transition-colors
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
