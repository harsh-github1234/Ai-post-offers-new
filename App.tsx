import React, { useState, useCallback, useMemo } from 'react';
import { Offer, PostLength, FormState } from './types';
import { generateOffersAndImages } from './services/geminiService';
import { downloadSourceAsZip } from './services/sourceCodeService';

import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import OfferCard from './components/OfferCard';
import Spinner from './components/ui/Spinner';
import DownloadIcon from './components/icons/DownloadIcon';

const App: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        businessName: '',
        location: '',
        businessType: '',
        occasion: '',
        autoDetectOccasion: false,
        keywords: '',
        postLength: 'Medium',
        keywordRichness: 5,
    });
    const [offers, setOffers] = useState<Offer[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newOffers = await generateOffersAndImages(formState);
            setOffers(prevOffers => [...prevOffers, ...newOffers]);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
        } finally {
            setIsLoading(false);
        }
    }, [formState]);

    const handleCopyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    const handleToggleWishlist = useCallback((offerId: string) => {
        setWishlist(prev =>
            prev.includes(offerId)
                ? prev.filter(id => id !== offerId)
                : [...prev, offerId]
        );
    }, []);

    const wishlistedOffers = useMemo(() => {
        return offers.filter(offer => wishlist.includes(offer.id));
    }, [offers, wishlist]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <button
                onClick={downloadSourceAsZip}
                className="fixed top-4 right-4 z-50 bg-slate-700/50 hover:bg-slate-600/70 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2"
                title="Download Source Code"
            >
                <DownloadIcon />
                <span className="hidden sm:inline">Source Code</span>
            </button>
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    <GeneratorForm
                        formState={formState}
                        setFormState={setFormState}
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                        hasGeneratedOnce={offers.length > 0}
                    />

                    {isLoading && offers.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-16 text-center">
                            <Spinner />
                            <p className="mt-4 text-lg text-slate-400">Generating your amazing offers...</p>
                            <p className="text-sm text-slate-500">(This might take a moment, especially the images!)</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-12 text-center bg-red-900/50 border border-red-700 p-4 rounded-lg">
                            <h3 className="text-xl font-bold text-red-400">An Error Occurred</h3>
                            <p className="text-red-300 mt-2">{error}</p>
                        </div>
                    )}
                    
                    {offers.length > 0 && (
                        <div className="mt-12">
                             <h2 className="text-3xl font-bold text-center text-slate-100 mb-8">Generated Offers</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {offers.map(offer => (
                                    <OfferCard
                                        key={offer.id}
                                        offer={offer}
                                        onCopyToClipboard={handleCopyToClipboard}
                                        onToggleWishlist={handleToggleWishlist}
                                        isWishlisted={wishlist.includes(offer.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {offers.length > 0 && !isLoading && (
                        <div className="text-center mt-12">
                             <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                            >
                                {isLoading ? <Spinner /> : '✨ Generate More Offers'}
                            </button>
                        </div>
                    )}

                    {wishlistedOffers.length > 0 && (
                        <div className="mt-20 pt-10 border-t-2 border-slate-700">
                             <h2 className="text-3xl font-bold text-center text-slate-100 mb-8">My Wishlist</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {wishlistedOffers.map(offer => (
                                    <OfferCard
                                        key={offer.id}
                                        offer={offer}
                                        onCopyToClipboard={handleCopyToClipboard}
                                        onToggleWishlist={handleToggleWishlist}
                                        isWishlisted={wishlist.includes(offer.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;