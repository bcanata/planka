/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, Message } from 'semantic-ui-react';
import boardsApi from '../../api/boards';

import styles from './PublicBoard.module.scss';

const PublicBoard = () => {
  const { token } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const data = await boardsApi.getPublicBoard(token);
        setBoard(data);
        setError(null);
      } catch (err) {
        setError('Board not found or access denied');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [token]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader active size="massive">
          Loading board...
        </Loader>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.message}>
          <Message negative>
            <Message.Header>Board Not Found</Message.Header>
            <p>{error}</p>
          </Message>
        </div>
      </div>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>{board.item.name}</h1>
        <div className={styles.badge}>Read-Only View</div>
      </div>
      <div className={styles.boardWrapper}>
        <div className={styles.lists}>
          {board.included.lists
            .filter((list) => list.type === null)
            .map((list) => {
              const listCards = board.included.cards.filter((card) => card.listId === list.id);

              return (
                <div key={list.id} className={styles.list}>
                  <div className={styles.listHeader}>
                    <h3>{list.name}</h3>
                    <span className={styles.cardCount}>{listCards.length}</span>
                  </div>
                  <div className={styles.cards}>
                    {listCards.map((card) => {
                      const cardLabels = board.included.cardLabels
                        .filter((cl) => cl.cardId === card.id)
                        .map((cl) => board.included.labels.find((l) => l.id === cl.labelId));

                      return (
                        <div key={card.id} className={styles.card}>
                          {cardLabels.length > 0 && (
                            <div className={styles.labels}>
                              {cardLabels.map(
                                (label) =>
                                  label && (
                                    <span
                                      key={label.id}
                                      className={styles.label}
                                      style={{ backgroundColor: label.color }}
                                    >
                                      {label.name}
                                    </span>
                                  ),
                              )}
                            </div>
                          )}
                          <div className={styles.cardName}>{card.name}</div>
                          {card.description && (
                            <div className={styles.cardDescription}>{card.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.footer}>
        <p>
          This is a read-only public view. To interact with this board, please contact the board
          owner.
        </p>
      </div>
    </div>
  );
};

export default PublicBoard;
