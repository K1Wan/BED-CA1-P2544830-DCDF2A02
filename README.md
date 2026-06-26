Description:
The Fate Summoning Chamber is a gacha-style collection game where Masters spend Saint Quartz to summon legendary Servants from the Fate anime series. (...) Masters can also send their Servants on timed missions to earn bonus quartz or even new Servants. Build your roster, filter your collection by class and rarity, and claim daily login bonuses to keep summoning.
RNG rarity rates of 75% for 3-star, 20% for 4-star, and 5% for 5-star.

Setup & Run:
Install dependencies (npm install)

Set up database and seed (npm run db)

Start server (npm run dev) (runs on http://localhost:3000)

View API docs (/api-docs) (on http://localhost:3000/api-docs)

Masters (Users)

Create a Master via POST /users, read by username with GET /users?username=, read by ID with GET /users/:id, update using PUT /users/:id or PATCH /users/:id, and delete with DELETE /users/:id. Claim daily login bonuses of 5 Saint Quartz via POST /users/login?username=.

Summons

Summon servants using POST /users/summon?username= for a single pull costing 3 quartz, or POST /users/multi-summon?username= for a 10+1 multi-pull costing 30 quartz. View your collection with GET /users/servants?username= and filter by class using ?class=Saber or by rarity using ?rarity=5.

Missions

Send servants on timed missions via POST /users/missions?username= with mission types including Material Gathering (30 seconds, 3-5 quartz), Scouting (1 minute, 1-3 quartz, 10% chance of 3-star servant), and Holy Grail Hunt (2 minutes, 5-10 quartz, 5% chance of 4-star servant). View missions with GET /users/missions?username= and filter by status using ?status=active. Claim completed mission rewards using POST /users/missions/claim?username=.

Other

A health check is available at GET /api/health. Interactive Swagger documentation is available at /api-docs.

Assumptions:
Each Master starts with 330 Saint Quartz. Single summons cost 3 quartz, multi-summons cost 30 quartz with a 10+1 bonus granting 11 pulls. Summon rates are 5% for 5-star, 20% for 4-star, and 75% for 3-star servants. The servant pool contains 15 pre-seeded Fate characters and is not editable via API.

Usernames must be non-empty and unique. Passwords default to "password123" if not provided. Deleting a Master cascades to remove all servants and missions. Servants can only be on one active mission at a time. Daily login bonuses grant 5 quartz with no cooldown. Mission rewards are randomized within set ranges.

The database uses local SQLite via libSQL and resets if the file is deleted. All queries use parameterized statements to prevent SQL injection. Error responses return a consistent JSON format with error message and error code fields.
