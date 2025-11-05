/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Form, Message } from 'semantic-ui-react';
import { Popup } from '../../../../lib/custom-ui';

import selectors from '../../../../selectors';
import boardsApi from '../../../../api/boards';

import styles from './ActionsStep.module.scss';

const ShareStep = React.memo(({ onBack }) => {
  const board = useSelector(selectors.selectCurrentBoard);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const inputRef = useRef(null);

  const publicUrl = board.publicShareToken
    ? `${window.location.origin}/public/${board.publicShareToken}`
    : null;

  const handleToggleSharing = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await boardsApi.togglePublicSharing(board.id, !board.publicShareToken);
      // The board will be updated via socket event
    } catch (error) {
      console.error('Failed to toggle public sharing:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [board.id, board.publicShareToken]);

  const handleCopyLink = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, []);

  return (
    <>
      <Popup.Header onBack={onBack}>
        {t('common.shareBoard', {
          context: 'title',
        })}
      </Popup.Header>
      <Popup.Content>
        <div className={styles.menu}>
          {board.publicShareToken ? (
            <>
              <Message info size="tiny">
                {t('common.shareBoardDescription')}
              </Message>
              <Form>
                <Form.Field>
                  <input ref={inputRef} type="text" value={publicUrl} readOnly />
                </Form.Field>
                <Button.Group fluid>
                  <Button primary onClick={handleCopyLink} disabled={isSubmitting}>
                    {copySuccess ? t('action.copied') : t('action.copyLink')}
                  </Button>
                  <Button negative onClick={handleToggleSharing} loading={isSubmitting}>
                    {t('action.disableSharing')}
                  </Button>
                </Button.Group>
              </Form>
            </>
          ) : (
            <>
              <Message size="tiny">{t('common.shareBoardDisabledDescription')}</Message>
              <Button
                fluid
                primary
                onClick={handleToggleSharing}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('action.enableSharing')}
              </Button>
            </>
          )}
        </div>
      </Popup.Content>
    </>
  );
});

ShareStep.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ShareStep;
