module.exports = {
  client: {
    includes: ["./src/api/*.js"],
    service: {
      name: "yownes-graphql-backend",
      url: "http://localhost:8000/graphql",
    },
  },
};
