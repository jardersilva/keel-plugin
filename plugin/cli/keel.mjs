#!/usr/bin/env node
// Gerado por build.mjs. Liga o cache de compilação antes de carregar o hook.
import m from 'node:module';
try { m.enableCompileCache?.(); } catch {}
await import('./keel-impl.mjs');
