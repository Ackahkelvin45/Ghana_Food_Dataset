"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ReactNode, useState } from "react"
import {HeroUIProvider} from '@heroui/react'


const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return (
    <SessionProvider>
        <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      </HeroUIProvider>
    </SessionProvider>
  )
}