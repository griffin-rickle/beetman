import React, {useState} from 'react';
import { SearchType } from '../types';

interface SearchProps {
    searchType: string;
    setSearchType: Function;
    setSearchResults: Function;
}

function isValidSearchType(value: string): value is SearchType {
    return ["tracks", "albums"].includes(value);
}

const Search: React.FC<SearchProps> = ({ searchType, setSearchType, setSearchResults }: SearchProps) => {
    const [searchInput, setSearchInput] = useState<string>("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchInput(event.target.value);
    }

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        if(isValidSearchType(event.target.value)) {
            setSearchType(event.target.value);
        }
    }

    const onFormSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event?.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/${searchType}/${searchInput}`);
            const data = await response.json()
            setSearchResults(data);
        } catch (error) {

        }
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

export default Search;
