const express = require("express");

const app = express();
// necessario para identificar que o body vai vir como JSON
app.use(express.json());

// Tipos de parametros
// Route Params => identificar um recurso, editar/deletar/buscar  /courses/:id
//Query Params => paginação /filtros
// Body Params => Os objetos de inserção ou alteração

app.get("/courses", (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(["curso 1", "curso 2", "curso 3"]);
});

app.post("/courses", (request, response) => {
  const body = request.body;
  console.log(body);
  return response.json(["curso 1", "curso 2", "curso 3","curso 4"]); //
});

app.put("/courses/:id", (request, response) => {
  return response.json(["curso 6", "curso 2", "curso 3","curso 4"]); //
});

app.patch("/courses/:id", (request, response) => {
  return response.json(["curso 6", "curso 7", "curso 3","curso 4"]); //
});

app.delete("/courses/:id", (request, response) => {
  return response.json(["curso 6", "curso 7", "curso 4"]); //

})

app.listen(3333);
