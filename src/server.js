/**
 Name: Nadya Mumtazah
 finished: 18-03-2023 19:55
**/

const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Listening on port ${server.info.uri}`);
};

init();
