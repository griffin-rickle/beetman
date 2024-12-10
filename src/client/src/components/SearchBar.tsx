import React, {useState} from 'react';
import { search } from '../api';
import { SearchType } from '../types';

interface SearchProps {
    searchType: SearchType;
    setSearchType: Function;
    setSearchResults: Function;
}

const SearchBar: React.FC<SearchProps> = ({ searchType, setSearchType, setSearchResults }: SearchProps) => {
    const [searchInput, setSearchInput] = useState<string>("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchInput(event.target.value);
    }

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        setSearchType(event.target.value);
    }

    const onFormSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event?.preventDefault();
        setSearchResults(await search(searchType, searchInput));
    }

    return (
        <form onSubmit={onFormSubmit}>
            <input
                type="text"
                placeholder="Search here"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(event)}
                value={searchInput}/>
            <select value={searchType}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleSearchTypeChange(event)}>
                <option value="tracks">Tracks</option>
                <option value="albums">Albums</option>
            </select>
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar;
