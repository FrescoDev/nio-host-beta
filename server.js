const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bunyanMiddleware = require("bunyan-middleware");
const helmet = require("helmet");
const bunyan = require("bunyan");
const { $PORT } = process.env;
const contracts = require("./contracts");
const R = require("ramda");

const logger = bunyan.createLogger({
  name: "question-gateway",
  serializers: bunyan.stdSerializers,
  streams: [
    {
      level: "info",
      stream: process.stdout
    }
  ]
});

const requestLogger = bunyanMiddleware({
  logger,
  headerName: "server",
  obscureHeaders: ["authorization"],
  level: process.env.NODE_ENV === "development" ? "debug" : "info"
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.shutdown = () => {};

const isGET = R.pathEq(["spec", "with_method"], "GET");
const mapToGet = ({ spec, logic }) => app.get(spec.at_path, logic);
const mapToPost = ({ spec, logic }) => app.post(spec.at_path, logic);

const mapContractsToRoutes = R.map(R.ifElse(isGET, mapToGet, mapToPost));

mapContractsToRoutes(contracts);

app.listen($PORT, () => {
  logger.info("Server running on port %d", $PORT);
});

module.exports = app;
