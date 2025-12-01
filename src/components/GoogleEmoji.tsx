import React from 'react';
import getNotoEmojiUrl from '../utils/emoji';

interface GoogleEmojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  symbol: string;
  size?: 24 | 32 | 48 | 64 | 128 | number;
  alt?: string;
}

const GoogleEmoji: React.FC<GoogleEmojiProps> = ({ symbol, size = 24, alt, className, ...rest }) => {
  const src = getNotoEmojiUrl(symbol, size as number);
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <span data-emoji-symbol={symbol} className={`inline-block align-middle ${className ?? ''}`} {...rest}>
        {symbol}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? symbol}
      data-emoji-symbol={symbol}
      width={size}
      height={size}
      className={`inline-block align-middle ${className ?? ''}`}
      draggable={false}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
};

export default GoogleEmoji;
