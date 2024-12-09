export type SearchType = "tracks" | "albums"

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
}

export interface Track extends LibraryItem {
    album: string;
    track: string;
}

export interface SearchResults {
    result: LibraryItem[]
}
