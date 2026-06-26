Description:
The Fate Summoning Chamber is a gacha-style collection game where Masters spend Saint Quartz to summon legendary Servants from the Fate anime series. (...) Masters can also send their Servants on timed missions to earn bonus quartz or even new Servants. Build your roster, filter your collection by class and rarity, and claim daily login bonuses to keep summoning.
RNG rarity rates of 75% for 3-star, 20% for 4-star, and 5% for 5-star.

Setup & Run:
Install dependencies (npm install)

Set up database and seed (npm run db)

Start server (npm run dev)

View API docs (/api-docs)

API routes:
Create a Master via POST /users, read by username with GET /users?username= or by ID with GET /users/:id, update using PUT /users/:id or PATCH /users/:id, and delete with DELETE /users/:id. Claim daily login bonuses of 5 Saint Quartz via POST /users/login?username=.

Summon servants using POST /users/summon?username= for a single pull (3 quartz) or POST /users/multi-summon?username= for a 10+1 multi-pull (30 quartz). View your collection with GET /users/servants?username= and filter by class using ?class=Saber or by rarity using ?rarity=5.

Send servants on timed missions via POST /users/missions?username= with mission types including Material Gathering (30 seconds, 3-5 quartz), Scouting (1 minute, 1-3 quartz, 10% chance of 3-star servant), and Holy Grail Hunt (2 minutes, 5-10 quartz, 5% chance of 4-star servant). View missions with GET /users/missions?username= and filter by status using ?status=active. Claim completed mission rewards using POST /users/missions/claim?username=. A health check is available at GET /api/health.

Assumptions:
330 starting quartz, 3 per single, 30 per multi (10+1)

Rarity rates: 5★ (5%), 4★ (20%), 3★ (75%)

Pre-seeded Fate servants

Unique usernames, default password

Cascade delete on Master removal

One active mission per servant

SQLite via libSQL
