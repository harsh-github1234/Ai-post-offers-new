import React from 'react';
import { FormState, PostLength } from '../types';
import Spinner from './ui/Spinner';

interface GeneratorFormProps {
    formState: FormState;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
    onGenerate: () => void;
    isLoading: boolean;
    hasGeneratedOnce: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ formState, setFormState, onGenerate, isLoading, hasGeneratedOnce }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormState(prev => ({ ...prev, [name]: checked }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, postLength: e.target.value as PostLength }));
    };
    
    const isFormIncomplete = !formState.businessType || !formState.keywords || (!formState.autoDetectOccasion && !formState.occasion);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!isFormIncomplete) {
            onGenerate();
        }
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Column 1 */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-slate-300">Business Name (Optional)</label>
                        <input type="text" name="businessName" id="businessName" value={formState.businessName} onChange={handleInputChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white h-10 px-3"/>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-300">Location (Optional)</label>
                        <input type="text" name="location" id="location" value={formState.location} onChange={handleInputChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white h-10 px-3"/>
                    </div>
                    <div>
                        <label htmlFor="businessType" className="block text-sm font-medium text-slate-300">What is your business? <span className="text-red-400">*</span></label>
                        <input type="text" name="businessType" id="businessType" value={formState.businessType} onChange={handleInputChange} required placeholder="e.g., Artisan coffee shop, Boutique clothing store" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white h-10 px-3 placeholder-slate-500"/>
                    </div>
                     <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="occasion" className="block text-sm font-medium text-slate-300">What's the occasion? <span className="text-red-400">*</span></label>
                             <div className="flex items-center">
                                <input id="autoDetectOccasion" name="autoDetectOccasion" type="checkbox" checked={formState.autoDetectOccasion} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-indigo-600 focus:ring-indigo-500"/>
                                <label htmlFor="autoDetectOccasion" className="ml-2 block text-sm text-slate-400">Auto-detect</label>
                            </div>
                        </div>
                        <input type="text" name="occasion" id="occasion" value={formState.occasion} onChange={handleInputChange} required={!formState.autoDetectOccasion} disabled={formState.autoDetectOccasion} placeholder="e.g., Summer sale, New product launch" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white h-10 px-3 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"/>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-slate-300">Keywords or special wishes? <span className="text-red-400">*</span></label>
                        <textarea name="keywords" id="keywords" value={formState.keywords} onChange={handleInputChange} required rows={4} placeholder="e.g., vegan-friendly, 20% off, limited edition" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-3 placeholder-slate-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Post Length</label>
                        <fieldset className="mt-2">
                            <legend className="sr-only">Post Length</legend>
                            <div className="flex items-center space-x-4">
                                {(['Short', 'Medium', 'Long'] as PostLength[]).map(length => (
                                    <div key={length} className="flex items-center">
                                        <input id={length} name="postLength" type="radio" value={length} checked={formState.postLength === length} onChange={handleRadioChange} className="h-4 w-4 border-slate-500 bg-slate-700 text-indigo-600 focus:ring-indigo-500"/>
                                        <label htmlFor={length} className="ml-2 block text-sm font-medium text-slate-300">{length}</label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                     <div>
                        <label htmlFor="keywordRichness" className="block text-sm font-medium text-slate-300">Keyword Richness: <span className="font-bold text-indigo-400">{formState.keywordRichness}</span></label>
                        <input id="keywordRichness" name="keywordRichness" type="range" min="1" max="10" value={formState.keywordRichness} onChange={handleInputChange} className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-indigo-500"/>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-4 text-center">
                    <button type="submit" disabled={isLoading || isFormIncomplete} className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-12 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center">
                        {isLoading ? <Spinner /> : `✨ ${hasGeneratedOnce ? 'Generate More Offers' : 'Generate Offers'}`}
                    </button>
                    {isFormIncomplete && <p className="text-xs text-red-400 mt-2">Please fill in all required fields (*)</p>}
                </div>
            </form>
        </div>
    );
};

export default GeneratorForm;
