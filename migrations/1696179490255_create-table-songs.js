exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(80)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        duration: {
            type: 'INT',
            notNull: true,
        },
        albumId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

pgm.addConstraint(
    'songs',
    'fk_songs.albums_albumId.albums.id',
    'FOREIGN KEY(albumId) REFERENCES albums(id) ON DELETE CASCADE'
)

exports.down = (pgm) => {
    pgm.dropTable('songs');
};
