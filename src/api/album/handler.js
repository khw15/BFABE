const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
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
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    response.code(500);
    console.error(error);
    return response;
  }

  async postAlbumHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      this._validator.validateAlbumPayload(req.payload);
      const {name, year} = req.payload;

      const albumId = await this._service.addAlbum({
        name,
        year,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    }, req, h);
  }

  async getAlbumByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      const {id} = req.params;
      const album = await this._service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    }, req, h);
  }

  async updateAlbumByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      this._validator.validateAlbumPayload(req.payload);
      const {id} = req.params;

      await this._service.updateAlbumById(id, req.payload);
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    }, req, h);
  }

  async deleteAlbumByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      const {id} = req.params;
      await this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    }, req, h);
  }
}

module.exports = AlbumHandler;
