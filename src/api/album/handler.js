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
      message: 'Sorry, there was a server error.',
    });
    response.code(500);
    console.error(error);
    return response;
  }

  async postAlbumHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, h) => {
      try {
        this._validator.validateAlbumPayload(req.payload);
        const {name, year} = req.payload;
        const albumId = await this._service.addAlbum({
          name,
          year,
        });

        const response = h.response({
          status: 'success',
          message: 'Album successfully added',
          data: {
            albumId,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        // Handle the error and return an appropriate error response
        return {
          status: 'error',
          message: 'Failed to add album',
          error: error.message,
        };
      }
    }, req, h);
  }

  async getAlbumByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, _h) => {
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
    return this.handleRequestWithErrorHandling(async (req, _h) => {
      this._validator.validateAlbumPayload(req.payload);
      const {id} = req.params;

      await this._service.updateAlbumById(id, req.payload);
      return {
        status: 'success',
        message: 'Album successfully updated',
      };
    }, req, h);
  }

  async deleteAlbumByIdHandler(req, h) {
    return this.handleRequestWithErrorHandling(async (req, _h) => {
      const {id} = req.params;
      await this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album successfully deleted',
      };
    }, req, h);
  }
}

module.exports = AlbumHandler;
