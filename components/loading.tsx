import Overlay from "./overlay"

interface LoadingProps {
  show: boolean
  isStale?: boolean
}

export default function Loading({ show, isStale = false }: LoadingProps) {
  return (
    <Overlay show={show || isStale}>
      <div className="flex flex-col items-center">
        <img
          src="loader.gif"
          alt="Loading..."
          className="w-32 h-8"
        />
        {isStale && <p className="mt-2 text-sm text-white/70">Refreshing data...</p>}
      </div>
    </Overlay>
  )
}

