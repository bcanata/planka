/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * @swagger
 * /public-boards/{token}:
 *   get:
 *     summary: Get public board details
 *     description: Retrieves board information via public share token. No authentication required.
 *     tags:
 *       - Public Boards
 *     operationId: getPublicBoard
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Public share token
 *         schema:
 *           type: string
 *           example: "a1b2c3d4e5f6g7h8"
 *     responses:
 *       200:
 *         description: Board details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - item
 *                 - included
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Board'
 *                 included:
 *                   type: object
 *                   required:
 *                     - projects
 *                     - labels
 *                     - lists
 *                     - cards
 *                     - cardLabels
 *                     - taskLists
 *                     - tasks
 *                     - attachments
 *                   properties:
 *                     projects:
 *                       type: array
 *                       description: Parent project
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *                     labels:
 *                       type: array
 *                       description: Related labels
 *                       items:
 *                         $ref: '#/components/schemas/Label'
 *                     lists:
 *                       type: array
 *                       description: Related lists
 *                       items:
 *                         $ref: '#/components/schemas/List'
 *                     cards:
 *                       type: array
 *                       description: Related cards
 *                       items:
 *                         $ref: '#/components/schemas/Card'
 *                     cardLabels:
 *                       type: array
 *                       description: Related card-label associations
 *                       items:
 *                         $ref: '#/components/schemas/CardLabel'
 *                     taskLists:
 *                       type: array
 *                       description: Related task lists
 *                       items:
 *                         $ref: '#/components/schemas/TaskList'
 *                     tasks:
 *                       type: array
 *                       description: Related tasks
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     attachments:
 *                       type: array
 *                       description: Related attachments
 *                       items:
 *                         $ref: '#/components/schemas/Attachment'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

const Errors = {
  BOARD_NOT_FOUND: {
    boardNotFound: 'Board not found',
  },
};

module.exports = {
  inputs: {
    token: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    boardNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const board = await Board.qm.getOneByPublicShareToken(inputs.token);

    if (!board || !board.publicShareToken) {
      throw Errors.BOARD_NOT_FOUND;
    }

    const project = await Project.qm.getOneById(board.projectId);

    if (!project) {
      throw Errors.BOARD_NOT_FOUND;
    }

    const labels = await Label.qm.getByBoardId(board.id);
    const lists = await List.qm.getByBoardId(board.id);

    const finiteLists = lists.filter((list) => sails.helpers.lists.isFinite(list));
    const finiteListIds = sails.helpers.utils.mapRecords(finiteLists);

    const cards = await Card.qm.getByListIds(finiteListIds);
    const cardIds = sails.helpers.utils.mapRecords(cards);

    const cardLabels = await CardLabel.qm.getByCardIds(cardIds);

    const taskLists = await TaskList.qm.getByCardIds(cardIds);
    const taskListIds = sails.helpers.utils.mapRecords(taskLists);

    const tasks = await Task.qm.getByTaskListIds(taskListIds);
    const attachments = await Attachment.qm.getByCardIds(cardIds);

    const customFieldGroups = await CustomFieldGroup.qm.getByBoardId(board.id);
    const customFieldGroupIds = sails.helpers.utils.mapRecords(customFieldGroups);

    const customFields = await CustomField.qm.getByCustomFieldGroupIds(customFieldGroupIds);
    const customFieldValues = await CustomFieldValue.qm.getByCardIds(cardIds);

    // Don't include sensitive user information for public boards
    // Don't include board memberships for privacy

    return {
      item: board,
      included: {
        labels,
        lists,
        cards,
        cardLabels,
        taskLists,
        tasks,
        customFieldGroups,
        customFields,
        customFieldValues,
        projects: [project],
        attachments: attachments.map((attachment) => ({
          ...attachment,
          url: sails.helpers.attachments.getUrl(attachment),
        })),
      },
    };
  },
};
