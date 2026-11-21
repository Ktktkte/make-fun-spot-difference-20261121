// Lantern Lane — spot the difference game, entry program.
//
// Hands the game in: copies game/ and screenshots/ from this repository
// into the grader's output directory and writes dossier.json with the
// kit's buildDossier. Runs twice in a fresh container; both runs must
// write the same bytes, so this program does nothing time- or random-based.
//
// Paths are resolved from this file's own directory, never from the working
// directory: the grader runs `node /bot/main.ts` from a directory of its
// own choosing, so a bare relative path would not find the game.
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const here = dirname(fileURLToPath(import.meta.url));
const gameDir = join(here, "game");
const shotsDir = join(here, "screenshots");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

if (!existsSync(join(gameDir, "index.html"))) {
  throw new Error("game/index.html is missing — nothing to hand in");
}
if (!existsSync(shotsDir)) {
  throw new Error("screenshots/ is missing — the gate needs 3 or 4 screenshots");
}
const shotCount = readdirSync(shotsDir).filter((f) => !f.startsWith(".")).length;
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`screenshots/ holds ${shotCount} files — the gate needs 3 or 4`);
}

// The output directory is a mount in the grader: create it if it is
// missing, copy files into it, and never delete it or its parent.
mkdirSync(outDir, { recursive: true });
cpSync(gameDir, join(outDir, "game"), { recursive: true });
cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
