export type SearchType = "tracks" | "albums"
export type ApiResult = SingleSearchResult | SearchResult

export interface LibraryItem {
    id: number;
    artist: string;
    title: string;
    year: number;
}

export interface Album extends LibraryItem {
    genre: string;
    day: number;
    month: number;
    added: number;
    albumartist: string;
    tracks: Track[];
}

export interface Track extends LibraryItem {
    album: string;
    track: string;
}

export interface SingleSearchResult {
    result: LibraryItem
}

export interface SearchResults {
    results: LibraryItem[]
}
