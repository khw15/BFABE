const Joi = require('joi');

const SongPayloadSchema  = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2024).required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().required(),
    albumId: Joi.string().required(),
});

module.exports = { SongPayloadSchema  };