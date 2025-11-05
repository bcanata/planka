/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader, Message } from 'semantic-ui-react';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import boardsApi from '../../api/boards';
import DueDateChip from '../../cards/DueDateChip/DueDateChip';
import { Icon } from 'semantic-ui-react';

import styles from './PublicBoard.module.scss';
import globalStyles from '../../styles.module.scss';

const PublicBoard = () => {
  const { token } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const currentUrl = window.location.href;
  const boardTitle = board?.item?.name || 'GOAT PANO';

  const socialShareText = `"${boardTitle}" panosunu GOAT PANO ile görüntüleyin! 📋✨`;

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(socialShareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(socialShareText)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&summary=${encodeURIComponent(socialShareText)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${socialShareText} ${currentUrl}`)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    // Could add a toast notification here
  };

  // Force Turkish language for this public page since it's accessed via Turkish domain
  useEffect(() => {
    i18n.changeLanguage('tr-TR');
  }, [i18n]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const data = await boardsApi.getPublicBoard(token);
        setBoard(data);
        setError(null);
      } catch (err) {
        setError(t('common.publicBoardNotFoundOrAccessDenied'));
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [token, t]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader active size="massive">
          {t('common.loadingBoard')}
        </Loader>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.message}>
          <Message negative>
            <Message.Header>{t('common.boardNotFound', { context: 'title' })}</Message.Header>
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
        <div className={styles.headerContent}>
          <h1>{board.item.name}</h1>
          <div className={styles.badge}>{t('common.readOnlyView')}</div>
        </div>
        <div className={styles.socialButtons}>
          <button className={`${styles.socialButton} ${styles.twitter}`} onClick={handleShareTwitter} title="Twitter'da paylaş">
            <Icon name="twitter" />
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`} onClick={handleShareFacebook} title="Facebook'ta paylaş">
            <Icon name="facebook" />
          </button>
          <button className={`${styles.socialButton} ${styles.linkedin}`} onClick={handleShareLinkedIn} title="LinkedIn'de paylaş">
            <Icon name="linkedin" />
          </button>
          <button className={`${styles.socialButton} ${styles.whatsapp}`} onClick={handleShareWhatsApp} title="WhatsApp'ta paylaş">
            <Icon name="whatsapp" />
          </button>
          <button className={styles.socialButton} onClick={handleCopyLink} title="Bağlantıyı kopyala">
            <Icon name="linkify" />
          </button>
        </div>
      </div>
      <div className={styles.boardWrapper}>
        <div className={styles.lists}>
          {board.included.lists
            .filter((list) => list.type === 'active')
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
                                      className={`${styles.label} ${globalStyles[`background${upperFirst(camelCase(label.color))}`]}`}
                                    >
                                      {label.name}
                                    </span>
                                  ),
                              )}
                            </div>
                          )}
                          <div className={styles.cardName}>{card.name}</div>
                          {card.dueDate && (
                            <div className={styles.cardDueDate}>
                              <DueDateChip
                                value={new Date(card.dueDate)}
                                size="small"
                                isCompleted={card.isDueCompleted}
                                withStatus={true}
                                withStatusIcon={true}
                              />
                            </div>
                          )}
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
        <p>{t('common.publicBoardFooterMessage')}</p>
      </div>
    </div>
  );
};

export default PublicBoard;
