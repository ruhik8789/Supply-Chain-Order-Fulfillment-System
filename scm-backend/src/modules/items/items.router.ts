import { Router } from 'express';
import type { Request, Response } from 'express';
import { 
    createItemSchema,
    itemIdParamSchema,
    updateItemSchema,
} from './items.schema.js';
import * as itemsRepo from './items.repository.js';
import { sendAppError } from '../../errors/send-error.js';
import { StatusCodes } from 'http-status-codes';
import { parseListItemsQuery } from './items.validation.js';
import { itemsToCsv } from './items.export.js';

export const itemsRouter = Router();

// itemsRouter.get('/', (_req, res) => {
//     res.json(itemsRepo.findAllItems());
// });

itemsRouter.get('/', (req: Request, res: Response) => {
    const result = parseListItemsQuery(req.query);

    if(!result.ok) {
        sendAppError(res, result.error);
        return;
    }

    res.status(StatusCodes.OK).json(itemsRepo.findItems(result.data));
});

itemsRouter.get('/export', (req: Request, res: Response) => {
    const result = parseListItemsQuery(req.query);

    if (!result.ok) {
        sendAppError(res, result.error);
        return;
    }

    const exportQuery = { ...result.data, page: 1, pageSize: 10_000 };
    const items = itemsRepo.findItems(exportQuery);
    const csv = itemsToCsv(items.data);

    res.status(StatusCodes.OK);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=items.csv');
    res.send(csv);
});

itemsRouter.get('/:id', (req, res) => {
    const parsed = itemIdParamSchema.safeParse({ id: req.params.id });
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }

    const item = itemsRepo.findItemById(parsed.data.id);
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    res.json(item);
});

itemsRouter.post('/', (req, res) => {
    const parsed = createItemSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }

    try {
        const item = itemsRepo.createItem(parsed.data);
        res.status(201).json(item);
    } catch (err: unknown) {
        if (
            typeof err === 'object' && 
            err !== null && 
            'code' in err && 
            (err as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE' ) {
                res.status(409).json({ error: 'SKU already exists' });
                return;
            }
            throw err;
    }
});

itemsRouter.patch('/:id', (req, res) => {
    const idParsed = itemIdParamSchema.safeParse({ id: req.params.id });
    if (!idParsed.success) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    const bodyParsed = updateItemSchema.safeParse(req.body);
    if(!bodyParsed.success) {
        res.status(400).json({ error: bodyParsed.error.message });
        return;
    }

    const item = itemsRepo.updateItem(idParsed.data.id, bodyParsed.data);

    if(!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    res.json(item);
});

itemsRouter.delete('/:id', (req, res) => {
    const parsed = itemIdParamSchema.safeParse({ id: req.params.id });
    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    const ok = itemsRepo.deleteItem(parsed.data.id);
    if(!ok) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    res.status(204).send();
});