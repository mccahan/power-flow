"use client"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import PowerFlow from "@/components/power-flow"
import Loading from "@/components/loading"
import ErrorMessage from "@/components/error-message"
import FetchIndicator from "@/components/fetch-indicator"
import { useState, useEffect } from "react"

const queryClient = new QueryClient()

function PowerFlowWrapper() {
  const [requestTime, setRequestTime] = useState<number | null>(null)

  const { data, error, isError, isLoading, isFetching, isStale } = useQuery({
    queryKey: ["powerData"],
    queryFn: async () => {
      const startTime = performance.now()
      try {
        const response = await fetch("PYPOWERWALL_URL" + "/csv/v2")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvText = await response.text()
        const values = csvText.trim().split(",")

        if (values.length < 6) {
          throw new Error("Invalid response: insufficient data")
        }

        const [grid, home, solar, battery, rawBatteryPercentage, gridStatus] = values

        const adjustPower = (power: number) => {
          if (power > 0 && power < 50) return 100
          if (power < 0 && power > -50) return -100
          return power
        }

        let batteryPercentage = Number.parseFloat(rawBatteryPercentage)
        batteryPercentage = 100 * (batteryPercentage - 5) / 95

        const statuses = {
          gridPower: adjustPower(Number.parseFloat(grid)),
          homePower: adjustPower(Number.parseFloat(home)),
          solarPower: adjustPower(Number.parseFloat(solar)),
          batteryPower: adjustPower(Number.parseFloat(battery)),
          batteryPercentage,
          gridStatus: gridStatus.trim(),
        }

        return statuses
      } catch (e) {
        console.error("Error fetching power data:", e)
        throw e
      } finally {
        const endTime = performance.now()
        setRequestTime((endTime - startTime) / 1000) // Convert to seconds
      }
    },
    refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 60000, // Data becomes stale after 60 seconds
  })

  useEffect(() => {
    if (!isFetching) {
      setRequestTime(null)
    }
  }, [isFetching])

  return (
    <>
      <Loading show={isLoading} isStale={isStale} />
      {isError && <ErrorMessage message={error.message} />}
      {data && (
        <div
          className={`absolute inset-0 flex items-center justify-center max-w-[600px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full ${
            new URLSearchParams(window.location.search).has("padded") ? "p-5" : ""
          }`}
        >
          <PowerFlow {...data} />
        </div>
      )}
      <FetchIndicator isFetching={isFetching} requestTime={requestTime} />
    </>
  )
}

export default function PowerFlowDemo() {
  return (
    <QueryClientProvider client={queryClient}>
      <PowerFlowWrapper />
    </QueryClientProvider>
  )
}

