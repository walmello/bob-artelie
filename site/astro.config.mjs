// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });

// https://astro.build/config
export default defineConfig({});
