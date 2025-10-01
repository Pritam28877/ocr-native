import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { OCR_API_URL, getOcrApiToken, assertOcrConfig } from './env';

export interface OcrApiResponse {
  success: boolean;
  message: string;
  data: {
    rawText: string;
    parsedData: {
      products: any[];
    };
    matchingResult: any;
    costAnalysis: any;
    usageMetadata: any;
  };
}

export async function uploadImageToOcr(
  imageUri: string
): Promise<OcrApiResponse> {
  assertOcrConfig();

  // Get fresh Firebase ID token
  const token = await getOcrApiToken();

  const processedImage = await manipulateAsync(
    imageUri,
    [{ resize: { width: 1200 } }],
    { compress: 0.8, format: SaveFormat.JPEG }
  );

  const form = new FormData();
  form.append('image', {
    uri: processedImage.uri,
    name: 'quotation_bw.jpg',
    type: 'image/jpeg',
  } as any);

  console.log('Sending request to:', OCR_API_URL);
  const res = await fetch(OCR_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form as any,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OCR API error ${res.status}: ${text}`);
  }

  return (await res.json()) as OcrApiResponse;
}
