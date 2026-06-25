Description:
The Fate Summoning Chamber is a gacha-style collection game where Masters spend Saint Quartz to summon legendary Servants from the Fate anime series. (...) Masters can also send their Servants on timed missions to earn bonus quartz or even new Servants. Build your roster, filter your collection by class and rarity, and claim daily login bonuses to keep summoning.

Setup & Run:
Install dependencies (npm install)

Set up database and seed (npm run db)

Start server (npm run dev)

View API docs (/api-docs)

Assumptions:
330 starting quartz, 3 per single, 30 per multi (10+1)

Rarity rates: 5★ (5%), 4★ (20%), 3★ (75%)

Pre-seeded Fate servants

Unique usernames, default password

Cascade delete on Master removal

One active mission per servant

SQLite via libSQL
