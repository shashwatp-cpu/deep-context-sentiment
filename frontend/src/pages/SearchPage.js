import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const SearchPage = () => {
    const navigate = useNavigate();
    const handleAnalyze = (url) => {
        navigate(`/dashboard?url=${encodeURIComponent(url)}`);
    };
    return <Hero onAnalyze={handleAnalyze} isLoading={false} />;
};

export default SearchPage;
