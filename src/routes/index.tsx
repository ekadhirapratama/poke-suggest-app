import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TypeSelect, TypeIcon, TypeBadge } from "@/components/TypeSelect";
import {
  emptyEnemy,
  emptyMy,
  scorePokemon,
  type EnemyPoke,
  type MyPoke,
  type PokeType,
} from "@/lib/pokemon";
import { Sparkles, Swords, Shield, ChevronDown } from "lucide-react";
import logoSrc from "@/assets/logo_poke-champ.webp";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PokeSuggest — Best 3 Pokémon for your battle" },
      {
        name: "description",
        content:
          "Pick your 6 Pokémon and the enemy team. PokeSuggest ranks the top 3 picks using type effectiveness.",
      },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "my_pokemon_team";

function loadTeam(): MyPoke[] {
  if (typeof window === "undefined") return Array.from({ length: 6 }, emptyMy);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Array.from({ length: 6 }, emptyMy);
    const parsed = JSON.parse(raw) as MyPoke[];
    if (!Array.isArray(parsed)) return Array.from({ length: 6 }, emptyMy);
    const fixed = parsed.slice(0, 6).map((p) => ({
      name: p.name ?? "",
      type1: (p.type1 ?? "") as MyPoke["type1"],
      type2: (p.type2 ?? "") as MyPoke["type2"],
      moves: (p.moves ?? ["", "", "", ""])
        .slice(0, 4)
        .concat(["", "", "", ""])
        .slice(0, 4) as MyPoke["moves"],
    }));
    while (fixed.length < 6) fixed.push(emptyMy());
    return fixed;
  } catch {
    return Array.from({ length: 6 }, emptyMy);
  }
}

function Index() {
  const [team, setTeam] = useState<MyPoke[]>(() => loadTeam());
  const [enemies, setEnemies] = useState<EnemyPoke[]>(() => Array.from({ length: 6 }, emptyEnemy));
  const [result, setResult] = useState<{ poke: MyPoke; score: number; idx: number }[] | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {
      /* ignore */
    }
  }, [team]);

  const updateMy = (i: number, patch: Partial<MyPoke>) =>
    setTeam((t) => t.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const updateMyMove = (i: number, mi: number, v: PokeType | "") =>
    setTeam((t) =>
      t.map((p, idx) => {
        if (idx !== i) return p;
        const moves = [...p.moves];
        moves[mi] = v;
        return { ...p, moves };
      }),
    );
  const updateEnemy = (i: number, patch: Partial<EnemyPoke>) =>
    setEnemies((t) => t.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const hasMyTeam = useMemo(() => team.some((p) => p.type1), [team]);

  const canSuggest = useMemo(
    () => enemies.every((e) => !!e.type1) && hasMyTeam,
    [enemies, hasMyTeam],
  );

  const onSuggest = () => {
    const scored = team
      .map((p, idx) => ({ poke: p, score: scorePokemon(p, enemies), idx }))
      .filter((s) => s.poke.type1) // only ranked pokemon with at least a type
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setResult(scored);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const resetEnemies = () => {
    setEnemies(Array.from({ length: 6 }, emptyEnemy));
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-background pb-24 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-charcoal bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
          <span className="text-[9px] font-black tracking-[0.25em] text-white/50 uppercase cursor-pointer hover:text-white transition-colors">
            MENU
          </span>
          <div className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="PokeSuggest"
              className="h-6 w-6 grayscale contrast-200 brightness-150"
            />
            <span className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">
              POKESUGGEST
            </span>
          </div>
          <span className="text-[9px] font-black tracking-[0.25em] text-primary uppercase">
            TELEMETRY
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-2">
        {/* Intro */}
        <div className="text-center py-8 border-b border-charcoal mb-6">
          <p className="text-[8px] tracking-[0.3em] text-primary uppercase font-black mb-2">
            HYPER-MATCHUP ENGINE
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase leading-none">
            CALIBRATE YOUR <span className="text-primary">LINEUP</span>
          </h1>
          <p className="mt-2.5 text-[11px] tracking-wider leading-relaxed text-ash max-w-xs mx-auto">
            Configure type effectiveness vectors. Identify hostile vulnerabilities. Dominate the
            arena.
          </p>
        </div>

        <div className="space-y-6">
          {/* My Team */}
          <section>
            <Collapsible defaultOpen>
              <div className="mb-4 flex items-center justify-between border-b border-charcoal pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-1 bg-primary" />
                  <CollapsibleTrigger asChild>
                    <h2 className="flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white uppercase select-none">
                      01 / COMBAT SYSTEM CONFIG
                      <ChevronDown className="h-3.5 w-3.5 text-primary transition-transform duration-200" />
                    </h2>
                  </CollapsibleTrigger>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-ash">AUTO-SAVED</span>
              </div>
              <CollapsibleContent className="space-y-4">
                {team.map((p, i) => (
                  <Card
                    key={i}
                    className="p-4 bg-charcoal border border-charcoal/40 rounded-none relative"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center bg-black border border-charcoal text-[9px] font-black text-primary font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Input
                        value={p.name}
                        onChange={(e) => updateMy(i, { name: e.target.value })}
                        placeholder={`POKÉMON #${i + 1} IDENTIFIER`}
                        className="h-8 bg-black border border-charcoal focus:border-primary text-[10px] uppercase font-bold tracking-wider rounded-none text-white placeholder:text-white/20 px-2.5 transition-colors"
                      />
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <TypeSelect
                        value={p.type1}
                        onChange={(v) => updateMy(i, { type1: v })}
                        placeholder="PRIMARY TYPE"
                      />
                      <TypeSelect
                        value={p.type2}
                        allowEmpty
                        exclude={[p.type1]}
                        onChange={(v) => updateMy(i, { type2: v })}
                        placeholder="SECONDARY TYPE"
                      />
                    </div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[8px] font-black tracking-widest text-ash uppercase">
                        MOVES DIRECTORY
                      </p>
                      <span className="text-[8px] font-mono text-white/20">MAX 4 SLOTS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {p.moves.map((m, mi) => (
                        <TypeSelect
                          key={mi}
                          value={m}
                          onChange={(v) => updateMyMove(i, mi, v)}
                          placeholder={`SLOT ${mi + 1}`}
                          allowEmpty
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </section>

          {/* Enemy Team */}
          {hasMyTeam && (
            <section className="pt-2">
              <div className="mb-4 flex items-center justify-between border-b border-charcoal pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-1 bg-destructive" />
                  <h2 className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
                    02 / TARGET HOSTILE UNITS
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-3 rounded-none border border-white/20 text-[9px] font-black tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
                  onClick={resetEnemies}
                >
                  RESET
                </Button>
              </div>
              <div className="space-y-4">
                {enemies.map((e, i) => (
                  <Card
                    key={i}
                    className="p-4 bg-charcoal border border-charcoal/40 rounded-none relative"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center bg-black border border-destructive/40 text-[9px] font-black text-destructive font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                        TARGET PROFILE
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <TypeSelect
                        value={e.type1}
                        onChange={(v) => updateEnemy(i, { type1: v })}
                        placeholder="PRIMARY TYPE"
                      />
                      <TypeSelect
                        value={e.type2}
                        allowEmpty
                        exclude={[e.type1]}
                        onChange={(v) => updateEnemy(i, { type2: v })}
                        placeholder="SECONDARY TYPE"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {hasMyTeam && (
            <div className="pt-4 space-y-4">
              <Button
                onClick={onSuggest}
                disabled={!canSuggest}
                className="w-full h-14 bg-primary text-black font-black tracking-[0.25em] text-xs uppercase rounded-none cursor-pointer hover:bg-dark-gold focus:ring-1 focus:ring-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-lg shadow-primary/10"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                INITIATE ANALYSIS
              </Button>
              {!canSuggest && (
                <p className="text-center text-[9px] tracking-widest leading-relaxed text-ash uppercase">
                  * System standby: Assign primary types to both target profiles and user config
                  cells to run diagnostics.
                </p>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <section id="result" className="space-y-4 pt-6 border-t border-charcoal">
              <div className="flex items-center gap-2">
                <div className="h-3 w-1 bg-cyan-pulse animate-pulse" />
                <h2 className="text-[10px] font-black tracking-[0.25em] text-white uppercase">
                  03 / OPTIMAL BATTLE RECOMMENDATIONS
                </h2>
              </div>
              {result.length === 0 && (
                <p className="text-xs text-ash tracking-wider uppercase font-mono py-2">
                  NO COMPATIBLE TARGET VECTOR DETECTED.
                </p>
              )}
              <div className="space-y-3">
                {result.map((r, rank) => {
                  const rankColor =
                    rank === 0
                      ? "bg-primary text-black font-black"
                      : rank === 1
                        ? "bg-steel text-black font-black"
                        : "bg-dark-iron text-white font-black border border-charcoal";
                  return (
                    <Card
                      key={r.idx}
                      className="overflow-hidden bg-charcoal border border-charcoal/40 rounded-none"
                    >
                      <div className="flex items-stretch">
                        <div
                          className={`flex w-14 items-center justify-center text-lg font-black ${rankColor} font-mono`}
                        >
                          #{rank + 1}
                        </div>
                        <div className="flex-1 p-4 bg-black/35">
                          <div className="flex items-center justify-between">
                            <p className="font-black text-xs uppercase tracking-widest text-white">
                              {r.poke.name || `CELL POKÉMON #${r.idx + 1}`}
                            </p>
                            <span className="border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[8px] font-black tracking-widest text-primary uppercase">
                              MATCH SCORE: {r.score}
                            </span>
                          </div>
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {(r.poke.type1 ? [r.poke.type1] : [])
                              .concat(r.poke.type2 ? [r.poke.type2] : [])
                              .map((t) => (
                                <TypeBadge key={t} type={t as PokeType} />
                              ))}
                          </div>
                          <div className="mt-3.5 flex items-center justify-between border-t border-charcoal/40 pt-2.5">
                            <span className="text-[8px] font-black tracking-widest text-ash uppercase">
                              ATTACK MOVES:
                            </span>
                            <div className="flex gap-1.5">
                              {r.poke.moves.filter(Boolean).length === 0 && (
                                <span className="text-[9px] font-mono text-ash/40">EMPTY</span>
                              )}
                              {r.poke.moves.filter(Boolean).map((m, i) => (
                                <TypeIcon key={i} type={m as PokeType} size={18} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
