import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Point = {
  x: number
  y: number
}

const MOVE_COOLDOWN_MS = 90
const DANGER_RADIUS_PX = 120
const DATE_PATH = '/date'

function ValentineGame() {
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const noButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastMoveTimeRef = useRef(0)

  const [isDatePage, setIsDatePage] = useState(
    () => window.location.pathname === DATE_PATH,
  )
  const [dodgeCount, setDodgeCount] = useState(0)
  const [noPos, setNoPos] = useState<Point>({ x: 240, y: 68 })

  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        duration: `${6 + Math.random() * 7}s`,
        delay: `${Math.random() * 4}s`,
        scale: 0.7 + Math.random() * 0.8,
      })),
    [],
  )

  const confettiHearts = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        drift: `${-28 + Math.random() * 56}px`,
        duration: `${1.7 + Math.random() * 1.6}s`,
        delay: `${Math.random() * 1.3}s`,
        size: `${0.75 + Math.random() * 1}rem`,
        rotation: `${-60 + Math.random() * 120}deg`,
      })),
    [],
  )

  useEffect(() => {
    const syncPath = () => {
      setIsDatePage(window.location.pathname === DATE_PATH)
    }

    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  const navigateToDate = () => {
    window.history.pushState({}, '', DATE_PATH)
    setIsDatePage(true)
  }

  const navigateHome = () => {
    window.history.pushState({}, '', '/game')
    setIsDatePage(false)
  }

  const moveNoButton = (pointer?: Point) => {
    const arenaEl = arenaRef.current
    const buttonEl = noButtonRef.current
    if (!arenaEl || !buttonEl) return

    const now = Date.now()
    if (now - lastMoveTimeRef.current < MOVE_COOLDOWN_MS) return
    lastMoveTimeRef.current = now

    const margin = 10
    const width = buttonEl.offsetWidth
    const height = buttonEl.offsetHeight
    const maxX = arenaEl.clientWidth - width - margin
    const maxY = arenaEl.clientHeight - height - margin
    if (maxX <= margin || maxY <= margin) return

    let bestX = margin + Math.random() * (maxX - margin)
    let bestY = margin + Math.random() * (maxY - margin)

    if (pointer) {
      let bestDistance = -1
      for (let i = 0; i < 18; i += 1) {
        const candidateX = margin + Math.random() * (maxX - margin)
        const candidateY = margin + Math.random() * (maxY - margin)
        const cx = candidateX + width / 2
        const cy = candidateY + height / 2
        const distance = Math.hypot(pointer.x - cx, pointer.y - cy)

        if (distance > bestDistance) {
          bestDistance = distance
          bestX = candidateX
          bestY = candidateY
        }
      }
    }

    setNoPos({ x: bestX, y: bestY })
    setDodgeCount((prev) => prev + 1)
  }

  const handleArenaPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const arenaEl = arenaRef.current
    const buttonEl = noButtonRef.current
    if (!arenaEl || !buttonEl) return

    const arenaRect = arenaEl.getBoundingClientRect()
    const buttonCenterX = noPos.x + buttonEl.offsetWidth / 2
    const buttonCenterY = noPos.y + buttonEl.offsetHeight / 2
    const pointerX = event.clientX - arenaRect.left
    const pointerY = event.clientY - arenaRect.top

    const distance = Math.hypot(pointerX - buttonCenterX, pointerY - buttonCenterY)
    if (distance < DANGER_RADIUS_PX) {
      moveNoButton({ x: pointerX, y: pointerY })
    }
  }

  if (isDatePage) {
    return (
      <main className="valentine-page date-page">
        <div className="glow glow-1" />
        <div className="glow glow-2" />

        <section className="card date-card">
          <p className="eyebrow">yayi!!!</p>
          <h1>Yayi, it&apos;s a date!</h1>
          <p className="subtitle">
            You just made this the sweetest day ever. Pink-heart confetti mode:
            activated.
          </p>
          <button className="yes-button date-again" onClick={navigateHome}>
            Ask me again
          </button>
        </section>

        <div className="confetti-field" aria-hidden="true">
          {confettiHearts.map((heart) => (
            <span
              key={heart.id}
              className="confetti-heart"
              style={
                {
                  left: heart.left,
                  fontSize: heart.size,
                  animationDuration: heart.duration,
                  animationDelay: heart.delay,
                  '--drift-x': heart.drift,
                  '--rot': heart.rotation,
                } as CSSProperties
              }
            >
              ❤
            </span>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="valentine-page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <section className="card">
        <p className="eyebrow">for my favorite human</p>
        <h1>Will you be my Valentine?</h1>
        <p className="subtitle">
          I prepared a tiny corner of the internet just for this question.
        </p>

        <div
          ref={arenaRef}
          className="button-arena"
          onPointerMove={handleArenaPointerMove}
        >
          <button className="yes-button" onClick={navigateToDate}>
            Yes, absolutely
          </button>

          <button
            ref={noButtonRef}
            className="no-button"
            style={{ left: `${noPos.x}px`, top: `${noPos.y}px` }}
            onPointerEnter={(event) => {
              const arenaRect = arenaRef.current?.getBoundingClientRect()
              if (!arenaRect) return
              moveNoButton({
                x: event.clientX - arenaRect.left,
                y: event.clientY - arenaRect.top,
              })
            }}
            onPointerDown={(event) => {
              event.preventDefault()
              const arenaRect = arenaRef.current?.getBoundingClientRect()
              if (!arenaRect) return
              moveNoButton({
                x: event.clientX - arenaRect.left,
                y: event.clientY - arenaRect.top,
              })
            }}
            onTouchStart={(event) => {
              event.preventDefault()
              const touch = event.touches[0]
              const arenaRect = arenaRef.current?.getBoundingClientRect()
              if (!touch || !arenaRect) return
              moveNoButton({
                x: touch.clientX - arenaRect.left,
                y: touch.clientY - arenaRect.top,
              })
            }}
          >
            No way
          </button>
        </div>

        <p className="dodge-counter">No button dodged: {dodgeCount}</p>
      </section>

      <div className="heart-field" aria-hidden="true">
        {floatingHearts.map((heart) => (
          <span
            key={heart.id}
            className="heart"
            style={
              {
                left: heart.left,
                animationDuration: heart.duration,
                animationDelay: heart.delay,
                '--heart-scale': `${heart.scale}`,
              } as CSSProperties
            }
          >
            ❤
          </span>
        ))}
      </div>
    </main>
  )
}

export default ValentineGame
