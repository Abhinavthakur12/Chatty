import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import { lightBlue } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachments from './RenderAttachments';
import { motion } from 'framer-motion';

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: sameSender ? '100%' : '-100%' }}
      whileInView={{ opacity: 1, x: '0' }}
      transition={{ type: 'spring', stiffness: 100 }}
      style={{
        alignSelf: sameSender ? 'flex-end' : 'flex-start',
        backgroundColor: sameSender ? '#835D04' : '#f1f0f0',
        color: sameSender ? 'white' : 'black',
        borderRadius: '1rem',
        padding: '0.75rem 1rem',
        margin: '0.5rem 1rem',
        maxWidth: '70%',
        wordBreak: 'break-word',
        boxShadow: sameSender
          ? '0px 2px 8px rgba(11, 147, 246, 0.3)'
          : '0px 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      {!sameSender && (
        <Typography
          color={lightBlue}
          fontWeight="600"
          variant="caption"
          sx={{ marginBottom: '0.25rem' }}
        >
          {sender.name}
        </Typography>
      )}

      {content && (
        <Typography
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.5,
            marginBottom: attachments.length > 0 ? '0.5rem' : '0',
          }}
        >
          {content}
        </Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index} mt={0.5}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{ color: sameSender ? 'white' : 'black', textDecoration: 'none' }}
              >
                {RenderAttachments(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          marginTop: '0.5rem',
          textAlign: 'right',
          opacity: 0.7,
          fontSize: '0.75rem',
        }}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
