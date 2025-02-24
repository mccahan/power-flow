import { cn } from "@/lib/utils"

interface FetchIndicatorProps {
  isFetching: boolean
  requestTime?: number
}

export default function FetchIndicator({ isFetching, requestTime }: FetchIndicatorProps) {
  const showTime = isFetching && requestTime && requestTime > 5

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2">
      <div
        className={cn(
          "h-3 w-3 rounded-full transition-all duration-300",
          isFetching ? "bg-red-500 opacity-100" : "bg-transparent opacity-0",
        )}
      />
      {showTime && <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">{requestTime.toFixed(1)}s</span>}
    </div>
  )
}

