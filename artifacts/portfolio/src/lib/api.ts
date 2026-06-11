const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok || json.ok === false) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json;
}

export const api = {
  getPortfolio: () =>
    request<{ ok: boolean; data: import("./types").PortfolioData }>(
      "/v1/public-aggregate",
    ).then((r) => r.data),

  // Experiences
  getExperiences: () =>
    request<{ ok: boolean; data: import("./types").Experience[] }>(
      "/v1/experiences",
    ).then((r) => r.data),
  createExperience: (body: Partial<import("./types").Experience>) =>
    request<{ ok: boolean; data: import("./types").Experience }>(
      "/v1/experiences",
      { method: "POST", body: JSON.stringify(body) },
    ).then((r) => r.data),
  updateExperience: (id: string, body: Partial<import("./types").Experience>) =>
    request<{ ok: boolean; data: import("./types").Experience }>(
      `/v1/experiences/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
    ).then((r) => r.data),
  deleteExperience: (id: string) =>
    request(`/v1/experiences/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () =>
    request<{ ok: boolean; data: import("./types").SkillCategory[] }>(
      "/v1/skills",
    ).then((r) => r.data),
  createSkill: (body: Partial<import("./types").SkillCategory>) =>
    request<{ ok: boolean; data: import("./types").SkillCategory }>(
      "/v1/skills",
      { method: "POST", body: JSON.stringify(body) },
    ).then((r) => r.data),
  updateSkill: (id: string, body: Partial<import("./types").SkillCategory>) =>
    request<{ ok: boolean; data: import("./types").SkillCategory }>(
      `/v1/skills/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
    ).then((r) => r.data),
  deleteSkill: (id: string) =>
    request(`/v1/skills/${id}`, { method: "DELETE" }),

  // Projects
  getProjects: () =>
    request<{ ok: boolean; data: import("./types").Project[] }>(
      "/v1/projects",
    ).then((r) => r.data),
  createProject: (body: Partial<import("./types").Project>) =>
    request<{ ok: boolean; data: import("./types").Project }>(
      "/v1/projects",
      { method: "POST", body: JSON.stringify(body) },
    ).then((r) => r.data),
  updateProject: (id: string, body: Partial<import("./types").Project>) =>
    request<{ ok: boolean; data: import("./types").Project }>(
      `/v1/projects/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
    ).then((r) => r.data),
  deleteProject: (id: string) =>
    request(`/v1/projects/${id}`, { method: "DELETE" }),

  // Socials
  getSocials: () =>
    request<{ ok: boolean; data: import("./types").SocialLink[] }>(
      "/v1/socials",
    ).then((r) => r.data),
  createSocial: (body: Partial<import("./types").SocialLink>) =>
    request<{ ok: boolean; data: import("./types").SocialLink }>(
      "/v1/socials",
      { method: "POST", body: JSON.stringify(body) },
    ).then((r) => r.data),
  updateSocial: (id: string, body: Partial<import("./types").SocialLink>) =>
    request<{ ok: boolean; data: import("./types").SocialLink }>(
      `/v1/socials/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
    ).then((r) => r.data),
  deleteSocial: (id: string) =>
    request(`/v1/socials/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () =>
    request<{ ok: boolean; data: import("./types").SettingItem[] }>(
      "/v1/settings",
    ).then((r) => r.data),
  upsertSetting: (key: string, value: unknown) =>
    request<{ ok: boolean; data: import("./types").SettingItem }>(
      "/v1/settings",
      { method: "POST", body: JSON.stringify({ key, value }) },
    ).then((r) => r.data),
  deleteSetting: (key: string) =>
    request(`/v1/settings/${key}`, { method: "DELETE" }),

  // Auth & Inbox
  loginAdmin: (body: Record<string, string>) =>
    request<{ ok: boolean; token: string }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  submitContactMessage: (body: Record<string, string>) =>
    request<{ ok: boolean; data: any }>("/v1/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getInboxMessages: () =>
    request<{ ok: boolean; data: any[] }>("/v1/inbox").then((r) => r.data),
  deleteInboxMessage: (id: string) =>
    request(`/v1/inbox/${id}`, { method: "DELETE" }),

  changeCredentials: (body: {
    currentPassword: string;
    newUsername?: string;
    newPassword?: string;
  }) =>
    request<{ ok: boolean; token: string; username: string; message: string }>(
      "/v1/auth/credentials",
      { method: "PUT", body: JSON.stringify(body) },
    ),
};

export function setAdminToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("admin_token");
}

export function hasAdminToken(): boolean {
  return !!getAdminToken();
}
