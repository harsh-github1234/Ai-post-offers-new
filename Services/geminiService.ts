import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Offer, FormState } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

interface GeneratedOfferText {
    title: string;
    body: string;
    imagePrompt: string;
}

const textGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        offers: {
            type: Type.ARRAY,
            description: "An array of 3 unique promotional offers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A short, catchy title for the promotional post."
                    },
                    body: {
                        type: Type.STRING,
                        description: "The full body of the post, including emojis and SEO keywords/hashtags."
                    },
                    imagePrompt: {
                        type: Type.STRING,
                        description: "A detailed, photorealistic prompt for an AI image generator to create a visually stunning image representing the offer."
                    }
                },
                required: ['title', 'body', 'imagePrompt']
            }
        }
    },
    required: ['offers']
};


const generateTextOffers = async (formState: FormState): Promise<GeneratedOfferText[]> => {
    const occasionText = formState.autoDetectOccasion ? "Auto-detected based on other details" : formState.occasion;

    const prompt = `
        You are an expert marketing copywriter and social media strategist. Based on the following business details, generate 3 unique and compelling promotional post offers.

        Business Details:
        - Business Name: ${formState.businessName || 'Not provided'}
        - Location: ${formState.location || 'Not provided'}
        - Business Type: ${formState.businessType}
        - Occasion for Promotion: ${occasionText}
        - Keywords or Special Wishes: ${formState.keywords}
        - Desired Post Length: ${formState.postLength}
        - Keyword Richness (1-10 scale): ${formState.keywordRichness}

        For EACH of the 3 offers, you MUST provide the following in the specified JSON format:
        1. A short, catchy "title".
        2. The full post "body". This should be '${formState.postLength}' in length, incorporate keywords with a richness level of ${formState.keywordRichness}/10, and must include relevant emojis and SEO-friendly hashtags.
        3. A detailed, photorealistic "imagePrompt" for an AI image generator. This prompt must describe a visually stunning and high-quality image that perfectly captures the essence of the offer. Avoid generic descriptions. Be creative and specific.
    `;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: textGenerationSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);
        
        if (!parsedResponse.offers || !Array.isArray(parsedResponse.offers) || parsedResponse.offers.length === 0) {
            throw new Error("AI did not return offers in the expected format.");
        }
        
        return parsedResponse.offers as GeneratedOfferText[];
    } catch (error) {
        console.error("Error during text generation:", error);
        throw new Error("Failed to generate post text. The model may be unavailable or the request was malformed.");
    }
};

const generateImageForPrompt = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: imageModel,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the response.");
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        throw new Error("Failed to generate an image for one of the offers.");
    }
};

export const generateOffersAndImages = async (formState: FormState): Promise<Offer[]> => {
    const textOffers = await generateTextOffers(formState);

    const fullOffers = await Promise.all(
        textOffers.map(async (textOffer) => {
            const imageUrl = await generateImageForPrompt(textOffer.imagePrompt);
            return {
                id: crypto.randomUUID(),
                ...textOffer,
                imageUrl,
            };
        })
    );

    return fullOffers;
};