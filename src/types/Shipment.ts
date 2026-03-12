export type ShipmentStatus =
  | "NEW"
  | "MISSING_INFO"
  | "PRICING_PENDING"
  | "QUOTED"
  | "CONFIRMED"
  | "CLOSED"
  | "CANCELLED";

export interface Attachment {
  filename: string;
  url: string;
}

export interface Message {
  message_id: string;
  sender_email: string;
  sender_type: "customer" | "admin" | "system";
  direction: "incoming" | "outgoing";
  subject: string;
  body: string;
  attachments: Attachment[];
  received_at: string;
}

export interface RequiredRequestData {
  customer_name: string;
  customer_street_number: string;
  customer_zip_code: string;
  customer_country: string;
  origin_zip_code: string;
  origin_city: string;
  origin_country: string;
  destination_zip_code: string;
  destination_city: string;
  destination_country: string;
  incoterm: string;
  quantity: number;
  package_type: string;
  cargo_weight: number;
  volume: number | null;
  container_type: string | null;
  transport_mode: string;
  shipment_type: string | null;
}

export interface OptionalRequestData {
  contact_person_name?: string;
  customer_reference?: string;
  description_of_goods?: string;
}

export interface RequestData {
  required: RequiredRequestData;
  optional: OptionalRequestData;
}

export interface LanguageMetadata {
  detected_language: string;
  confidence: number;
  translated_to_english: boolean;
  subject_translated_to_english: boolean;
}

export interface ValidationResult {
  is_valid: boolean;
  missing_fields: string[];
}

export interface Shipment {
  _id?: string;
  request_id: string;
  thread_id?: string;
  conversation_id?: string | null;
  last_message_id?: string;
  customer_email: string;
  subject: string;
  body?: string;
  status: ShipmentStatus;
  intent: string;
  translated_body?: string;
  translated_subject?: string;
  language_metadata?: LanguageMetadata;
  request_data: RequestData;
  validation_result?: ValidationResult;
  pricing_details: unknown[];
  attachments: Attachment[];
  messages: Message[];
  message_ids?: string[];
  final_document?: string | null;
  created_at: string;
  updated_at: string;
}