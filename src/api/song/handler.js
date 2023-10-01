const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  handleResponse(h, status, message, data = null, statusCode = 500) {
    const response = h.response({
      status,
      message,
      data,
    });
    response.code(statusCode);
    return response;
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { title, year, genre, performer, duration, albumId } = req.payload;
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

      return this.handleResponse(h, "success", "Lagu berhasil ditambahkan", { songId }, 201);
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async getSongsHandler(req, h) {
    try {
      const songs = await this._service.getSongs();
      return this.handleResponse(h, "success", null, { songs });
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async getSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);
      return this.handleResponse(h, "success", null, { song });
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async updateSongByIdHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { id } = req.params;
      await this._service.updateSongById(id, req.payload);

      return this.handleResponse(h, "success", "Lagu berhasil diperbarui");
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }

  async deleteSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      return this.handleResponse(h, "success", "Lagu berhasil dihapus");
    } catch (error) {
      if (error instanceof ClientError) {
        return this.handleResponse(h, "fail", error.message, null, error.statusCode);
      }

      console.error(error);
      return this.handleResponse(h, "error", "Maaf, terjadi kegagalan pada server kami.");
    }
  }
}

module.exports = SongHandler;
