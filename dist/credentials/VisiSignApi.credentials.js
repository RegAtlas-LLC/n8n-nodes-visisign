"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisiSignApi = void 0;
class VisiSignApi {
    constructor() {
        this.name = 'visiSignApi';
        this.displayName = 'VisiSign API';
        this.documentationUrl = 'https://docs.visisign.app';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                placeholder: 'vsk_...',
                description: 'Your VisiSign API key. Found in Settings → API Keys.',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.visisign.app',
                description: 'VisiSign API base URL. Only change for self-hosted or testing.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.VisiSignApi = VisiSignApi;
