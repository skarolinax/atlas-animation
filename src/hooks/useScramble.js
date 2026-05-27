import { useEffect, useMemo, useRef } from 'react'

/**
 * Returns { ref, trigger } — attach `ref` to the text node you want to scramble
 * and call `trigger` (e.g. from onMouseEnter / onFocus) to run the effect.
 *
 * Scramble characters are pulled only from the original label (whitespace and
 * duplicates removed), so the shuffled state never shows glyphs that aren't in
 * the word itself.
 */
export function useScramble(label) {
    const ref = useRef(null)
    const rafRef = useRef(null)

    // Pool of glyphs to scramble through = unique non-space characters from the label.
    const pool = useMemo(() => {
        const unique = Array.from(new Set(label.replace(/\s/g, "").split("")))
        return unique.length > 0 ? unique : [label[0] || "?"]
    }, [label])

    useEffect(() => () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }, [])

    const trigger = () => {
        const node = ref.current
        if (!node) return
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        // Lock the element's width on first run so swapping letters doesn't
        // resize the surrounding button (proportional fonts have different
        // glyph widths).
        if (!node.dataset.scrambleLocked) {
            const rect = node.getBoundingClientRect()
            node.style.display = "inline-block"
            node.style.minWidth = `${Math.ceil(rect.width)}px`
            node.style.textAlign = node.style.textAlign || "left"
            node.style.whiteSpace = "nowrap"
            node.dataset.scrambleLocked = "1"
        }

        const target = label
        const queue = []
        for (let i = 0; i < target.length; i++) {
            const from = node.textContent[i] || ""
            const to = target[i]
            const start = Math.floor(Math.random() * 5)
            const end = start + 6 + Math.floor(Math.random() * 7)
            queue.push({ from, to, start, end, char: "" })
        }

        // FRAME_SKIP advances the scramble clock every N animation frames so
        // each glyph dwells slightly longer without being twitchy.
        const FRAME_SKIP = 2
        let raw = 0
        let frame = 0
        const tick = () => {
            let out = ""
            let complete = 0
            for (let i = 0; i < queue.length; i++) {
                const q = queue[i]
                if (frame >= q.end) {
                    complete++
                    out += q.to
                } else if (frame >= q.start) {
                    if (!q.char || Math.random() < 0.22) {
                        q.char = q.to === " "
                            ? " "
                            : pool[Math.floor(Math.random() * pool.length)]
                    }
                    out += q.char
                } else {
                    out += q.from
                }
            }
            node.textContent = out
            if (complete === queue.length) {
                rafRef.current = null
            } else {
                raw++
                if (raw % FRAME_SKIP === 0) frame++
                rafRef.current = requestAnimationFrame(tick)
            }
        }
        tick()
    }

    return { ref, trigger }
}
