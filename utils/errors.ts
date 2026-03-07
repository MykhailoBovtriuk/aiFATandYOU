import type { Router } from "expo-router";

export function navigateToError(router: Router, message: string, error: unknown): void {
  router.push({
    pathname: "/error" as any,
    params: {
      message,
      response: error instanceof Error ? error.message : String(error),
    },
  });
}
