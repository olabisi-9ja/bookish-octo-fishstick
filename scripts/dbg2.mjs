import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { Window } from 'happy-dom';
const win = new Window({ url: 'http://localhost/' });
globalThis.window = win; globalThis.document = win.document;
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true });
globalThis.localStorage = win.localStorage;
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { useComuta } = await server.ssrLoadModule('/src/store/index.ts');
const { AppRoutes } = await server.ssrLoadModule('/src/App.tsx');
const { MemoryRouter } = await import('react-router-dom');
const { createElement } = React;

function Probe() {
  const s = useComuta((x) => x.session);
  return createElement('div', null, `probe:${s ? s.userId : 'none'}`);
}

console.log('pre-state:', useComuta.getState().session?.userId);
console.log('render1:', renderToString(createElement(Probe)));
useComuta.getState().setSession(null);
console.log('post-state:', useComuta.getState().session);
console.log('render2:', renderToString(createElement(Probe)));
console.log('app render:', renderToString(createElement(MemoryRouter, { initialEntries: ['/app/rider/home'] }, createElement(AppRoutes))).slice(0, 120));
await server.close();
