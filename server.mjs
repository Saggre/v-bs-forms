import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/data', (req, res) => {
  res.json({
    component: "WorkShift\/Wizard",
    props: {
      errors: {
        foo: "bar"
      }
    }
  });
});

server.use(router);
server.listen(8080, () => {
  console.log('JSON Server is running');
});
