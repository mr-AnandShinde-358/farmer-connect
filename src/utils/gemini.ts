import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!); // 👈 add karo

export const generateProductDescription = async (
  productName: string,
  imageUri?: string
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const parts: any[] = [];

  // Image available hai toh add karo
  if (imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.readAsDataURL(blob);
    });

    parts.push({
      inlineData: { mimeType: "image/jpeg", data: base64 },
    });
  }

  parts.push({
    text: `You are a helpful assistant for a farmer marketplace app.
Generate a short, appealing product description (2-3 sentences) for "${productName}".
Focus on quality, freshness, and farm-to-table appeal. Keep it simple and friendly.
Reply in English only.`,
  });

  const result = await model.generateContent(parts);
  return result.response.text();
};