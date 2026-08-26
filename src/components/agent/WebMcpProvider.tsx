'use client';

import { useEffect } from 'react';

/**
 * WebMCP Provider — exposes Rentyco's key tools to AI agents via the browser.
 * Uses the WebMCP API (navigator.modelContext.registerTool) when available.
 * @see https://webmachinelearning.github.io/webmcp/
 */
export default function WebMcpProvider() {
  useEffect(() => {
    // WebMCP is not yet widely supported — bail if unavailable.
    if (
      typeof navigator === 'undefined' ||
      !('modelContext' in navigator) ||
      typeof (navigator as ModelContextNavigator).modelContext?.registerTool !== 'function'
    ) {
      return;
    }

    const mc = (navigator as ModelContextNavigator).modelContext;
    const controller = new AbortController();
    const { signal } = controller;

    mc.registerTool(
      {
        name: 'search_rentals',
        description:
          'Search rental listings on Rentyco by city. Returns a URL to browse available properties.',
        inputSchema: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description:
                'City slug (e.g. "bogota", "medellin", "cali", "barranquilla")',
            },
            neighborhood: {
              type: 'string',
              description: 'Optional neighborhood / zona slug within the city',
            },
          },
          required: ['city'],
        },
        execute: async (input: Record<string, string>) => {
          const base = `/${input.city}/arriendos`;
          const url = input.neighborhood
            ? `${base}/zona/${input.neighborhood}`
            : base;
          window.location.href = url;
          return { navigatedTo: url };
        },
      },
      { signal },
    );

    mc.registerTool(
      {
        name: 'get_renty_score_info',
        description:
          'Navigate to the Renty Score page to learn about alternative tenant credit scoring without a guarantor (codeudor).',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => {
          window.location.href = '/renty-score';
          return { navigatedTo: '/renty-score' };
        },
      },
      { signal },
    );

    mc.registerTool(
      {
        name: 'navigate_to',
        description:
          'Navigate to a specific page on Rentyco. Useful pages: /como-funciona, /inquilinos, /arrendadores, /blog, /nosotros, /renty-score.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'The path to navigate to (e.g. "/como-funciona")',
            },
          },
          required: ['path'],
        },
        execute: async (input: Record<string, string>) => {
          const path = input.path ?? '/';
          window.location.href = path;
          return { navigatedTo: path };
        },
      },
      { signal },
    );

    return () => controller.abort();
  }, []);

  return null;
}

/* ---------- Type augmentation for the WebMCP API ---------- */
interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, string>) => Promise<unknown>;
}

interface ModelContext {
  registerTool: (tool: McpTool, options?: { signal?: AbortSignal }) => void;
}

interface ModelContextNavigator extends Navigator {
  modelContext: ModelContext;
}
