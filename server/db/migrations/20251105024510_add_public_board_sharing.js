/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

exports.up = async (knex) => {
  await knex.schema.alterTable('board', (table) => {
    /* Columns */

    table.string('public_share_token', 64).unique();
  });
};

exports.down = (knex) =>
  knex.schema.table('board', (table) => {
    table.dropColumn('public_share_token');
  });
