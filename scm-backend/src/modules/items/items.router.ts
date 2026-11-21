import { Router } from 'express';
import type { Request, Response } from 'express';
import { 
    createItemSchema,
    itemIdParamSchema,
    updateItemSchema,
} from './items.schema.js';
import * as itemsRepo from './items.repository.js';

export const itemsRouter = Router();

itemsRouter.get('/', (_req, res) => {
    res.json(itemsRepo.findAllItems());
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