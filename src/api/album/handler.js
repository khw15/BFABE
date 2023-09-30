const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async handleResponse(h, status, message, data = null, statusCode = 500) {
    const response = h.response({
      status,
      message,
      data,
    });
    response.code(statusCode);
    return response;
  }

  async postAlbumHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { name, year } = req.payload;
      const albumId = await this._service.addAlbum({ name, year });

      return this.handleResponse(h, "success", "Lagu berhasil ditambahkan", { albumId }, 201);
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async getAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      return this.handleResponse(h, "success", null, { album });
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async updateAlbumByIdHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { id } = req.params;
      await this._service.updateAlbumById(id, req.payload);

      return this.handleResponse(h, "success", "Album berhasil perbarui");
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async deleteAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return this.handleResponse(h, "success", "Album berhasil dihapus");
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }
}

module.exports = AlbumHandler;
