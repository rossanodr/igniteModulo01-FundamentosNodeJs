const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

/**
 *cpf -  string;
 *name - string;
 * id - uuid
 * statement []
 * */

const customers = [];
//Middleware
function verifyIfAccountCPFExists(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(404).json({ error: "Customer not found" });
  }
  request.customer = customer;
  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement", verifyIfAccountCPFExists, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.post("/deposit", verifyIfAccountCPFExists, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);
  return res.status(201).send();
});

app.post("/withdraw", verifyIfAccountCPFExists, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.get("/statement/date", verifyIfAccountCPFExists, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.json(statement);
});

app.put("/account", verifyIfAccountCPFExists, (req, res) => {
  const { name } = req.body;
  const { customer } = req;
  customer.name = name;

  return res.status(201).send();
});

app.get("/account", verifyIfAccountCPFExists, (req, res) => {
  const { customer } = req;
  return res.json(customer);
});

app.delete("/account", verifyIfAccountCPFExists, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);
  return res.status(200).json(customers);
});

app.get("/balance", verifyIfAccountCPFExists, (req, res) => {
  const { customer } = req;
  const balance = getBalance(customer.statement);
  return res.json(balance);
});
app.listen(3333);
