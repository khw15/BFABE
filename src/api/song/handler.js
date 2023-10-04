const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async handleRequestWithErrorHandling(handler, req, h) {
    try {
      const result = await handler.call(this, req, h);
      return result;
    } catch (error) {
      return this.handleError(error, h);
    }
  }

  handleError(error, h) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: 'Sorry, there was a server error.',
    });
    response.code(500);
    console.error(error);
    return response;
  }

  async postSongHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      this._validator.validateSongPayload(req.payload);
      const {title, year, genre, performer, duration, albumId} = req.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Song successfully added',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    }, req, h);
  }

  async getSongsHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (_req, _h) => {
      const songs = await this._service.getSongs();

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }, req, h);
  }

  async getSongByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, _h) => {
      const {id} = req.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    }, req, h);
  }

  async updateSongByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, _h) => {
      this._validator.validateSongPayload(req.payload);
      const {id} = req.params;

      await this._service.updateSongById(id, req.payload);

      return {
        status: 'success',
        message: 'Song successfully updated',
      };
    }, req, h);
  }

  async deleteSongByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, _h) => {
      const {id} = req.params;

      await this._service.deleteSongById(id);
      return {
        status: 'success',
        message: 'Song successfully deleted',
      };
    }, req, h);
  }
}

module.exports = SongHandler;
