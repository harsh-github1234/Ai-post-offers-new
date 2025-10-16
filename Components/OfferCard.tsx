import React, { useState, useCallback } from 'react';
import { Offer } from '../types';
import HeartIcon from './icons/HeartIcon';
import CopyIcon from './icons/CopyIcon';

interface OfferCardProps {
    offer: Offer;
    onCopyToClipboard: (text: string) => void;
    onToggleWishlist: (id: string) => void;
    isWishlisted: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onCopyToClipboard, onToggleWishlist, isWishlisted }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        onCopyToClipboard(offer.body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [offer.body, onCopyToClipboard]);
    
    return (
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700 flex flex-col h-full transform transition-all duration-300 hover:shadow-indigo-500/20 hover:border-slate-600 hover:-translate-y-1">
            <div className="relative w-full aspect-video bg-slate-700">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-100">{offer.title}</h3>
                <p className="mt-3 text-slate-300 whitespace-pre-wrap flex-grow">{offer.body}</p>
                <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors duration-200"
                    >
                        <CopyIcon />
                        {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                        onClick={() => onToggleWishlist(offer.id)}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={`p-2 rounded-full transition-colors duration-200 ${isWishlisted ? 'text-pink-500 bg-pink-500/20' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        <HeartIcon filled={isWishlisted} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
