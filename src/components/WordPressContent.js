import React from "react";
import parse from "html-react-parser";

const YouTubeEmbed = ({ videoId }) => {
  return (
    <div className='video-responsive'>
      <iframe
        width='853'
        height='480'
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        title='Embedded youtube'
      />
    </div>
  );
};

const WordPressContent = ({ content }) => {
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const options = {
    replace: (domNode) => {
      if (
        domNode.name === "figure" &&
        domNode.attribs.class &&
        domNode.attribs.class.includes("wp-block-embed")
      ) {
        const wrapperDiv = domNode.children.find(
          (child) =>
            child.name === "div" &&
            child.attribs.class &&
            child.attribs.class.includes("wp-block-embed__wrapper")
        );

        if (
          wrapperDiv &&
          wrapperDiv.children &&
          wrapperDiv.children.length > 0
        ) {
          const youtubeUrlNode = wrapperDiv.children.find(
            (child) =>
              typeof child.data === "string" &&
              child.data.trim().includes("youtube.com/embed/")
          );

          if (youtubeUrlNode) {
            const youtubeUrl = youtubeUrlNode.data.trim();

            const videoId = extractVideoId(youtubeUrl);

            if (videoId) {
              return <YouTubeEmbed videoId={videoId} />;
            }
          }
        }
      }
      return undefined;
    },
  };

  return <>{parse(content, options)}</>;
};

export default WordPressContent;
