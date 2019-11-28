import config from './config';
import * as I from './interfaces';
const apiUrl = config.apiAddress;

function arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
};

export async function apiV2(url: string, method = 'GET', body?: any) {
    const options: RequestInit = {
        method,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }
    if (body) {
        options.body = JSON.stringify(body)
    }
    let data: any = null;
    return fetch(`${config.isDev ? apiUrl : '/'}api/${url}`, options)
        .then(res => {
            data = res;
            return res.json().catch(_e => data && data.status < 300)
        });
}

export default {
    players: {
        get: async (): Promise<I.Player[]> => await apiV2('players'),
        add: async (player: any) => await apiV2('players', 'POST', player),
        update: async (id: string, player: any) => await apiV2(`players/${id}`, 'PATCH', player),
        delete: async (id: string) => await apiV2(`players/${id}`, 'DELETE'),
        getAvatar: async (id: string) => {
            const response = fetch(`${apiUrl}api/players/avatar/${id}`)
        }
    },
    teams: {
        get: async (): Promise<I.Team[]> => await apiV2('teams'),
        add: async (team: any) => await apiV2('teams', 'POST', team),
        update: async (id: string, team: any) => await apiV2(`teams/${id}`, 'PATCH', team),
        delete: async (id: string) => await apiV2(`teams/${id}`, 'DELETE'),
        getLogo: async (id: string) => {
            const response = await fetch(`${apiUrl}api/teams/logo/${id}`);
            return response;
        }
    },
    config: {
        get: async (): Promise<I.Config> => await apiV2('config'),
        update: async (config: I.Config) => await apiV2('config', 'PATCH', config)
    },
    cfgs: {
        check: async (): Promise<I.CFGGSIResponse> => await apiV2('cfg'),
        create: async (): Promise<I.CFGGSIResponse> => await apiV2('cfg', 'PUT')
    },
    gamestate: {
        check: async (): Promise<I.CFGGSIResponse> => await apiV2('gsi'),
        create: async (): Promise<I.CFGGSIResponse> => await apiV2('gsi', 'PUT')
    },
    huds: {
        get: async (): Promise<I.HUD[]> => await apiV2('huds'),
        start: async (hudDir: string) => await apiV2(`huds/${hudDir}/start`, 'POST'),
        close: async (hudDir: string) => await apiV2(`huds/${hudDir}/close`, 'POST'),
        openDirectory: async() => await apiV2(`huds`, 'POST')
    },
    match: {
        get: async (): Promise<I.Match[]> => await apiV2('match'),
        set: async (match: I.Match[]): Promise<I.Match[]> => apiV2('match', 'PATCH', match)
    },
    files: {
        imgToBase64: async (url: string) => {
            try {
                const response = await fetch(url);
                if(response.status !== 200) {
                    return null;
                }
                const buffer = await response.arrayBuffer();
                return arrayBufferToBase64(buffer);
            } catch(e){
                return null;
            }
        }
    }
}