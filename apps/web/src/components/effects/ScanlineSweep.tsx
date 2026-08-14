/** Linha de scan animada, estilo terminal/CRT, varrendo a tela — puramente decorativo. */
export function ScanlineSweep() {
  return (
    <div className="scanline-sweep-band animate-scanline motion-reduce:hidden" aria-hidden="true">
      <div className="scanline-sweep-line" />
    </div>
  )
}
