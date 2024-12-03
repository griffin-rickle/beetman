export type SearchType = "tracks" | "albums"

export interface LibraryItem {
    id: number;
    year: number;
}

export interface Album extends LibraryItem {
    album: string;
    albumartist: string;
    genre: string;
    day: number;
    month: number;
    added: number;
}

export interface Track extends LibraryItem {
    title: string;
    album: string;
    artist: string;
    track: string;
}

export interface SearchResults {
    result: (Album|Track)[]
}
