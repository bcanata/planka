/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * @swagger
 * /boards/{id}/public-share-token:
 *   post:
 *     summary: Toggle public sharing for a board
 *     description: Generates or removes a public share token for the board. Only project managers can toggle public sharing.
 *     tags:
 *       - Boards
 *     operationId: toggleBoardPublicSharing
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the board to toggle public sharing for
 *         schema:
 *           type: string
 *           example: "1357158568008091264"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enabled
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 description: Whether to enable or disable public sharing
 *                 example: true
 *     responses:
 *       200:
 *         description: Public sharing toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - item
 *               properties:
 *                 item:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Board'
 *                     - type: object
 *                       properties:
 *                         publicShareToken:
 *                           type: string
 *                           nullable: true
 *                           description: Public share token (only present if sharing is enabled)
 *                           example: "a1b2c3d4e5f6g7h8"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

const { idInput } = require('../../../utils/inputs');

const Errors = {
  BOARD_NOT_FOUND: {
    boardNotFound: 'Board not found',
  },
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
};

module.exports = {
  inputs: {
    id: {
      ...idInput,
      required: true,
    },
    enabled: {
      type: 'boolean',
      required: true,
    },
  },

  exits: {
    boardNotFound: {
      responseType: 'notFound',
    },
    notEnoughRights: {
      responseType: 'forbidden',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const pathToProject = await sails.helpers.boards
      .getPathToProjectById(inputs.id)
      .intercept('pathNotFound', () => Errors.BOARD_NOT_FOUND);

    let { board } = pathToProject;
    const { project } = pathToProject;

    const isProjectManager = await sails.helpers.users.isProjectManager(currentUser.id, project.id);

    if (!isProjectManager) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    // Generate or remove the public share token
    const publicShareToken = inputs.enabled
      ? await sails.helpers.boards.generatePublicShareToken()
      : null;

    // Update the board
    board = await Board.qm.updateOne(
      { id: board.id },
      { publicShareToken }
    );

    if (!board) {
      throw Errors.BOARD_NOT_FOUND;
    }

    // Emit socket event for real-time updates
    sails.sockets.broadcast(`board:${board.id}`, 'boardUpdate', {
      item: board,
    });

    return {
      item: board,
    };
  },
};
