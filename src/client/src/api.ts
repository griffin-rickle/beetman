import { Album, ApiResult, LibraryItem, LoginResponse, Track } from "./types";
import Cookies from 'js-cookie';

async function _get(url: string): Promise<ApiResult | undefined> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include',
        });
        const data = await response.json() as ApiResult;
        return data;
    } catch(error) {
        console.error(error);
    }
    return undefined;
};

async function _post(url: string, data: Track|Album): Promise<UpdateResponse> {
    const csrfToken = Cookies.get('csrf_access_token');
    return fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
};

export async function login(username: string, password: string): Promise<LoginResponse> {
    const result = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({'username': username, 'password': password})
    });

    if(result.status != 200) {
        console.error("Unsuccessful login!")
        const errorMessage = await result.text();
        return {access_token: undefined, error: errorMessage};
    }
    return await result.json();
}

export async function token_check(): Promise<string | null> {
    const result = await _get("/auth/token_check");
    if(result) {
        return "success";
    }
    return null;
}

export async function search(searchType: string, searchInput: string): Promise<LibraryItem[]> {
    const results = await _get(`/api/${searchType}/${searchInput}`) as LibraryItem[];
    //const results = await _get(`http://127.0.0.1:5000/${searchType}/${searchInput}`) as LibraryItem[];
    return results ?? [] as LibraryItem[];
};

export async function getTrack (trackId: number): Promise<Track | undefined> {
    const result = await _get(`/api/track/${trackId}`);
    if(result) {
        return result as Track;
    }
    return undefined;
}

export async function getAlbum(albumId: number): Promise<Album | undefined> {
    const result = await _get(`/api/album/${albumId}`);
    if(result) {
        return result as Album;
    }
    return undefined;
}

// TODO: Define UpdateResponse type
interface UpdateResponse {}
export async function updateTrack(trackId: number, track: Track): Promise<UpdateResponse> {
    return _post(`/api/track/${trackId.toString()}`, track);
}

export async function updateAlbum(albumId: number, album: Album): Promise<UpdateResponse> {
    return _post(`/api/album/${albumId.toString()}`, album)
}
