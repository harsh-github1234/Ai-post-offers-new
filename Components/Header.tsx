import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                    AI Post Offer Generator
                </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Craft compelling social media offers with AI-powered text and visuals in seconds.
            </p>
        </header>
    );
};

export default Header;