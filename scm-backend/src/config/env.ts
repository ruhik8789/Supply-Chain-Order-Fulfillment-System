import 'dotenv/config';
import path from 'node:path';

const port = Number(process.env.PORT ?? 3000);

const databaseFile = process.env.DATABASE_FILE ?? path.join(process.cwd(), 'data', 'scm.sqlite')

if (!Number.isFinite(port) || port <= 0) throw new Error('Invalid port');

export const env = {
    port,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseFile,
};