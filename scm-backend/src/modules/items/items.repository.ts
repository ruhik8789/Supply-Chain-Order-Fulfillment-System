import { db } from '../../db/database.js';
import type { CreateItemInput, Item, ItemListResult, ListItemsQuery, UpdateItemInput } from './items.types.js';

const listStmt = db.prepare(`
  SELECT id, sku, name, description, quantity, unit_price, created_at, updated_at
  FROM items
  ORDER BY id DESC
`);

const byIdStmt = db.prepare(`
  SELECT id, sku, name, description, quantity, unit_price, created_at, updated_at
  FROM items
  WHERE id = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO items (sku, name, description, quantity, unit_price)
  VALUES (@sku, @name, @description, @quantity, @unit_price)
  RETURNING id, sku, name, description, quantity, unit_price, created_at, updated_at
`);

const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');

export function findAllItems(): Item[] {
    return listStmt.all() as Item[];
}

export function findItemById(id: number): Item | undefined {
    return byIdStmt.get(id) as Item | undefined;
}

export function createItem(input: CreateItemInput): Item {
    return insertStmt.get({
        sku: input.sku,
        name: input.name,
        description: input.description ?? null,
        quantity: input.quantity ?? 0,
        unit_price: input.unit_price ?? 0,
    }) as Item;
}

export function updateItem(id: number, input: UpdateItemInput): Item | undefined {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
        sets.push('name = ?');
        values.push(input.name);
    }
    if (input.description !== undefined) {
        sets.push('description = ?');
        values.push(input.description);
    }
    if (input.quantity !== undefined) {
        sets.push('quantity = ?');
        values.push(input.quantity);
    }
    if (input.unit_price !== undefined) {
        sets.push('unit_price = ?');
        values.push(input.unit_price);
    }

    if (sets.length === 0) {
        return findItemById(id);
    }

    sets.push("updated_at = datetime('now')");
    values.push(id);

    const sql = `UPDATE items SET ${sets.join(', ')} WHERE id = ?`;
    const result = db.prepare(sql).run(...values);

    if (result.changes === 0) {
        return undefined;
    }
    return findItemById(id);
}

export function deleteItem(id: number): boolean {
    const result = deleteStmt.run(id);
    return result.changes > 0;
}

const SORT_COLUMNS: Record<ListItemsQuery['sortBy'], string> = {
    id: 'id',
    name: 'name',
    sku: 'sku',
    created_at: 'created_at',
    quantity: 'quantity',
};

export function findItems(query: ListItemsQuery): ItemListResult {
    const where: string[] = [];
    const params: unknown[] = [];

    if (query.sku) {
        where.push('sku = ?');
        params.push(query.sku);
    }
    if (query.nameContains) {
        where.push('name LIKE ?');
        params.push(`%${query.nameContains}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRow = db
        .prepare(`SELECT COUNT(*) AS total FROM items ${whereSql}`)
        .get(...params) as { total: number };

    const total = countRow.total;
    const offset = (query.page - 1) * query.pageSize;
    const sortCol = SORT_COLUMNS[query.sortBy];
    const sortDir = query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const data = db
        .prepare(
            `SELECT id, sku, name, description, quantity, unit_price, created_at, updated_at
       FROM items ${whereSql}
       ORDER BY ${sortCol} ${sortDir}
       LIMIT ? OFFSET ?`,
        )
        .all(...params, query.pageSize, offset) as Item[];

    return {
        data,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / query.pageSize),
        },
    };
}