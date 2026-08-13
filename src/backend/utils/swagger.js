import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fate Summoning Chamber API",
      version: "1.0.0",
      description: "A gacha-style collection game API where Masters summon Fate servants, manage their collection, and send servants on missions.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" },
    ],
    tags: [
      { name: "Users", description: "Master account management" },
      { name: "Summons", description: "Summon servants and view collection" },
      { name: "Missions", description: "Send servants on missions for rewards" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);