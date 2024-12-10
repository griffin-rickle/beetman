import React, { useState } from 'react';

import { SearchResults, SearchType } from '../types'
import SearchBar from '../components/SearchBar';
import SearchResultTable from '../components/SearchResults';

const SearchPage: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>("tracks");
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined);
  return (
        <>
            <h1>Search</h1>
            <SearchBar searchType={searchType} setSearchType={setSearchType} setSearchResults={setSearchResults}/>
            <SearchResultTable searchType={searchType} searchResults={searchResults} />
        </>
    );
};

export default SearchPage;
