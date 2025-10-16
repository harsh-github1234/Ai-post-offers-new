export interface Offer {
    id: string;
    title: string;
    body: string;
    imagePrompt: string;
    imageUrl: string;
}

export type PostLength = 'Short' | 'Medium' | 'Long';

export interface FormState {
    businessName: string;
    location: string;
    businessType: string;
    occasion: string;
    autoDetectOccasion: boolean;
    keywords: string;
    postLength: PostLength;
    keywordRichness: number;
}