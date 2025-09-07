import fs from 'fs/promises';
import { lookup } from 'mime-types';
import type { MessageStreamProps } from './types';

export const convertMessages = async (messages: MessageStreamProps[]) => {
  const convertedMessages = [];
  for (const message of messages) {
    let convertedContent: string | any[];
    if (message.imagePath) {
      const base64 = await getImageBase64(message.imagePath);
      convertedContent = [
        {
          type: 'image_url',
          image_url: {
            url: base64,
          },
        },
        {
          type: 'text',
          text: message.content,
        },
      ];
    } else {
      convertedContent = message.content;
    }
    const { imagePath, ...messageWithoutImagePath } = message;
    convertedMessages.push({
      ...messageWithoutImagePath,
      content: convertedContent,
    });
  }
  return convertedMessages;
};

export const getImageBase64 = async (imagePath: string) => {
  const imageBuffer = await fs.readFile(imagePath);
  const mimeType = lookup(imagePath);
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
};
