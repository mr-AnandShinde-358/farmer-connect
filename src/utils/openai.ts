export const generateProductDescription = async (
  productName: string,
): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `You are a helpful assistant for a farmer marketplace app. Generate a short, appealing product description (2-3 sentences) for "${productName}". Focus on quality, freshness, and farm-to-table appeal. Keep it simple and friendly. Reply in English only.`,
        },
      ],
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content ?? "";
};