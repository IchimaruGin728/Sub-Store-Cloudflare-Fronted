const API_BASE = import.meta.env.PUBLIC_API_URL || "";

interface ApiResponse<T = unknown> {
	ok: boolean;
	items?: T[];
	item?: T;
	[key: string]: unknown;
}

interface ParseStats {
	input_lines: number;
	parsed: number;
	skipped: number;
	deduped: number;
}

interface ParseResponse {
	nodes: unknown[];
	stats: ParseStats;
	warnings: string[];
}

interface ExportResponse {
	target: string;
	content: string;
	stats: ParseStats;
	warnings: string[];
}

interface RefreshResponse {
	ok: boolean;
	refreshed: number;
	failed: number;
	results: unknown[];
	refreshed_at: string;
}

interface WorkerStatus {
	ok: boolean;
	backend: string;
	adapter: string;
	runtime: string;
	version: string;
	upstream?: { backend: string };
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE}${path}`;
	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "Unknown error");
		throw new Error(`API error ${response.status}: ${text}`);
	}

	return response.json();
}

export function createApiClient(token: string) {
	const headers = { Authorization: `Bearer ${token}` };

	return {
		getSubs: () => apiFetch<ApiResponse>("/api/subs", { headers }),
		getSub: (name: string) => apiFetch<ApiResponse>(`/api/sub/${name}`, { headers }),
		createSub: (data: Record<string, unknown>) =>
			apiFetch<ApiResponse>("/api/subs", {
				method: "POST",
				headers,
				body: JSON.stringify(data),
			}),
		updateSub: (name: string, data: Record<string, unknown>) =>
			apiFetch<ApiResponse>(`/api/sub/${name}`, {
				method: "PATCH",
				headers,
				body: JSON.stringify(data),
			}),
		deleteSub: (name: string) =>
			apiFetch<ApiResponse>(`/api/sub/${name}`, { method: "DELETE", headers }),

		getCollections: () => apiFetch<ApiResponse>("/api/collections", { headers }),
		getCollection: (name: string) => apiFetch<ApiResponse>(`/api/collection/${name}`, { headers }),
		createCollection: (data: Record<string, unknown>) =>
			apiFetch<ApiResponse>("/api/collections", {
				method: "POST",
				headers,
				body: JSON.stringify(data),
			}),
		deleteCollection: (name: string) =>
			apiFetch<ApiResponse>(`/api/collection/${name}`, { method: "DELETE", headers }),

		getFiles: () => apiFetch<ApiResponse>("/api/files", { headers }),
		getArtifacts: () => apiFetch<ApiResponse>("/api/artifacts", { headers }),

		parse: (content: string) =>
			apiFetch<ParseResponse>("/api/native/parse", {
				method: "POST",
				headers,
				body: JSON.stringify({ content }),
			}),
		exportData: (content: string, target?: string, processors?: Record<string, unknown>) =>
			apiFetch<ExportResponse>("/api/native/export", {
				method: "POST",
				headers,
				body: JSON.stringify({ content, target, processors }),
			}),
		process: (content: string, processors: Record<string, unknown>) =>
			apiFetch<ParseResponse>("/api/native/process", {
				method: "POST",
				headers,
				body: JSON.stringify({ content, processors }),
			}),
		fetchRemote: (url: string) =>
			apiFetch<ParseResponse>("/api/native/fetch/parse", {
				method: "POST",
				headers,
				body: JSON.stringify({ url }),
			}),

		refresh: (data?: Record<string, unknown>) =>
			apiFetch<RefreshResponse>("/api/refresh", {
				method: "POST",
				headers,
				body: JSON.stringify(data || {}),
			}),
		refreshSub: (name: string) =>
			apiFetch<RefreshResponse>(`/api/sub/${name}/refresh`, { method: "POST", headers }),
		refreshCollection: (name: string) =>
			apiFetch<RefreshResponse>(`/api/collection/${name}/refresh`, {
				method: "POST",
				headers,
			}),

		getBackup: () => apiFetch<ApiResponse>("/api/backup", { headers }),
		restoreBackup: (data: Record<string, unknown>) =>
			apiFetch<ApiResponse>("/api/backup/restore", {
				method: "POST",
				headers,
				body: JSON.stringify(data),
			}),

		getSettings: () => apiFetch<ApiResponse>("/api/settings", { headers }),
		getTokens: () => apiFetch<ApiResponse>("/api/tokens", { headers }),

		getEnv: () => apiFetch<ApiResponse>("/api/utils/env", { headers }),
		getStatus: () => apiFetch<WorkerStatus>("/api/utils/worker-status", { headers }),
		getCapabilities: () => apiFetch<ApiResponse>("/api/native/capabilities", { headers }),
	};
}
