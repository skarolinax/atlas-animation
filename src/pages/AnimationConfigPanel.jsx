import React, { useState } from "react";
import {
  Play,
  Pencil,
  Clock,
  Layers,
  Move,
  RotateCcw,
  Eye,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mt-7 mb-4 first:mt-0">
      <Icon size={15} strokeWidth={2} className="text-neutral-500" />
      <span className="text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
        {label}
      </span>
    </div>
  );
}

/*
 * Placeholder slider. Purely presentational for now — `value` drives the
 * fill + thumb position but nothing is wired to a real animation engine yet.
 * Swap the onChange handler later to push into your GSAP / Reanimated config.
 */
function Slider({ label, value, min, max, step = 1, format }) {
  const [val, setVal] = useState(value);
  const pct = ((val - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="text-[13px] text-neutral-300">{label}</span>
        <span className="text-[13px] font-medium text-neutral-100 tabular-nums">
          {format ? format(val) : val}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="cfg-slider w-full"
        style={{ "--pct": `${pct}%` }}
      />
    </div>
  );
}

function PillButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3.5 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
        "border",
        active
          ? "bg-white text-neutral-900 border-white shadow-sm"
          : "bg-neutral-800/60 text-neutral-300 border-neutral-700/60 hover:bg-neutral-700/60 hover:text-neutral-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium
                 bg-neutral-800/70 text-neutral-200 border border-neutral-700/60
                 hover:bg-neutral-700/70 hover:text-white
                 active:scale-[0.97] transition-all duration-150"
    >
      {children}
    </button>
  );
}

function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[13px] text-neutral-300">{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={[
          "relative shrink-0 w-11 h-6 p-0 border-0 rounded-full cursor-pointer transition-colors duration-200",
          on ? "bg-orange-500" : "bg-neutral-700",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-[left] duration-200",
            on ? "left-[23px]" : "left-[3px]",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

const EASINGS = [
  "linear",
  "ease in",
  "ease out",
  "ease in-out",
  "spring",
  "steps",
  "back",
  "bounce",
  "elastic",
  "circ",
  "expo",
];

const DIRECTIONS = ["normal", "reverse", "alternate", "alt-reverse"];
const TRANSFORMS = ["opacity", "x / y", "scale", "rotate", "skew"];
const FILLMODES = ["none", "forwards", "backwards", "both"];

export default function AnimationConfigPanel() {
  const [easing, setEasing] = useState("linear");
  const [direction, setDirection] = useState("normal");
  const [transforms, setTransforms] = useState(["opacity"]);
  const [fillMode, setFillMode] = useState("forwards");

  const toggleTransform = (t) =>
    setTransforms((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]
    );

  return (
    <div className="min-h-screen bg-neutral-950 flex items-start justify-center p-6 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Sora', system-ui, sans-serif; }

        .cfg-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            #f97316 0%,
            #f97316 var(--pct),
            #3f3f46 var(--pct),
            #3f3f46 100%
          );
          outline: none;
          cursor: pointer;
        }
        .cfg-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4d4d8;
          border: 2px solid #18181b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          transition: transform 0.12s ease;
        }
        .cfg-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .cfg-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4d4d8;
          border: 2px solid #18181b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="w-full max-w-[340px] bg-neutral-900/80 backdrop-blur rounded-2xl border border-neutral-800 p-6 shadow-2xl">
        {/* PLAYBACK */}
        <SectionHeader icon={Play} label="Playback" />
        <Slider
          label="speed"
          value={1}
          min={0.1}
          max={3}
          step={0.05}
          format={(v) => `${v.toFixed(2)}x`}
        />
        <Slider
          label="time scale"
          value={1}
          min={0.25}
          max={4}
          step={0.25}
          format={(v) => `${v}x`}
        />
        <div className="grid grid-cols-2 gap-2 mt-1">
          <ActionButton>play</ActionButton>
          <ActionButton>restart</ActionButton>
          <ActionButton>reverse</ActionButton>
          <ActionButton>repeat</ActionButton>
        </div>

        {/* EASING */}
        <SectionHeader icon={Pencil} label="Easing" />
        <div className="flex flex-wrap gap-2">
          {EASINGS.map((e) => (
            <PillButton
              key={e}
              active={easing === e}
              onClick={() => setEasing(e)}
            >
              {e}
            </PillButton>
          ))}
        </div>

        {/* TIMING */}
        <SectionHeader icon={Clock} label="Timing" />
        <Slider
          label="duration"
          value={1050}
          min={0}
          max={5000}
          step={50}
          format={(v) => `${v}ms`}
        />
        <Slider
          label="delay"
          value={0}
          min={0}
          max={3000}
          step={50}
          format={(v) => `${v}ms`}
        />
        <Slider label="repeat count" value={1} min={0} max={10} step={1} />
        <Slider
          label="repeat delay"
          value={0}
          min={0}
          max={3000}
          step={50}
          format={(v) => `${v}ms`}
        />
        <Slider
          label="stagger"
          value={0}
          min={0}
          max={500}
          step={10}
          format={(v) => `${v}ms`}
        />

        {/* TRANSFORM */}
        <SectionHeader icon={Move} label="Transform" />
        <div className="flex flex-wrap gap-2 mb-5">
          {TRANSFORMS.map((t) => (
            <PillButton
              key={t}
              active={transforms.includes(t)}
              onClick={() => toggleTransform(t)}
            >
              {t}
            </PillButton>
          ))}
        </div>
        <Slider
          label="translate X"
          value={0}
          min={-300}
          max={300}
          step={5}
          format={(v) => `${v}px`}
        />
        <Slider
          label="translate Y"
          value={0}
          min={-300}
          max={300}
          step={5}
          format={(v) => `${v}px`}
        />
        <Slider
          label="scale"
          value={1}
          min={0}
          max={3}
          step={0.05}
          format={(v) => v.toFixed(2)}
        />
        <Slider
          label="rotate"
          value={0}
          min={-360}
          max={360}
          step={1}
          format={(v) => `${v}°`}
        />
        <Slider
          label="opacity"
          value={1}
          min={0}
          max={1}
          step={0.05}
          format={(v) => v.toFixed(2)}
        />

        {/* SPRING (Reanimated-flavored) */}
        <SectionHeader icon={Sparkles} label="Spring physics" />
        <Slider
          label="stiffness"
          value={100}
          min={1}
          max={500}
          step={1}
        />
        <Slider label="damping" value={10} min={0} max={100} step={1} />
        <Slider
          label="mass"
          value={1}
          min={0.1}
          max={10}
          step={0.1}
          format={(v) => v.toFixed(1)}
        />
        <Slider
          label="velocity"
          value={0}
          min={-50}
          max={50}
          step={1}
        />

        {/* DIRECTION & FILL */}
        <SectionHeader icon={RotateCcw} label="Direction & fill" />
        <div className="flex flex-wrap gap-2 mb-4">
          {DIRECTIONS.map((d) => (
            <PillButton
              key={d}
              active={direction === d}
              onClick={() => setDirection(d)}
            >
              {d}
            </PillButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {FILLMODES.map((f) => (
            <PillButton
              key={f}
              active={fillMode === f}
              onClick={() => setFillMode(f)}
            >
              {f}
            </PillButton>
          ))}
        </div>

        {/* PREVIEW OPTIONS */}
        <SectionHeader icon={Eye} label="Preview" />
        <Toggle label="loop preview" defaultOn />
        <Toggle label="show timeline" defaultOn />
        <Toggle label="ghost / onion skin" />
        <Toggle label="show grid" />

        {/* OUTPUT */}
        <SectionHeader icon={Layers} label="Engine" />
        <div className="flex gap-2">
          <PillButton active onClick={() => { }}>
            GSAP
          </PillButton>
          <PillButton onClick={() => { }}>Reanimated</PillButton>
        </div>
      </div>
    </div>
  );
}