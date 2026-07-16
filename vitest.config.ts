/// <reference types="vitest/config" />
import type { Plugin, PluginOption } from 'vite';
import { getViteConfig, passthroughImageService } from 'astro/config';

// passthroughImageService: <Image> renderuje się w testach bez przetwarzania.
const resolveConfig = getViteConfig(
  { test: { environment: 'node' } },
  { image: { service: passthroughImageService() } },
);

// Workaround dla withastro/astro#15847: pluginy `astro:server` i
// `astro:server-client` uruchamiają w hooku `configureServer` import modułów
// Astro przez Vite ModuleRunner (ESM), co dla zależności CJS (tu: wewnętrzny
// probe workerd z @astrojs/cloudflare/@cloudflare/vite-plugin) kończy się
// błędem startowym „exports is not defined". Te pluginy służą wyłącznie
// prawdziwemu serwerowi deweloperskiemu Astro i są zbędne (i szkodliwe) dla
// Vitest, więc je odfiltrowujemy z konfiguracji zwracanej do Vitest.
const SERVER_ONLY_PLUGIN_NAMES = new Set(['astro:server', 'astro:server-client']);
const SERVER_ONLY_PLUGIN_PREFIXES = ['vite-plugin-cloudflare:', '@astrojs/cloudflare:'];

function isServerOnlyPlugin(plugin: Plugin | undefined): boolean {
  const name = plugin?.name;
  if (!name) return false;
  if (SERVER_ONLY_PLUGIN_NAMES.has(name)) return true;
  return SERVER_ONLY_PLUGIN_PREFIXES.some((prefix) => name.startsWith(prefix));
}

function stripServerOnlyPlugins(plugins: PluginOption[]): PluginOption[] {
  return plugins
    .map((plugin) => {
      if (Array.isArray(plugin)) return stripServerOnlyPlugins(plugin);
      return plugin;
    })
    .filter((plugin) => {
      if (Array.isArray(plugin)) return true;
      return !isServerOnlyPlugin(plugin as Plugin | undefined);
    });
}

export default async (env: { mode: string; command: 'build' | 'serve' }) => {
  const config = await resolveConfig(env);
  config.plugins = stripServerOnlyPlugins(config.plugins ?? []);
  return config;
};
