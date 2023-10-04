const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const {mapDbToModel} = require('../utils/song');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
// eslint-disable-next-line no-unused-vars
const AuthorizationError = require('../exceptions/AuthorizationError');

class SongService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const query = {
      // eslint-disable-next-line max-len
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        insertedAt,
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Song cannot be added');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    // eslint-disable-next-line max-len
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song isn\'t found');
    }

    return result.rows.map(mapDbToModel)[0];
  }

  async updateSongById(
      id,
      {title, year, genre, performer, duration, albumId},
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      // eslint-disable-next-line max-len
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, "albumId"=$6, updated_at=$7 WHERE id=$8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update song. ID not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete song. ID not found');
    }
  }
}

module.exports = SongService;
