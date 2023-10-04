require('dotenv').config();
const Hapi = require('@hapi/hapi');

// Songs
const songs = require('./api/song');
const SongService = require('./services/SongService');
const SongValidator = require('./validator/song');

// Albums
const albums = require('./api/album');
const AlbumService = require('./services/AlbumService');
const AlbumValidator = require('./validator/album');

// Get ClientError
const ClientError = require('./exceptions/ClientError');

async function initServer() {
  // Create instances of services
  const songService = new SongService();
  const albumService = new AlbumService();

  // Create a Hapi server instance
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'], // Allow requests from any origin (update as needed)
      },
    },
  });

  // Global response handler for ClientError
  server.ext('onPreResponse', (req, h) => {
    const {response} = req;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });

  // Register plugins for songs and albums
  await server.register([
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
  ]);

  // Start the server
  await server.start();
  console.info(`Server running in ${server.info.uri}`);
}

initServer();
