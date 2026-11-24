import { Item } from "./items.types";

const COLUMNS = [
    'id', 'sku', 'name', 'description', 'quantity', 'unit_price', 'created_at', 'updated_at'
] as const;

function escapeCsv(value: string | number | null): string {
    const text = value === null ? '' : String(value);
    if(/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
}

export function itemsToCsv(items: Item[]): string {
    const header = COLUMNS.join(',');
    const rows = items.map((item) => COLUMNS.map((col) => escapeCsv(item[col])).join(','));

    return [header, ...rows].join('\n');
}