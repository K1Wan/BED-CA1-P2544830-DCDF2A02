/**
 * Fate Summoning Chamber — API Test Documentation
 * 
 * Run the server first: npm run dev
 * Then test each endpoint manually or use Swagger at http://localhost:3000/api-docs
 */

const BASE_URL = "http://localhost:3000";

// ==================== HEALTH CHECK ====================
// GET /api/health
// Expected: { status: "ok", game: "Fate Summoning Chamber" }

// ==================== USERS ====================
// POST /users
// Body: { "username": "TestMaster" }
// Expected: 201 — { userId, username, saintQuartz: 330 }

// GET /users?username=TestMaster
// Expected: 200 — { user_id, username, saint_quartz, totalServants }

// GET /users/:id
// Expected: 200 — { user_id, username, saint_quartz, totalServants }

// PUT /users/:id
// Body: { "username": "NewName" }
// Expected: 200 — { user_id, username: "NewName", ... }

// PATCH /users/:id
// Body: { "username": "PartialName" }
// Expected: 200 — { user_id, username: "PartialName", ... }

// DELETE /users/:id
// Expected: 200 — { message: "Master deleted successfully." }

// POST /users/login?username=TestMaster
// Expected: 200 — { message: "...", totalQuartz: 335 }

// ==================== SUMMONS ====================
// POST /users/summon?username=TestMaster
// Expected: 201 — { message, servant: { name, class, rarity, ... }, remainingQuartz }

// POST /users/multi-summon?username=TestMaster
// Expected: 201 — { message, servants: [...11 items], remainingQuartz }

// GET /users/servants?username=TestMaster
// Expected: 200 — { user, collection: [...], total }

// GET /users/servants?username=TestMaster&class=Saber
// Expected: 200 — Filtered by Saber class

// GET /users/servants?username=TestMaster&rarity=5
// Expected: 200 — Filtered by 5-star rarity

// ==================== MISSIONS ====================
// POST /users/missions?username=TestMaster
// Body: { "servantId": "saber-artoria", "missionType": "material-gathering" }
// Expected: 201 — { message, missionId, completesIn, ... }

// GET /users/missions?username=TestMaster
// Expected: 200 — { missions: [...], total }

// GET /users/missions?username=TestMaster&status=active
// Expected: 200 — Filtered by active missions

// POST /users/missions/claim?username=TestMaster
// Body: { "missionId": "mission-id-here" }
// Expected: 200 — { message, quartzEarned, totalQuartz, bonusServant }

// ==================== ERROR HANDLING ====================
// Missing username → 400 { error: "Username is required." }
// User not found → 404 { error: "Master not found." }
// Insufficient quartz → 400 { error: "Not enough Saint Quartz! Need 3." }
// Duplicate username → 409 { error: "Username already taken." }
// Invalid mission type → 400 { error: "Invalid mission type..." }
// Servant already on mission → 400 { error: "This servant is already on a mission." }
// Mission not ready → 400 { error: "Mission still in progress..." }
// Already claimed → 400 { error: "Rewards already claimed." }