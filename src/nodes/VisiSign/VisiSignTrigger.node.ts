import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class VisiSignTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VisiSign Trigger',
		name: 'visiSignTrigger',
		icon: 'file:visisign.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts a workflow when a VisiSign event occurs',
		defaults: {
			name: 'VisiSign Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'visiSignApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'signature_request.completed',
				options: [
					{
						name: 'Signature Request Sent',
						value: 'signature_request.sent',
						description: 'A signature request was sent to signers',
					},
					{
						name: 'Signature Request Viewed',
						value: 'signature_request.viewed',
						description: 'A signer opened the signing link',
					},
					{
						name: 'Signature Request Signed',
						value: 'signature_request.signed',
						description: 'A signer completed their signature',
					},
					{
						name: 'Signature Request Completed',
						value: 'signature_request.completed',
						description: 'All signers have completed — document is done',
					},
					{
						name: 'Signature Request Declined',
						value: 'signature_request.declined',
						description: 'A signer declined to sign',
					},
					{
						name: 'Signature Request Cancelled',
						value: 'signature_request.cancelled',
						description: 'The signature request was cancelled',
					},
				],
				description: 'The event that triggers this workflow',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const credentials = await this.getCredentials('visiSignApi');
				const baseUrl = credentials.baseUrl as string;

				const response = await this.helpers.httpRequest({
					method: 'GET' as IHttpRequestMethods,
					url: `${baseUrl}/v1/webhooks`,
					headers: {
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					json: true,
				});

				const webhooks = response as IDataObject[];
				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhook.id;
						return true;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const credentials = await this.getCredentials('visiSignApi');
				const baseUrl = credentials.baseUrl as string;

				const response = await this.helpers.httpRequest({
					method: 'POST' as IHttpRequestMethods,
					url: `${baseUrl}/v1/webhooks`,
					headers: {
						Authorization: `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					},
					body: {
						url: webhookUrl,
						events: [event],
					},
					json: true,
				});

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = (response as IDataObject).id;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) return true;

				const credentials = await this.getCredentials('visiSignApi');
				const baseUrl = credentials.baseUrl as string;

				try {
					await this.helpers.httpRequest({
						method: 'DELETE' as IHttpRequestMethods,
						url: `${baseUrl}/v1/webhooks/${webhookId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
						},
					});
				} catch (error) {
					// Webhook may have already been deleted
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
