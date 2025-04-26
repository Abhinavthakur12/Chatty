import React from 'react';
import { Helmet } from 'react-helmet-async';

const Title = ({
  title = 'Chat | Chatty',
  description = 'A modern real-time chat application built for seamless conversations.',
  keywords = 'chat, messaging, real-time, React, MERN',
  author = 'Chatty Team'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
    </Helmet>
  );
};

export default Title;
