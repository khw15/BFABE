const mapDbToModel = ({id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = {mapDbToModel};
