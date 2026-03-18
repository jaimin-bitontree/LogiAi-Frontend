import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    X, Package, User, Mail, MapPin, Phone, Calendar,
    FileText, Weight, Ship, Box, Globe, Hash, Layers, Bell,
    ExternalLink, Paperclip,
} from "lucide-react";  
import type { ChargeItem, PricingSchema, Shipment } from "../types/Shipment";
import { MODAL_STATUS_STYLES, STATUS_LABELS } from "../constants/shipment";
import { notifyShipmentCustomer } from "../service/shipmentService";

interface ToastState {
    type: "success" | "error";
    message: string;
}

// ── Sub-components ─────────────────────────────────────────
interface InfoRowProps {
    icon: React.ElementType;
    label: string;
    value: string | number | null | undefined;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
    if (value === null || value === undefined || value === "") return null;
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </div>
            <p className="text-sm text-gray-800 font-semibold">{value}</p>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="col-span-2 flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
    );
}

function parseAmount(value: string | null | undefined): number {
    const amount = Number((value ?? "").replace(/,/g, ""));
    return Number.isFinite(amount) ? amount : 0;
}

function getQuoteCurrency(quote: PricingSchema): string {
    return (
        quote.main_freight_charges[0]?.currency ||
        quote.origin_charges[0]?.currency ||
        quote.destination_charges[0]?.currency ||
        quote.additional_charges[0]?.currency ||
        "USD"
    );
}

function getQuoteTotal(quote: PricingSchema): number {
    const allCharges: ChargeItem[] = [
        ...quote.main_freight_charges,
        ...quote.origin_charges,
        ...quote.destination_charges,
        ...quote.additional_charges,
    ];

    return allCharges.reduce((sum, charge) => sum + parseAmount(charge.amount), 0);
}

function ChargeSection({ title, charges }: { title: string; charges: ChargeItem[] }) {
    if (charges.length === 0) return null;

    return (
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                {charges.map((charge, index) => (
                    <div
                        key={`${charge.description}-${index}`}
                        className="flex items-start justify-between gap-3 px-3 py-2 text-sm border-b border-gray-100 last:border-b-0"
                    >
                        <div>
                            <p className="text-gray-800 font-medium">{charge.description}</p>
                            {(charge.rate || charge.basis) && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {[charge.rate, charge.basis].filter(Boolean).join(" ")}
                                </p>
                            )}
                        </div>
                        <p className="text-gray-800 font-semibold whitespace-nowrap">
                            {charge.amount} {charge.currency}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────
interface ShipmentDetailModalProps {
    shipment: Shipment | null;
    onClose: () => void;
}

export default function ShipmentDetailModal({ shipment, onClose }: ShipmentDetailModalProps) {
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const toastTimerRef = useRef<number | null>(null);
    const queryClient = useQueryClient();

    const showToast = (type: ToastState["type"], message: string) => {
        setToast({ type, message });

        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }

        toastTimerRef.current = window.setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                window.clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const req = shipment?.request_data?.required;
    const opt = shipment?.request_data?.optional;
    const pricingDetails = shipment?.pricing_details ?? [];

    const formatDate = (d: string): string =>
        new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

    const selectedMessage = useMemo(
        () => shipment?.messages.find((message) => message.message_id === selectedMessageId) ?? shipment?.messages.at(-1) ?? null,
        [shipment, selectedMessageId]
    );

    const reminderMutation = useMutation({
        mutationFn: notifyShipmentCustomer,
        onSuccess: async (result) => {
            if (result.ok) {
                showToast("success", result.message || "Reminder email sent successfully.");
                await queryClient.invalidateQueries({ queryKey: ["shipments"] });
            } else {
                showToast("error", result.message || "Unable to send reminder email.");
            }
        },
        onError: (error) => {
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : "Unable to send reminder email.";
            showToast("error", message);
        },
    });

    const handleSendReminder = async () => {
        if (!shipment?.request_id) return;

        await reminderMutation.mutateAsync(shipment.request_id);
    };

    if (!shipment || !req) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-teal-700" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Request ID</p>
                            <h2 className="text-base font-bold text-gray-900 font-mono">{shipment.request_id}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${MODAL_STATUS_STYLES[shipment.status]}`}>
                            {STATUS_LABELS[shipment.status]}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                        <SectionHeader title="Customer Information" />
                        <InfoRow icon={User} label="Customer Name" value={req.customer_name} />
                        <InfoRow icon={Mail} label="Email" value={shipment.customer_email} />
                        <InfoRow icon={Phone} label="Contact Person" value={opt?.contact_person_name} />
                        <InfoRow icon={Hash} label="Street Number" value={req.customer_street_number} />
                        <InfoRow icon={Globe} label="Country" value={req.customer_country} />
                        <InfoRow icon={MapPin} label="ZIP Code" value={req.customer_zip_code} />

                        <SectionHeader title="Shipment Route" />
                        <InfoRow
                            icon={MapPin}
                            label="Origin"
                            value={`${req.origin_city}, ${req.origin_country} (${req.origin_zip_code})`}
                        />
                        <InfoRow
                            icon={MapPin}
                            label="Destination"
                            value={`${req.destination_city}, ${req.destination_country} (${req.destination_zip_code})`}
                        />

                        <SectionHeader title="Cargo Details" />
                        <InfoRow icon={Ship} label="Transport Mode" value={req.transport_mode} />
                        <InfoRow icon={Layers} label="Shipment Type" value={req.shipment_type} />
                        <InfoRow icon={Box} label="Container Type" value={req.container_type} />
                        <InfoRow icon={Box} label="Package Type" value={req.package_type} />
                        <InfoRow icon={Hash} label="Quantity" value={req.quantity} />
                        <InfoRow icon={Weight} label="Cargo Weight" value={`${req.cargo_weight} kg`} />
                        <InfoRow icon={Box} label="Volume" value={`${req.volume} m³`} />
                        <InfoRow icon={FileText} label="Incoterm" value={req.incoterm} />

                        <SectionHeader title="Reference" />
                        <InfoRow icon={Hash} label="Customer Ref" value={opt?.customer_reference} />
                        <InfoRow icon={Calendar} label="Created At" value={formatDate(shipment.created_at)} />
                        <InfoRow icon={Calendar} label="Last Updated" value={formatDate(shipment.updated_at)} />
                        <InfoRow icon={FileText} label="Subject" value={shipment.subject} />
                        <InfoRow icon={FileText} label="Intent" value={shipment.intent} />
                    </div>

                    {/* Pricing Details */}
                    <div className="mt-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Details</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {pricingDetails.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {pricingDetails.map((quote, quoteIndex) => {
                                    const currency = getQuoteCurrency(quote);
                                    const total = getQuoteTotal(quote);

                                    return (
                                        <div key={`${shipment.request_id}-quote-${quoteIndex}`} className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{quote.subject || `Quotation ${quoteIndex + 1}`}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Mode: {quote.transport_mode || "-"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Total</p>
                                                    <p className="text-lg font-bold text-teal-700">{total.toFixed(2)} {currency}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <p><span className="font-medium text-gray-700">POL:</span> {quote.shipment_details.pol || "-"}</p>
                                                <p><span className="font-medium text-gray-700">POD:</span> {quote.shipment_details.pod || "-"}</p>
                                                <p><span className="font-medium text-gray-700">Incoterm:</span> {quote.shipment_details.incoterm || "-"}</p>
                                                <p><span className="font-medium text-gray-700">Chargeable Wt:</span> {quote.shipment_details.chargeable_weight || "-"}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <ChargeSection title="Main Freight Charges" charges={quote.main_freight_charges} />
                                                <ChargeSection title="Origin Charges" charges={quote.origin_charges} />
                                                <ChargeSection title="Destination Charges" charges={quote.destination_charges} />
                                                <ChargeSection title="Additional Charges" charges={quote.additional_charges} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 pt-1">
                                                <p><span className="font-medium text-gray-700">Validity:</span> {quote.payment_terms.validity || "-"}</p>
                                                <p><span className="font-medium text-gray-700">Payment Method:</span> {quote.payment_terms.payment_method || "-"}</p>
                                                {quote.payment_terms.conditions && (
                                                    <p className="sm:col-span-2"><span className="font-medium text-gray-700">Conditions:</span> {quote.payment_terms.conditions}</p>
                                                )}
                                            </div>

                                            {quote.calculation_notes && (
                                                <div className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                                    {quote.calculation_notes}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No pricing details available</p>
                        )}
                    </div>

                    {/* Attachments */}
                    <div className="mt-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attachments</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        {shipment.attachments.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {shipment.attachments.map((att, i) => (
                                    <a
                                        key={i}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-lg transition-colors font-medium"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                        {att.filename}
                                        <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No attachments</p>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="mt-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Messages</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4">
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-2 max-h-72 overflow-y-auto">
                                {shipment.messages.map((message) => {
                                    const isSelected = message.message_id === selectedMessage?.message_id;

                                    return (
                                        <button
                                            key={message.message_id}
                                            type="button"
                                            onClick={() => setSelectedMessageId(message.message_id)}
                                            className={`w-full text-left rounded-lg px-3 py-2.5 mb-2 last:mb-0 transition-colors border ${
                                                isSelected
                                                    ? "bg-teal-50 border-teal-200"
                                                    : "bg-white border-transparent hover:bg-gray-100"
                                            }`}
                                        >
                                            <p className="text-xs font-semibold text-gray-800 truncate">{message.subject}</p>
                                            <p className="text-[11px] text-gray-500 mt-1 truncate">{message.sender_email}</p>
                                            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400 gap-2">
                                                <span className="uppercase font-medium">{message.direction}</span>
                                                <span className="truncate">{formatDate(message.received_at)}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 min-h-72">
                                {selectedMessage ? (
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                                            <h3 className="text-sm font-bold text-gray-900">{selectedMessage.subject}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{selectedMessage.sender_email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{formatDate(selectedMessage.received_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                            {selectedMessage.body}
                                        </div>

                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message Attachments</p>
                                            {selectedMessage.attachments.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {selectedMessage.attachments.map((attachment, index) => (
                                                        <a
                                                            key={`${selectedMessage.message_id}-${index}`}
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors font-medium"
                                                        >
                                                            <Paperclip className="w-4 h-4" />
                                                            {attachment.filename}
                                                            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No attachments in this message</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-sm text-gray-400">
                                        No messages available in this thread.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                    {shipment.status === "QUOTED" && (
                        <button
                            type="button"
                            onClick={handleSendReminder}
                            disabled={reminderMutation.isPending}
                            className="mr-3 px-5 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                            <Bell className="w-4 h-4" />
                            {reminderMutation.isPending ? "Sending..." : "Send Reminder"}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            {toast && (
                <div
                    className={`fixed top-5 right-5 z-[60] px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium ${
                        toast.type === "success"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}