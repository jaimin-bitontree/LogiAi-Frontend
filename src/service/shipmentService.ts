import { api } from "./api";
import type { Attachment, Message } from "../types/Shipment";
import type { Shipment } from "../types/Shipment";

interface NotifyShipmentApiResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  detail?: string;
}

function deriveFilenameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const fromPath = parsed.pathname.split("/").filter(Boolean).at(-1);
    if (fromPath) return decodeURIComponent(fromPath);
  } catch {
    const fromPath = url.split("?")[0]?.split("/").filter(Boolean).at(-1);
    if (fromPath) return decodeURIComponent(fromPath);
  }

  return "attachment";
}

function normalizeAttachments(input: unknown): Attachment[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index): Attachment | null => {
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) return null;
        return { filename: deriveFilenameFromUrl(url), url };
      }

      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const maybeUrl =
        record.url ??
        record.file_url ??
        record.attachment_url ??
        record.download_url ??
        record.href ??
        record.path;
      const maybeFilename =
        record.filename ??
        record.file_name ??
        record.name ??
        record.original_filename;

      if (typeof maybeUrl !== "string" || !maybeUrl.trim()) return null;

      const url = maybeUrl.trim();
      const filename =
        typeof maybeFilename === "string" && maybeFilename.trim()
          ? maybeFilename.trim()
          : `${deriveFilenameFromUrl(url) || `attachment-${index + 1}`}`;

      return { filename, url };
    })
    .filter((attachment): attachment is Attachment => attachment !== null);
}

function normalizeMessage(input: unknown): Message {
  const record = (input && typeof input === "object"
    ? input
    : {}) as Record<string, unknown>;

  const rawAttachments =
    record.attachments ??
    record.files ??
    record.file_urls ??
    record.attachment_urls ??
    record.attachment;

  return {
    message_id:
      typeof record.message_id === "string"
        ? record.message_id
        : `msg-${Math.random().toString(36).slice(2, 10)}`,
    sender_email:
      typeof record.sender_email === "string"
        ? record.sender_email
        : "unknown@unknown.com",
    sender_type:
      record.sender_type === "customer" ||
      record.sender_type === "admin" ||
      record.sender_type === "system"
        ? record.sender_type
        : "system",
    direction: record.direction === "outgoing" ? "outgoing" : "incoming",
    subject:
      typeof record.subject === "string" && record.subject.trim()
        ? record.subject
        : "(No subject)",
    body: typeof record.body === "string" ? record.body : "",
    attachments: normalizeAttachments(rawAttachments),
    received_at:
      typeof record.received_at === "string"
        ? record.received_at
        : typeof record.created_at === "string"
          ? record.created_at
          : new Date(0).toISOString(),
  };
}

function isNewerTimestamp(a: string, b: string): boolean {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();

  if (Number.isNaN(aTime) && Number.isNaN(bTime)) return false;
  if (Number.isNaN(aTime)) return false;
  if (Number.isNaN(bTime)) return true;

  return aTime > bTime;
}

function mergeDuplicateMessages(messages: Message[]): Message[] {
  const byId = new Map<string, Message>();

  for (const message of messages) {
    const existing = byId.get(message.message_id);

    if (!existing) {
      byId.set(message.message_id, message);
      continue;
    }

    const attachments =
      message.attachments.length >= existing.attachments.length
        ? message.attachments
        : existing.attachments;

    const preferred = isNewerTimestamp(message.received_at, existing.received_at)
      ? message
      : existing;

    byId.set(message.message_id, {
      ...preferred,
      attachments,
      body:
        preferred.body.trim().length > 0
          ? preferred.body
          : existing.body || message.body,
    });
  }

  return [...byId.values()].sort((a, b) => {
    const aTime = new Date(a.received_at).getTime();
    const bTime = new Date(b.received_at).getTime();

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;

    return aTime - bTime;
  });
}

function normalizeShipment(input: unknown): Shipment {
  const record = (input && typeof input === "object"
    ? input
    : {}) as Record<string, unknown>;

  const rawMessages =
    record.messages ?? record.message_logs ?? record.message_log ?? [];

  return {
    ...(record as unknown as Shipment),
    attachments: normalizeAttachments(record.attachments ?? record.files),
    messages: Array.isArray(rawMessages)
      ? mergeDuplicateMessages(
          rawMessages.map((message) => normalizeMessage(message))
        )
      : [],
  };
}

export const getShipments = async (): Promise<Shipment[]> => {
  // Fetch all shipments from the API without pagination limits
  // Pass limit=1000 to request up to 1000 records in a single response
  const response = await api.get<unknown>("/shipments", {
    params: {
      limit: 1000,  // Request up to 1000 records
    },
  });
  const payload = Array.isArray(response.data) ? response.data : [];

  return payload.map((shipment) => normalizeShipment(shipment));
};

export const notifyShipmentCustomer = async (
  requestId: string
): Promise<{ ok: boolean; message: string }> => {
  const response = await api.post<NotifyShipmentApiResponse>(
    `/shipments/${encodeURIComponent(requestId)}/notify`
  );

  const payload = response.data;
  const ok =
    typeof payload?.success === "boolean"
      ? payload.success
      : typeof payload?.status === "boolean"
        ? payload.status
        : true;

  const message =
    payload?.message ??
    payload?.detail ??
    (ok
      ? "Reminder email sent to customer."
      : "Failed to send reminder email.");

  return { ok, message };
};