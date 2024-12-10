import { Album, Track } from "./types";
import { SearchResults } from "./types";

async function _get(url: string): Promise<SearchResults | undefined> {
    try {
        const response = await fetch(url);
        const data = await response.json() as SearchResults;
        return data;
    } catch(error) {
        console.error(error);
    }
    return undefined;
};

async function _post(url: string, data: Track|Album): Promise<UpdateResponse> {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
};

export async function search(searchType: string, searchInput: string): Promise<SearchResults> {
    const results = await _get(`http://127.0.0.1:5000/${searchType}/${searchInput}`);
    return results ?? { result: [] } as SearchResults;
};

export async function getTrack (trackId: number): Promise<Track | undefined> {
    const results = await _get(`http://127.0.0.1:5000/tracks/${trackId}`);
    if(results?.result && results?.result.length == 1) {
        return results?.result[0] as Track;
    }
    console.error(`More than one track returned for id ${trackId}`);
    return undefined;
}

interface UpdateResponse {}
export async function updateTrack(trackId: number, track: Track): Promise<UpdateResponse> {
    return _post(`http://127.0.0.1:5000/tracks/${trackId.toString()}`, track);
}
