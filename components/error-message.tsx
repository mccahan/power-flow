import Overlay from "./overlay"

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Overlay show={true}>
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-white">Error</h2>
        <p className="text-white/70">{message}</p>
      </div>
    </Overlay>
  )
}

