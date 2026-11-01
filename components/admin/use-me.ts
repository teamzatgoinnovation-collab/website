"use client";

import { useQuery } from "@tanstack/react-query";

import { api, ApiError, type Me } from "@/lib/admin/api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api<{ user: Me }>("/auth/me")).user,
    retry: false,
    staleTime: 60_000,
  });
}

export const can = (me: Me | undefined, perm: string) => Boolean(me?.permissions.includes(perm));
export const isUnauthorized = (e: unknown) => e instanceof ApiError && e.status === 401;
