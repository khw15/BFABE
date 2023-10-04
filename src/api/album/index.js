const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '0.0.1',
  register: async (server, {service, validator}) => {
    // Create an instance of the AlbumHandler class
    const albumHandler = new AlbumHandler(service, validator);

    // Register the routes defined in the 'routes' module with the albumHandler
    server.route(routes(albumHandler));
  },
};
