// ─── About ──────────────────────────────────────────────────────────────────
// "Watch Live" panel that streams AI agent workflow steps in real time.
// Pick an agent card and a WatchLivePanel reveals its steps one-by-one on a
// timer. Playback can be paused, resumed, sped up / slowed down, or restarted.
// A MirageJS mock server (src/server.ts) exposes agent data via REST — see the
// TODO below for what needs to be wired up.
//
// ─── API Endpoints (MirageJS) ───────────────────────────────────────────────
// GET  /api/agents          → returns Agent[] (excludes agents with status "new")
// GET  /api/agents/:id      → returns a single Agent by id
// POST /api/agents/:id/runs → starts a new run (resets steps, sets status "running")
//
// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  TODO                                                                     ║
// ║                                                                           ║
// ║  Part 1 — Implement the step streaming                                     ║
// ║  [ ] Create an interval/timeout that reveals steps one at a time          ║
// ║  [ ] Make Pause/Resume stop and start the streaming                       ║
// ║  [ ] Make the speed slider change the playback timing immediately         ║
// ║  [ ] Make Restart reset the workflow cleanly (no duplicate timers)        ║
// ║                                                                           ║
// ║  Part 2 — Fetch agents from the API                                       ║
// ║  A MirageJS mock server is running (see src/server.ts).                   ║
// ║  [ ] Replace the static AGENTS import with a fetch to GET /api/agents     ║
// ║  [ ] Load agents on mount and show a loading state while fetching         ║
// ║  [ ] On agent card click, fetch from GET /api/agents/:id                  ║
// ║  [ ] Add a "Start" button that calls POST /api/agents/:id/runs            ║
// ║  [ ] After starting, replace "Start" with Pause/Resume controls           ║
// ║  [ ] Poll GET /api/agents on an interval to keep the list fresh           ║
// ║  [ ] Handle fetch errors gracefully (show an error message)               ║
// ║  [ ] Remove the unused data.ts import once done                           ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { useState, useEffect } from "react";
import { AGENTS } from "./data";
import { Agent, RunStep } from "./types";

// ─── StepList ───────────────────────────────────────────────────────────────
function StepList({
  steps,
  visibleCount,
}: {
  steps: RunStep[];
  visibleCount: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {steps.slice(0, visibleCount).map((step, i) => {
        const isDone = i < visibleCount - 1;
        return (
          <div key={step.id} className="step-item">
            {isDone ? (
              <span className="step-icon step-icon-done">&#10003;</span>
            ) : (
              <span className="spinner spinner-sm" />
            )}
            <span className="step-text">{step.text}</span>
            {step.detail && <span className="step-detail">{step.detail}</span>}
            {isDone && step.durationLabel && (
              <span className="step-duration">{step.durationLabel}</span>
            )}
          </div>
        );
      })}

      {/* Show next upcoming step */}
      {visibleCount < steps.length && visibleCount > 0 && (
        <div className="step-item" style={{ opacity: 0.5 }}>
          <span className="spinner spinner-sm" />
          <span className="step-text">{steps[visibleCount].text}...</span>
        </div>
      )}
    </div>
  );
}

// ─── SpeedControl ───────────────────────────────────────────────────────────
function SpeedControl({
  speed,
  onSpeedChange,
}: {
  speed: number;
  onSpeedChange: (speed: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-muted" style={{ whiteSpace: "nowrap" }}>
        Speed: {speed}ms
      </label>
      <input
        type="range"
        className="slider"
        min={300}
        max={3000}
        step={100}
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
      />
      <span className="text-xs text-muted" style={{ whiteSpace: "nowrap" }}>
        {speed < 800 ? "Fast" : speed < 1500 ? "Normal" : "Slow"}
      </span>
    </div>
  );
}

// ─── WatchLivePanel ─────────────────────────────────────────────────────────
function WatchLivePanel({ agent }: { agent: Agent }) {
  const steps = agent.runs[0]?.steps ?? [];
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [isComplete, setIsComplete] = useState(false);

  // TODO: implement the interval that advances visibleCount
  // and respects isPaused, speed, and restart.

  function handleRestart() {
    // TODO: implement restart
  }

  const progressPercent =
    steps.length > 0 ? Math.round((visibleCount / steps.length) * 100) : 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div
            className="avatar"
            style={{ backgroundColor: agent.avatarColor }}
          >
            {agent.initials}
          </div>
          <div>
            <h2 className="text-sm font-bold">{agent.name}</h2>
            <p className="text-xs text-muted">
              {isComplete
                ? "Workflow complete"
                : isPaused
                  ? "Paused"
                  : "Streaming..."}
            </p>
          </div>
          {!isComplete && (
            <span
              className="spinner"
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          )}
        </div>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${isPaused ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsPaused(!isPaused)}
            disabled={isComplete}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleRestart}>
            Restart
          </button>
        </div>
      </div>

      {/* Speed control */}
      <div style={{ marginTop: 12 }}>
        <SpeedControl speed={speed} onSpeedChange={setSpeed} />
      </div>

      {/* Progress */}
      <div style={{ marginTop: 16 }}>
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>
            Step {Math.min(visibleCount, steps.length)} of {steps.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step list */}
      <div style={{ marginTop: 16, maxHeight: 400, overflow: "auto" }}>
        {visibleCount === 0 && !isComplete ? (
          <p className="text-xs text-muted">Starting workflow...</p>
        ) : (
          <StepList steps={steps} visibleCount={visibleCount} />
        )}
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="alert-success alert mt-4">
          {agent.name} completed the workflow. All {steps.length} steps done.
        </div>
      )}
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="app-container">
      <div className="app-header">
        <div>
          <h1>Watch Live</h1>
          <p className="subtitle">
            Stream AI agent workflow steps in real time
          </p>
        </div>
      </div>

      {/* Agent selector */}
      <div className="grid grid-cols-4 mb-4">
        {AGENTS.filter((a) => a.status !== "new").map((agent) => (
          <div
            key={agent.id}
            className="card"
            style={{
              cursor: "pointer",
              borderColor:
                selectedAgent?.id === agent.id
                  ? "var(--semantic-indigo)"
                  : undefined,
            }}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="card-header">
              <div
                className="avatar"
                style={{ backgroundColor: agent.avatarColor }}
              >
                {agent.initials}
              </div>
              <div>
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-xs text-muted">{agent.role}</div>
              </div>
              <span className={`badge badge-${agent.status} ml-auto`}>
                {agent.status}
              </span>
            </div>
            <div className="text-xs text-muted mt-2">
              {agent.runs[0]?.steps.length ?? 0} workflow steps
            </div>
          </div>
        ))}
      </div>

      {selectedAgent ? (
        <WatchLivePanel key={selectedAgent.id} agent={selectedAgent} />
      ) : (
        <div className="panel" style={{ textAlign: "center", padding: 48 }}>
          <p className="text-muted">Select an agent to watch live</p>
        </div>
      )}
    </div>
  );
}
