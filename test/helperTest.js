const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  m7dh3e: {
    id: 'm7dh3e',
    email: 'u1@a.com',
    hashedPassword: '$2a$10$rDGtajW/XrVqYYsyeDj3z..qC6MiwF5Ci6gAUVA.2kt0HomucxdyK'
  },
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("u1@a.com", testUsers)
    assert.deepEqual(user, testUsers.m7dh3e);
  });
  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("u1@ax.com", testUsers)
    assert.strictEqual(user, undefined);
  });
});