"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisiSign = void 0;
class VisiSign {
    constructor() {
        this.description = {
            displayName: 'VisiSign',
            name: 'visiSign',
            icon: 'file:visisign.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Send, track, and manage e-signatures with VisiSign',
            defaults: {
                name: 'VisiSign',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'visiSignApi',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: '={{$credentials.baseUrl}}/v1',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                // Resource
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Signature Request',
                            value: 'signatureRequest',
                        },
                    ],
                    default: 'signatureRequest',
                },
                // Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create a signature request',
                            description: 'Send a document for signing',
                            routing: {
                                request: {
                                    method: 'POST',
                                    url: '/signature_requests',
                                },
                                send: {
                                    type: 'body',
                                    preSend: [],
                                },
                            },
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get a signature request',
                            description: 'Get the status of a signature request',
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '=/signature_requests/{{$parameter["requestId"]}}',
                                },
                            },
                        },
                        {
                            name: 'Get Many',
                            value: 'getAll',
                            action: 'Get many signature requests',
                            description: 'List all signature requests',
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '/signature_requests',
                                },
                            },
                        },
                        {
                            name: 'Download Signed File',
                            value: 'downloadFile',
                            action: 'Download signed file',
                            description: 'Download the signed PDF for a completed signature request',
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '=/signature_requests/{{$parameter["requestId"]}}/files',
                                    encoding: 'arraybuffer',
                                },
                                output: {
                                    postReceive: [
                                        {
                                            type: 'binaryData',
                                            properties: {
                                                destinationProperty: 'data',
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            name: 'Cancel',
                            value: 'cancel',
                            action: 'Cancel a signature request',
                            description: 'Cancel a sent signature request',
                            routing: {
                                request: {
                                    method: 'POST',
                                    url: '=/signature_requests/{{$parameter["requestId"]}}/cancel',
                                },
                            },
                        },
                        {
                            name: 'Send Reminder',
                            value: 'remind',
                            action: 'Send a reminder',
                            description: 'Send a reminder to a signer',
                            routing: {
                                request: {
                                    method: 'POST',
                                    url: '=/signature_requests/{{$parameter["requestId"]}}/remind',
                                },
                                send: {
                                    type: 'body',
                                    preSend: [],
                                },
                            },
                        },
                    ],
                    default: 'create',
                },
                // --- Fields ---
                // Request ID (for get, download, cancel, remind)
                {
                    displayName: 'Request ID',
                    name: 'requestId',
                    type: 'string',
                    required: true,
                    default: '',
                    placeholder: 'sr_abc123',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['get', 'downloadFile', 'cancel', 'remind'],
                        },
                    },
                    description: 'The ID of the signature request (starts with sr_)',
                },
                // Title (for create)
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    required: true,
                    default: '',
                    placeholder: 'Service Agreement',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['create'],
                        },
                    },
                    description: 'Document title',
                    routing: {
                        send: {
                            type: 'body',
                            property: 'title',
                        },
                    },
                },
                // File URL (for create)
                {
                    displayName: 'File URL',
                    name: 'fileUrl',
                    type: 'string',
                    default: '',
                    placeholder: 'https://example.com/contract.pdf',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['create'],
                        },
                    },
                    description: 'URL of the PDF file to send for signing',
                    routing: {
                        send: {
                            type: 'body',
                            property: 'file_url',
                        },
                    },
                },
                // Signers (for create)
                {
                    displayName: 'Signers',
                    name: 'signers',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    placeholder: 'Add Signer',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        {
                            name: 'signer',
                            displayName: 'Signer',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Email',
                                    name: 'email',
                                    type: 'string',
                                    placeholder: 'name@email.com',
                                    default: '',
                                    required: true,
                                },
                            ],
                        },
                    ],
                    routing: {
                        send: {
                            type: 'body',
                            property: 'signers',
                            value: '={{$parameter["signers"]["signer"]}}',
                        },
                    },
                },
                // Message (for create)
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    typeOptions: {
                        rows: 3,
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['create'],
                        },
                    },
                    description: 'Optional message to include in the signing request email',
                    routing: {
                        send: {
                            type: 'body',
                            property: 'message',
                        },
                    },
                },
                // Email for remind
                {
                    displayName: 'Signer Email',
                    name: 'emailAddress',
                    type: 'string',
                    required: true,
                    default: '',
                    placeholder: 'signer@example.com',
                    displayOptions: {
                        show: {
                            resource: ['signatureRequest'],
                            operation: ['remind'],
                        },
                    },
                    description: 'Email of the signer to remind',
                    routing: {
                        send: {
                            type: 'body',
                            property: 'email_address',
                        },
                    },
                },
            ],
        };
    }
}
exports.VisiSign = VisiSign;
