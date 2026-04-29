export type AgentStatus = "new" | "disabled" | "enabled" | "running";

export interface RunStep {
  id: string;
  text: string;
  detail: string;
  durationLabel: string;
  complete: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  status: AgentStatus;
  lastActive: string | null;
  hoursSaved: number;
  tasksCompleted: number;
  runs: { steps: RunStep[] }[];
}

export interface Notification {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  read: boolean;
  createdAt: string;
}
