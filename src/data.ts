import { Agent, Notification } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "alice",
    name: "Alice",
    role: "CTI Manager",
    initials: "AL",
    avatarColor: "#6366f1",
    status: "running",
    lastActive: "2 min ago",
    hoursSaved: 48,
    tasksCompleted: 127,
    runs: [
      {
        steps: [
          { id: "s1", text: "Querying ThreatStream actors & campaigns", detail: "47 sources", durationLabel: "2.1s", complete: true },
          { id: "s2", text: "Scanning OSINT feeds", detail: "Dark Reading, CISA RSS", durationLabel: "3.4s", complete: true },
          { id: "s3", text: "Mapping actors to MITRE ATT&CK techniques", detail: "12 actors", durationLabel: "1.8s", complete: false },
          { id: "s4", text: "Cross-referencing CVE exploit chains", detail: "8 CVEs", durationLabel: "2.5s", complete: false },
          { id: "s5", text: "Assessing Priority Intelligence Requirements", detail: "3 PIRs", durationLabel: "1.2s", complete: false },
          { id: "s6", text: "Compiling recommended actions", detail: "", durationLabel: "0.9s", complete: false },
        ],
      },
    ],
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Detection Engineer",
    initials: "MA",
    avatarColor: "#f59e0b",
    status: "enabled",
    lastActive: "15 min ago",
    hoursSaved: 32,
    tasksCompleted: 89,
    runs: [
      {
        steps: [
          { id: "s1", text: "Scanning SIEM rule coverage gaps", detail: "Splunk, Sentinel", durationLabel: "3.2s", complete: true },
          { id: "s2", text: "Generating Sigma detection rules", detail: "6 new rules", durationLabel: "4.1s", complete: false },
          { id: "s3", text: "Testing rules against historical data", detail: "30-day window", durationLabel: "5.7s", complete: false },
          { id: "s4", text: "Validating false positive rates", detail: "< 2% threshold", durationLabel: "2.3s", complete: false },
          { id: "s5", text: "Publishing to detection library", detail: "", durationLabel: "1.1s", complete: false },
        ],
      },
    ],
  },
  {
    id: "nadia",
    name: "Nadia",
    role: "Threat Hunter",
    initials: "NA",
    avatarColor: "#10b981",
    status: "enabled",
    lastActive: "1 hr ago",
    hoursSaved: 56,
    tasksCompleted: 203,
    runs: [
      {
        steps: [
          { id: "s1", text: "Analyzing endpoint telemetry", detail: "CrowdStrike EDR", durationLabel: "4.5s", complete: true },
          { id: "s2", text: "Hunting for lateral movement patterns", detail: "Pass-the-hash", durationLabel: "6.2s", complete: false },
          { id: "s3", text: "Correlating network anomalies", detail: "Zeek logs", durationLabel: "3.8s", complete: false },
          { id: "s4", text: "Generating threat hunt report", detail: "", durationLabel: "2.0s", complete: false },
        ],
      },
    ],
  },
  {
    id: "victor",
    name: "Victor",
    role: "Vulnerability Manager",
    initials: "VI",
    avatarColor: "#ef4444",
    status: "disabled",
    lastActive: "3 days ago",
    hoursSaved: 24,
    tasksCompleted: 67,
    runs: [
      {
        steps: [
          { id: "s1", text: "Scanning CVE databases", detail: "NVD, VulnDB", durationLabel: "2.8s", complete: true },
          { id: "s2", text: "Prioritizing by EPSS score", detail: "Top 20", durationLabel: "1.5s", complete: false },
          { id: "s3", text: "Mapping to asset inventory", detail: "ServiceNow CMDB", durationLabel: "3.3s", complete: false },
          { id: "s4", text: "Generating patch recommendations", detail: "", durationLabel: "2.1s", complete: false },
        ],
      },
    ],
  },
  {
    id: "iris",
    name: "Iris",
    role: "Incident Responder",
    initials: "IR",
    avatarColor: "#8b5cf6",
    status: "new",
    lastActive: null,
    hoursSaved: 0,
    tasksCompleted: 0,
    runs: [
      {
        steps: [
          { id: "s1", text: "Triaging incoming alerts", detail: "Severity P1-P3", durationLabel: "1.5s", complete: false },
          { id: "s2", text: "Enriching IOCs with threat intel", detail: "VirusTotal, AbuseIPDB", durationLabel: "3.0s", complete: false },
          { id: "s3", text: "Executing containment playbook", detail: "Isolate + preserve", durationLabel: "4.2s", complete: false },
          { id: "s4", text: "Documenting incident timeline", detail: "", durationLabel: "2.5s", complete: false },
        ],
      },
    ],
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", agentId: "alice", agentName: "Alice", message: "Completed CTI report with 3 new findings", read: false, createdAt: "2 min ago" },
  { id: "n2", agentId: "marcus", agentName: "Marcus", message: "6 new detection rules ready for review", read: false, createdAt: "15 min ago" },
  { id: "n3", agentId: "nadia", agentName: "Nadia", message: "Potential lateral movement detected in subnet 10.0.3.x", read: true, createdAt: "1 hr ago" },
];
