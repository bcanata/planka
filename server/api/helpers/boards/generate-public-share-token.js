/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const crypto = require('crypto');

module.exports = {
  inputs: {},

  async fn() {
    let token;
    let existingBoard;

    // Generate a unique token that doesn't already exist
    do {
      token = crypto.randomBytes(16).toString('hex');
      existingBoard = await Board.qm.getOneByPublicShareToken(token);
    } while (existingBoard);

    return token;
  },
};
