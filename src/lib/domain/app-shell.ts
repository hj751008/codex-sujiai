export type UserRole = "parent" | "learner";

export type AppShellState = {
  appName: string;
  roles: UserRole[];
  platformPriority: "android-first";
  reportMode: "parent-report-first";
};

export function createInitialAppShellState(): AppShellState {
  return {
    appName: "SujiMathAI",
    roles: ["parent", "learner"],
    platformPriority: "android-first",
    reportMode: "parent-report-first",
  };
}
