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

const quests = [
  { questId: "first-steps", name: "First Steps", description: "Create your Master account", objectiveType: "create_account", targetValue: 1, rewardQuartz: 5 },
  { questId: "collector-1", name: "Collector I", description: "Own 3 unique servants", objectiveType: "unique_servants", targetValue: 3, rewardQuartz: 10 },
  { questId: "collector-2", name: "Collector II", description: "Own 7 unique servants", objectiveType: "unique_servants", targetValue: 7, rewardQuartz: 20 },
  { questId: "collector-3", name: "Collector III", description: "Own all 15 servants", objectiveType: "unique_servants", targetValue: 15, rewardQuartz: 50 },
  { questId: "summoner-1", name: "Summoner I", description: "Perform 5 summons", objectiveType: "total_summons", targetValue: 5, rewardQuartz: 10 },
  { questId: "summoner-2", name: "Summoner II", description: "Perform 20 summons", objectiveType: "total_summons", targetValue: 20, rewardQuartz: 30 },
  { questId: "mission-runner", name: "Mission Runner", description: "Complete 3 missions", objectiveType: "missions_done", targetValue: 3, rewardQuartz: 15 },
  { questId: "five-star", name: "5-Star Hunter", description: "Own a 5-star servant", objectiveType: "five_star", targetValue: 1, rewardQuartz: 25 },
  { questId: "fusion-master", name: "Fusion Master", description: "Convert 3 duplicates", objectiveType: "fusions_done", targetValue: 3, rewardQuartz: 15 },
  { questId: "trade-up", name: "Trade-Up", description: "Complete a trade-up fusion", objectiveType: "trade_up", targetValue: 1, rewardQuartz: 20 },
];

for (const q of quests) {
  await sql.execute(
    `INSERT OR IGNORE INTO quests (quest_id, name, description, objective_type, target_value, reward_quartz) VALUES (?, ?, ?, ?, ?, ?)`,
    [q.questId, q.name, q.description, q.objectiveType, q.targetValue, q.rewardQuartz]
  );
}

console.log("Servants and quests seeded!");
process.exit(0);