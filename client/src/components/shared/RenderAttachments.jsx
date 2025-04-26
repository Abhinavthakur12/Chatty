import React from 'react';
import { transformImage } from '../../lib/features';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

const RenderAttachments = (file, url) => {
  const commonStyle = {
    borderRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '0.25rem',
    maxWidth: '100%',
  };

  switch (file) {
    case 'video':
      return (
        <video
          src={url}
          preload="none"
          width="220"
          controls
          style={commonStyle}
        />
      );

    case 'image':
      return (
        <img
          src={transformImage(url, 220)}
          alt="Attachment"
          width="220"
          height="150"
          style={{
            ...commonStyle,
            objectFit: 'cover',
          }}
        />
      );

    case 'audio':
      return (
        <audio
          src={url}
          preload="none"
          controls
          style={{ marginTop: '0.25rem', width: '100%' }}
        />
      );

    default:
      return (
        <FileOpenIcon
          sx={{
            fontSize: '2rem',
            marginTop: '0.25rem',
            color: 'grey',
          }}
        />
      );
  }
};

export default RenderAttachments;
