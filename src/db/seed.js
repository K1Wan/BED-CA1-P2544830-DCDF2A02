import { sql } from "./index.js";

const fateServants = [
  { servantId: "saber-artoria", name: "Artoria Pendragon", class: "Saber", rarity: 5, noblePhantasm: "Excalibur" },
  { servantId: "archer-gilgamesh", name: "Gilgamesh", class: "Archer", rarity: 5, noblePhantasm: "Enuma Elish" },
  { servantId: "lancer-cu", name: "Cú Chulainn", class: "Lancer", rarity: 3, noblePhantasm: "Gáe Bolg" },
  { servantId: "rider-medusa", name: "Medusa", class: "Rider", rarity: 3, noblePhantasm: "Bellerophon" },
  { servantId: "caster-medea", name: "Medea", class: "Caster", rarity: 3, noblePhantasm: "Rule Breaker" },
  { servantId: "assassin-sasaki", name: "Sasaki Kojirō", class: "Assassin", rarity: 3, noblePhantasm: "Tsubame Gaeshi" },
  { servantId: "berserker-hercules", name: "Heracles", class: "Berserker", rarity: 4, noblePhantasm: "Nine Lives" },
  { servantId: "saber-nero", name: "Nero Claudius", class: "Saber", rarity: 4, noblePhantasm: "Aestus Domus Aurea" },
  { servantId: "archer-emiya", name: "EMIYA", class: "Archer", rarity: 4, noblePhantasm: "Unlimited Blade Works" },
  { servantId: "caster-tamamo", name: "Tamamo-no-Mae", class: "Caster", rarity: 5, noblePhantasm: "Eightfold Blessing" },
  { servantId: "rider-iskandar", name: "Iskandar", class: "Rider", rarity: 5, noblePhantasm: "Ionioi Hetairoi" },
  { servantId: "lancer-scathach", name: "Scáthach", class: "Lancer", rarity: 5, noblePhantasm: "Gáe Bolg Alternative" },
  { servantId: "assassin-hassan", name: "Hassan of the Cursed Arm", class: "Assassin", rarity: 3, noblePhantasm: "Zabaniya" },
  { servantId: "berserker-lancelot", name: "Lancelot", class: "Berserker", rarity: 4, noblePhantasm: "Knight of Owner" },
  { servantId: "saber-mordred", name: "Mordred", class: "Saber", rarity: 5, noblePhantasm: "Clarent Blood Arthur" },
];

for (const s of fateServants) {
  await sql.execute(
    `INSERT OR IGNORE INTO servants (servant_id, name, class, rarity, noble_phantasm) VALUES (?, ?, ?, ?, ?)`,
    [s.servantId, s.name, s.class, s.rarity, s.noblePhantasm]
  );
}

console.log("Servants seeded!");
process.exit(0);