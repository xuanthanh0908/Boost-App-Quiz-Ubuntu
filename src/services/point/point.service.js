const { Point } = require('../../models');

/**
 *
 * @param {*} userId
 * @returns Point of the user
 */
const getPointsByField = async (field) => {
	return await Point.findOne(field);
};

/**
 *
 * @param {*} userId
 * @param {*} field
 * @returns Updated points of the user
 */
const updatePointsByField = async (userId, field) => {
	return await Point.findOneAndUpdate(userId, field);
};

module.exports = {
	getPointsByField,
	updatePointsByField,
};
