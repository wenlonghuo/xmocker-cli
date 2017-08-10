'use strict';

var validateSchema = require('./valid-schema'),
    validateObject = require('./valid-object'),
    formatObject = require('./format-object');

var Schema = function Schema(schema) {
	this.schema = schema;
	validateSchema(schema);

	this.validate = function (obj, done) {
		validateObject(obj, schema, done);
	};
	this.format = function (obj, done) {
		formatObject(obj, schema, done);
	};
};

module.exports.createSchema = function (schema) {
	return new Schema(schema);
};