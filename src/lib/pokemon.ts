import normal from "@/assets/types/normal.png";
import fighting from "@/assets/types/fighting.png";
import flying from "@/assets/types/flying.png";
import poison from "@/assets/types/poison.png";
import ground from "@/assets/types/ground.png";
import rock from "@/assets/types/rock.png";
import bug from "@/assets/types/bug.png";
import ghost from "@/assets/types/ghost.png";
import steel from "@/assets/types/steel.png";
import fire from "@/assets/types/fire.png";
import water from "@/assets/types/water.png";
import grass from "@/assets/types/grass.png";
import electric from "@/assets/types/electric.png";
import psychic from "@/assets/types/psychic.png";
import ice from "@/assets/types/ice.png";
import dragon from "@/assets/types/dragon.png";
import dark from "@/assets/types/dark.png";
import fairy from "@/assets/types/fairy.png";

export const TYPES = [
  "Normal","Fighting","Flying","Poison","Ground","Rock","Bug","Ghost",
  "Steel","Fire","Water","Grass","Electric","Psychic","Ice","Dragon","Dark","Fairy",
] as const;
export type PokeType = typeof TYPES[number];

export const TYPE_ICON: Record<PokeType, string> = {
  Normal: normal, Fighting: fighting, Flying: flying, Poison: poison,
  Ground: ground, Rock: rock, Bug: bug, Ghost: ghost,
  Steel: steel, Fire: fire, Water: water, Grass: grass,
  Electric: electric, Psychic: psychic, Ice: ice, Dragon: dragon,
  Dark: dark, Fairy: fairy,
};

export const TYPE_COLOR: Record<PokeType, string> = {
  Normal: "#9099a1", Fighting: "#ce4069", Flying: "#8fa8dd", Poison: "#ab6ac8",
  Ground: "#d97746", Rock: "#c5b78c", Bug: "#90c12c", Ghost: "#5269ac",
  Steel: "#5a8ea1", Fire: "#ff9d55", Water: "#5090d6", Grass: "#63bb5b",
  Electric: "#f4d23c", Psychic: "#f97076", Ice: "#74cec0", Dragon: "#0b6dc3",
  Dark: "#5a5366", Fairy: "#ec8fe6",
};

// What each defending type is weak to (takes super effective damage from these attacking types)
export const POKEMON_WEAKNESS: Record<PokeType, PokeType[]> = {
  Normal: ["Fighting"],
  Fighting: ["Fairy","Flying","Psychic"],
  Flying: ["Electric","Ice","Rock"],
  Poison: ["Ground","Psychic"],
  Ground: ["Grass","Ice","Water"],
  Rock: ["Grass","Ground","Steel","Fighting","Water"],
  Bug: ["Fire","Flying","Rock"],
  Ghost: ["Dark","Ghost"],
  Steel: ["Fighting","Fire","Ground"],
  Fire: ["Ground","Rock","Water"],
  Water: ["Electric","Grass"],
  Grass: ["Fire","Flying","Ice","Bug","Poison"],
  Electric: ["Ground"],
  Psychic: ["Bug","Dark","Ghost"],
  Ice: ["Fighting","Fire","Rock","Steel"],
  Dragon: ["Dragon","Fairy","Ice"],
  Dark: ["Bug","Fairy","Fighting"],
  Fairy: ["Poison","Steel"],
};

export interface MyPoke {
  name: string;
  type1: PokeType | "";
  type2: PokeType | "";
  moves: (PokeType | "")[]; // length 4
}
export interface EnemyPoke {
  type1: PokeType | "";
  type2: PokeType | "";
}

export const emptyMy = (): MyPoke => ({ name: "", type1: "", type2: "", moves: ["","","",""] });
export const emptyEnemy = (): EnemyPoke => ({ type1: "", type2: "" });

// Score a single user pokemon against the entire enemy team
export function scorePokemon(mine: MyPoke, enemies: EnemyPoke[]): number {
  let score = 0;
  for (const e of enemies) {
    const eTypes = [e.type1, e.type2].filter(Boolean) as PokeType[];
    if (eTypes.length === 0) continue;
    // Offensive: each move that is in any enemy type's weakness list
    for (const m of mine.moves) {
      if (!m) continue;
      for (const et of eTypes) {
        if (POKEMON_WEAKNESS[et].includes(m as PokeType)) score += 1;
      }
    }
    // Defensive: each of mine's types that is weak to any enemy type
    const myTypes = [mine.type1, mine.type2].filter(Boolean) as PokeType[];
    for (const mt of myTypes) {
      for (const et of eTypes) {
        if (POKEMON_WEAKNESS[mt].includes(et)) score -= 1;
      }
    }
  }
  return score;
}
