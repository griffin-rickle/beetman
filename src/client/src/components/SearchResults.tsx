import React from 'react';
import { LibraryItem, SearchType } from '../types';
import CONFIG from '../config';

interface SearchResultsProps {
    searchResults: LibraryItem[],
    searchType: SearchType
}

const SearchResultTable: React.FC<SearchResultsProps> = ({searchType, searchResults}: SearchResultsProps) => {
    const headers: string[] = CONFIG.fields[searchType];
    if (!searchResults) {
        return <></>
    }

    // TODO: Fix type errors in the maps
    return (
        <>
        <div className="p-2">
          <table>
            <thead>
                <tr>
                    {headers.map((key: string) => {
                        return <td>{key}</td>
                    })}
                </tr>
            </thead>
            <tbody>
                {searchResults.map((searchResult: LibraryItem) => {
                    return (
                        <tr>
                            {headers.map((key: string) => {
                                let value;
                                if (key === 'id') {
                                    const linkBase = searchType.slice(0, -1);
                                    value = <a href={`/${linkBase}/${searchResult[key]}`}>{searchResult[key]}</a>
                                } else {
                                    value = searchResult[key]
                                }
                                return <td>{value}</td>
                            })}
                        </tr>
                    )})
                }
            </tbody>
          </table>
          <div className="h-4" />
        </div>
        </>
    );
};

export default SearchResultTable;
