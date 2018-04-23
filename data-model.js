// data models

// https://github.com/baseprime/dynamodb

'use strict';

const dynamo = require('dynamodb');
const Joi    = require('joi');
const AWS    = dynamo.AWS;

// dynamo.AWS.config.loadFromPath(process.env.HOME + '/.aws/credentials.json');
dynamo.AWS.config.update({region: "us-west-2"}); // region must be set
dynamo.log.level('error'); // enabled log level 

// # query notes
// define data model
let note = dynamo.define('note', {
    hashKey: 'owner',
    rangeKey: 'created',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated',
    schema: { // key = userId + created
        "owner": Joi.string(),
        "created": Joi.string(),
        "answer": Joi.string(),
        "hint": Joi.string(),
        // "id": dynamo.types.uuid(), // not actually used
        "size": Joi.string(), 
        "spaced": Joi.string(),
        "status": Joi.string(),
        "title": Joi.string(),
        "url": Joi.string(),
        "trash": Joi.number(),
        "toReview": Joi.number(), // times left to finish a cycle - default to 4
        "collect": Joi.boolean() // favorite
      }
});

let user = dynamo.define('user',{
    hashKey: 'email',
    schema: {
        'email': Joi.string(),
        'password': Joi.string(),
        'firstName': Joi.string(),
        'lastName': Joi.string(),
        'gender': Joi.string(),
        'birthday': Joi.string(),
        'phone': Joi.number()
    }
});

module.exports = {
    note,
    user
}