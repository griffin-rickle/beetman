import { Album, ApiResult, LibraryItem, LoginResponse, Track } from "./types";

async function _get(url: string): Promise<ApiResult | undefined> {
    try {
        const response = await fetch(url);
        const data = await response.json() as ApiResult;
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

export async function login(username: string, password: string): Promise<LoginResponse> {
    const result = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'username': username, 'password': password})
    });

    return await result.json();
}

export async function search(searchType: string, searchInput: string): Promise<LibraryItem[]> {
    const results = await _get(`http://127.0.0.1:5000/${searchType}/${searchInput}`) as LibraryItem[];
    return results ?? [] as LibraryItem[];
};

export async function getTrack (trackId: number): Promise<Track | undefined> {
    const result = await _get(`http://127.0.0.1:5000/track/${trackId}`);
    if(result) {
        return result as Track;
    }
    return undefined;
}

export async function getAlbum(albumId: number): Promise<Album | undefined> {
    const result = await _get(`http://127.0.0.1:5000/album/${albumId}`);
    if(result) {
        return result as Album;
    }
    return undefined;
}

// TODO: Define UpdateResponse type
interface UpdateResponse {}
export async function updateTrack(trackId: number, track: Track): Promise<UpdateResponse> {
    return _post(`http://127.0.0.1:5000/track/${trackId.toString()}`, track);
}

export async function updateAlbum(albumId: number, album: Album): Promise<UpdateResponse> {
    return _post(`http://127.0.0.1:5000/album/${albumId.toString()}`, album)
}
