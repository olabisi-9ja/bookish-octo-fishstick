/**
 * Generates packages/tokens/src/index.ts from design/design-tokens.json.
 *
 * design-tokens.json is itself pulled verbatim out of Figma
 * (tGWQGJbGogndVTvpVjzxYa, nodes 22:52 colour and 29:422 type). Never hand-edit
 * the generated file - change Figma, re-pull the JSON, re-run this.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const src = JSON.parse(readFileSync(resolve(root, 'design/design-tokens.json'), 'utf8'));

const RAMPS = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'];
const TONES = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '93', '95', '99', '100'];

const ramp = (name) => {
  const r = src.color[name];
  const rows = TONES.map((t) => `    t${t}: '${r[t]}',`).join('\n');
  return `  ${name}: {\n    base: '${r.base}',\n${rows}\n  },`;
};

const role = ([k, v]) => `  ${k}: '${v}',`;

const typeRow = ([k, v]) =>
  `  ${k}: { size: ${v.size}, weight: '${v.weight}', lineHeight: ${v.lineHeight} },`;

const out = `/* eslint-disable */
/**
 * GENERATED FILE - do not edit by hand.
 * Run \`npm run generate --workspace @comuta/tokens\` after changing
 * design/design-tokens.json, which is pulled verbatim from Figma
 * ${src.$source.figmaFileKey} (colour ${src.$source.colorNode}, type ${src.$source.typographyNode}).
 */

/** Material 3 tonal ramps, exactly as they sit in the Figma file. */
export const color = {
${RAMPS.map(ramp).join('\n')}
} as const;

/**
 * The only layer screens are allowed to import. A screen never reaches for a
 * raw tone - if a colour is missing here, add the role, do not inline a hex.
 */
export const semantic = {
${Object.entries(src.semantic).filter(([k]) => !k.startsWith('$')).map(role).join('\n')}

  // surfaces
  background: color.neutral.t100,
  surfaceVariant: color.neutral.t95,
  surfaceRaised: color.neutral.t100,

  // text
  onBackground: color.neutral.t10,
  onSurface: color.neutral.t10,
  onSurfaceVariant: color.neutralVariant.t40,
  onSurfaceFaint: color.neutralVariant.t50,

  // lines
  outline: color.neutralVariant.t80,
  outlineSoft: color.neutralVariant.t90,

  // states
  disabled: color.neutralVariant.t80,
  success: color.primary.t30,
} as const;

/**
 * M3 type scale in Degular. Degular is not licensed for this project, so the
 * apps load Switzer and map it here; sizes, weights and the flat ${src.typography.lineHeightRatio}x
 * line-height are Figma's, unchanged.
 */
export const fontFamily = {
  sans: '${src.typography.fontFamily.sans.substitute}',
  mono: '${src.typography.fontFamily.mono}',
} as const;

export const lineHeightRatio = ${src.typography.lineHeightRatio};
export const letterSpacing = ${src.typography.letterSpacing};

export const type = {
${Object.entries(src.typography.scale).map(typeRow).join('\n')}
} as const;

export type ColorRamp = keyof typeof color;
export type Tone = keyof (typeof color)['primary'];
export type TypeRole = keyof typeof type;
`;

mkdirSync(resolve(here, '../src'), { recursive: true });
writeFileSync(resolve(here, '../src/index.ts'), out);
console.log('wrote packages/tokens/src/index.ts');
