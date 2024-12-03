import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { LibraryItem, SearchResults, SearchType } from './types'
import Search from './components/Search';
import SearchResultTable from './components/SearchResults';

const App: React.FC = () => {
    const [searchType, setSearchType] = useState<string>("tracks");
    const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined);
    return (
        <>
            <h1>Welcome to the shittiest app you've ever used!</h1>
            <Search searchType={searchType} setSearchType={setSearchType} setSearchResults={setSearchResults}/>
            <SearchResultTable searchType={searchType} searchResults={searchResults} />
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);

