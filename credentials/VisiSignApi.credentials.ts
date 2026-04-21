import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VisiSignApi implements ICredentialType {
	name = 'visiSignApi';
	displayName = 'VisiSign API';
	documentationUrl = 'https://docs.visisign.app';

	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
