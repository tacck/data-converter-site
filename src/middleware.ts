import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // すべてのパスにマッチするが、以下を除外
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
