import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TypeSelect, TypeIcon, TypeBadge } from "@/components/TypeSelect";
import {
  emptyEnemy, emptyMy, scorePokemon,
  type EnemyPoke, type MyPoke, type PokeType,
} from "@/lib/pokemon";
import { Sparkles, Swords, Shield, ChevronDown } from "lucide-react";
import logoSrc from "@/assets/logo_poke-champ.webp";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PokeSuggest — Best 3 Pokémon for your battle" },
      { name: "description", content: "Pick your 6 Pokémon and the enemy team. PokeSuggest ranks the top 3 picks using type effectiveness." },
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
      moves: (p.moves ?? ["","","",""]).slice(0,4).concat(["","","",""]).slice(0,4) as MyPoke["moves"],
    }));
    while (fixed.length < 6) fixed.push(emptyMy());
    return fixed;
  } catch {
    return Array.from({ length: 6 }, emptyMy);
  }
}

function Index() {
  const [team, setTeam] = useState<MyPoke[]>(() => loadTeam());
  const [enemies, setEnemies] = useState<EnemyPoke[]>(() =>
    Array.from({ length: 6 }, emptyEnemy)
  );
  const [result, setResult] = useState<{ poke: MyPoke; score: number; idx: number }[] | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(team)); } catch { /* ignore */ }
  }, [team]);

  const updateMy = (i: number, patch: Partial<MyPoke>) =>
    setTeam((t) => t.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const updateMyMove = (i: number, mi: number, v: PokeType | "") =>
    setTeam((t) => t.map((p, idx) => {
      if (idx !== i) return p;
      const moves = [...p.moves]; moves[mi] = v; return { ...p, moves };
    }));
  const updateEnemy = (i: number, patch: Partial<EnemyPoke>) =>
    setEnemies((t) => t.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const hasMyTeam = useMemo(() => team.some((p) => p.type1), [team]);

  const canSuggest = useMemo(
    () => enemies.every((e) => !!e.type1) && hasMyTeam,
    [enemies, hasMyTeam]
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

  const resetEnemies = () => { setEnemies(Array.from({ length: 6 }, emptyEnemy)); setResult(null); };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-3">
          <img src={logoSrc} alt="PokeSuggest" className="h-9 w-9" />
          <div>
            <h1 className="text-base font-bold leading-none">PokeSuggest</h1>
            <p className="text-[11px] text-muted-foreground">Top 3 picks by type matchup</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-6 px-4 pt-4">
        {/* My Team */}
        <section>
          <Collapsible defaultOpen>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CollapsibleTrigger asChild>
                <h2 className="flex cursor-pointer items-center gap-1 text-sm font-semibold uppercase tracking-wide">
                  My Team
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </h2>
              </CollapsibleTrigger>
              <span className="text-xs text-muted-foreground">(auto-saved)</span>
            </div>
            <CollapsibleContent>
              <div className="space-y-3">
                {team.map((p, i) => (
                  <Card key={i} className="p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                        {i + 1}
                      </span>
                      <Input
                        value={p.name}
                        onChange={(e) => updateMy(i, { name: e.target.value })}
                        placeholder={`Pokémon #${i + 1} name`}
                        className="h-9"
                      />
                    </div>
                    <div className="mb-2 grid grid-cols-2 gap-2">
                      <TypeSelect value={p.type1} onChange={(v) => updateMy(i, { type1: v })} placeholder="Type 1" />
                      <TypeSelect
                        value={p.type2} allowEmpty
                        exclude={[p.type1]}
                        onChange={(v) => updateMy(i, { type2: v })}
                        placeholder="Type 2"
                      />
                    </div>
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">Moves</p>
                    <div className="grid grid-cols-2 gap-2">
                      {p.moves.map((m, mi) => (
                        <TypeSelect
                          key={mi}
                          value={m}
                          onChange={(v) => updateMyMove(i, mi, v)}
                          placeholder={`Move ${mi + 1}`}
                          allowEmpty
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {hasMyTeam && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="h-4 w-4 text-destructive" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">Enemy Team</h2>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetEnemies}>
                Clear
              </Button>
            </div>
            <div className="space-y-3">
              {enemies.map((e, i) => (
                <Card key={i} className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-[11px] font-bold text-destructive">
                      {i + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">Enemy #{i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <TypeSelect value={e.type1} onChange={(v) => updateEnemy(i, { type1: v })} placeholder="Type 1" />
                    <TypeSelect
                      value={e.type2} allowEmpty exclude={[e.type1]}
                      onChange={(v) => updateEnemy(i, { type2: v })}
                      placeholder="Type 2 (opt)"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {hasMyTeam && (
          <>
            <Button
              onClick={onSuggest}
              disabled={!canSuggest}
              size="lg"
              className="w-full h-12 text-base font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Suggestion
            </Button>
            {!canSuggest && (
              <p className="-mt-3 text-center text-xs text-muted-foreground">
                Set at least Type 1 for every enemy and one of your Pokémon.
              </p>
            )}
          </>
        )}

        {/* Result */}
        {result && (
          <section id="result" className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Top 3 Recommendations
            </h2>
            {result.length === 0 && (
              <p className="text-sm text-muted-foreground">No eligible Pokémon in your team.</p>
            )}
            {result.map((r, rank) => (
              <Card key={r.idx} className="overflow-hidden">
                <div className="flex items-stretch">
                  <div
                    className="flex w-14 items-center justify-center text-2xl font-black text-white"
                    style={{
                      backgroundColor:
                        rank === 0 ? "#f4d23c" : rank === 1 ? "#9099a1" : "#d97746",
                    }}
                  >
                    #{rank + 1}
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {r.poke.name || `Pokémon #${r.idx + 1}`}
                      </p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        Score {r.score}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(r.poke.type1 ? [r.poke.type1] : []).concat(
                        r.poke.type2 ? [r.poke.type2] : []
                      ).map((t) => (
                        <TypeBadge key={t} type={t as PokeType} />
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[11px] text-muted-foreground mr-1">Moves:</span>
                      {r.poke.moves.filter(Boolean).length === 0 && (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                      {r.poke.moves.filter(Boolean).map((m, i) => (
                        <TypeIcon key={i} type={m as PokeType} size={20} />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
