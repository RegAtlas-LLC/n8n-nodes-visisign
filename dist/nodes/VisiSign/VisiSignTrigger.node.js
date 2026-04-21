"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisiSignTrigger = void 0;
class VisiSignTrigger {
    constructor() {
        this.description = {
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
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const credentials = await this.getCredentials('visiSignApi');
                    const baseUrl = credentials.baseUrl;
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'visiSignApi', {
                        method: 'GET',
                        url: `${baseUrl}/v1/webhooks`,
                        json: true,
                    });
                    const webhooks = response;
                    for (const webhook of webhooks) {
                        if (webhook.url === webhookUrl) {
                            const webhookData = this.getWorkflowStaticData('node');
                            webhookData.webhookId = webhook.id;
                            return true;
                        }
                    }
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const event = this.getNodeParameter('event');
                    const credentials = await this.getCredentials('visiSignApi');
                    const baseUrl = credentials.baseUrl;
                    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'visiSignApi', {
                        method: 'POST',
                        url: `${baseUrl}/v1/webhooks`,
                        body: {
                            url: webhookUrl,
                            events: [event],
                        },
                        json: true,
                    });
                    const webhookData = this.getWorkflowStaticData('node');
                    webhookData.webhookId = response.id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookId = webhookData.webhookId;
                    if (!webhookId)
                        return true;
                    const credentials = await this.getCredentials('visiSignApi');
                    const baseUrl = credentials.baseUrl;
                    try {
                        await this.helpers.httpRequestWithAuthentication.call(this, 'visiSignApi', {
                            method: 'DELETE',
                            url: `${baseUrl}/v1/webhooks/${webhookId}`,
                        });
                    }
                    catch {
                        // Webhook may have already been deleted
                    }
                    delete webhookData.webhookId;
                    return true;
                },
            },
        };
    }
    async webhook() {
        const body = this.getBodyData();
        return {
            workflowData: [
                this.helpers.returnJsonArray(body),
            ],
        };
    }
}
exports.VisiSignTrigger = VisiSignTrigger;
