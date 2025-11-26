// --- Audio Utility Functions ---
export function encode(bytes: Uint8Array | number[]) {
  let binary = "";
  if (Array.isArray(bytes)) {
    const len = bytes.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else {
    const len = (bytes as Uint8Array).byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode((bytes as Uint8Array)[i]);
    }
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: { buffer: ArrayBuffer } | ArrayBuffer | Uint8Array | Int16Array,
  ctx: any,
  sampleRate: number,
  numChannels: number,
): Promise<any> {
  let dataBuffer: ArrayBuffer;
  if (data instanceof ArrayBuffer) {
    dataBuffer = data;
  } else if (ArrayBuffer.isView(data as ArrayBuffer) || (data as any).buffer) {
    dataBuffer = (data as any).buffer as ArrayBuffer;
  } else {
    dataBuffer = new ArrayBuffer(0);
  }
  const dataInt16 = new Int16Array(dataBuffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array | number[]) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: "audio/pcm;rate=16000",
  };
}
