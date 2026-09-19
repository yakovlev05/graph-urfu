import './Loader.css'

interface Props {
  error?: string
}

export function Loader({ error }: Props) {
  return (
    <div className="loader">
      {error ? (
        <>
          <p className="loader__title">Не удалось загрузить граф</p>
          <p className="loader__error">{error}</p>
        </>
      ) : (
        <>
          <span className="loader__orb" aria-hidden />
          <p className="loader__title">Строим граф студентов…</p>
        </>
      )}
    </div>
  )
}
