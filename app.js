const express = require("express");
const app = express();
const morgan = require("morgan");
const Sequelize = require("sequelize");
const { snakeToPascal } = require("./utils");

morgan.token("reqbody", (req) => {
  const newObject = {};
  for (const key in req.body) {
    if (JSON.stringify(req.body[key]).length > 100) {
      newObject[key] = "Too many to print...";
      continue;
    }
    newObject[key] = req.body[key];
  }
  return JSON.stringify(newObject);
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);
app.use(express.static("./client/build"));

const {
  Country,
  CrimeIndex,
  Capital,
  CostOfLivingIndex,
  PopulationDensity,
  QualityOfLifeIndex,
  Player,
  QuestionTemplate,
} = require("./models");

const models = [
  Country,
  CrimeIndex,
  Capital,
  CostOfLivingIndex,
  PopulationDensity,
  QualityOfLifeIndex,
  Player,
  QuestionTemplate,
];

app.get("/", (req, res) => {
  Country.findAll({})
    .then(async (country) => {
      res.send(country);
    })
    .catch((err) => console.log(err));
});

app.get("/question1", async (req, res) => {
  let questionData = await QuestionTemplate.findOne({
    order: Sequelize.literal("rand()"),
    attributes: [
      "template",
      "is_first",
      "table_name",
      "model_name",
      "column_name",
      "type",
    ],
  });

  let type = questionData.type;
  let optionsData = "";

  if (type === 1) {
    optionsData = await Country.findAll({
      order: Sequelize.literal("rand()"),
      attributes: ["name"],
      limit: 4,
    });
  } else if (type === 3 || type === 4) {
    optionsData = [true, false];
  } else {
    let modelName = questionData.model_name;
    console.log(modelName);

    let columnName = questionData.column_name;
    console.log(columnName);

    for (model of models) {
      if (model.name === modelName) {
        console.log("moran");
        optionsData = await model.findAll({
          order: Sequelize.literal("rand()"),
          attributes: [columnName],
          limit: 4,
        });
      }
    }
  }

  const triviaQuestion = { question: questionData, options: optionsData };
  res.json(triviaQuestion);
});

module.exports = app;
