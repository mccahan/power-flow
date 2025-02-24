"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider, useQuery, Hydrate } from "@tanstack/react-query"
import PowerFlow from "@/components/power-flow"

function PowerFlowWrapper() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["powerData"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8675/api/meters/aggregates")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 60000, // Data becomes stale after 60 seconds
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const powerData = {
    solarPower: data?.solar?.instant_power || 0,
    gridPower: data?.site?.instant_power || 0,
    homePower: data?.load?.instant_power || 0,
    batteryPower: data?.battery?.instant_power || 0,
    batteryPercentage: data?.battery?.percentage || 0,
  }

  return <PowerFlow {...powerData} />
}

export default function PowerFlowClient({ dehydratedState }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <PowerFlowWrapper />
      </Hydrate>
    </QueryClientProvider>
  )
}

