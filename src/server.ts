import { createServer, Model, Response } from "miragejs";

// The data below is identical to what was in data.ts — the candidate should
// fetch it from these endpoints instead of importing it directly.

export function makeServer() {
  return createServer({
    models: {
      agent: Model,
    },

    seeds(server) {
      server.db.loadData({
        agents: [
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
        ],
      });
    },

    routes() {
      this.namespace = "api";

      // GET /api/agents — returns all agents (excluding "new" status)
      this.get("/agents", (schema) => {
        return schema.db.agents.filter((a: { status: string }) => a.status !== "new");
      });

      // GET /api/agents/:id — returns a single agent by id
      this.get("/agents/:id", (schema, request) => {
        return schema.db.agents.find(request.params.id);
      });

      // POST /api/agents/:id/runs — start a new run for the agent
      // Sets status to "running", resets all steps to incomplete, and returns the agent.
      this.post("/agents/:id/runs", (schema, request) => {
        const agent = schema.db.agents.find(request.params.id);
        if (!agent) return new Response(404, {}, { error: "Agent not found" });

        const resetRuns = agent.runs.map((run: { steps: { complete: boolean }[] }) => ({
          ...run,
          steps: run.steps.map((step: { complete: boolean }) => ({ ...step, complete: false })),
        }));

        schema.db.agents.update(agent.id, {
          status: "running",
          lastActive: "just now",
          runs: resetRuns,
        });

        return schema.db.agents.find(agent.id);
      });
    },
  });
}
