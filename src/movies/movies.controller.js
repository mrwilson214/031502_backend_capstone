const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;

  const movie = await service.read(movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function read(request, response) {
  const { movie } = response.locals;
  response.json({ data: movie });
}

async function list(request, response) {
  response.json({ data: await service.list(request.query.is_showing) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists,
};
