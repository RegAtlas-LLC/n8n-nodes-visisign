# n8n-nodes-visisign

This is an n8n community node for [VisiSign](https://visisign.app) — flat-rate e-signatures with full API access.

Send, track, and automate legally binding electronic signatures directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**npm:** `npm install n8n-nodes-visisign`

## Credentials

You need a VisiSign API key to use this node.

1. Sign up at [visisign.app](https://app.visisign.app/signup)
2. Go to **Settings → API Keys**
3. Create a new API key
4. In n8n, create new **VisiSign API** credentials and paste your key

## Nodes

### VisiSign

Perform actions on signature requests.

| Operation | Description |
|---|---|
| **Create** | Send a document for signing with one or more signers |
| **Get** | Get the status of a signature request |
| **Get Many** | List all signature requests |
| **Download Signed File** | Download the completed signed PDF |
| **Cancel** | Cancel a sent signature request |
| **Send Reminder** | Send a reminder to a pending signer |

### VisiSign Trigger

Start a workflow when a VisiSign event occurs. Automatically registers a webhook in your VisiSign account.

| Event | Description |
|---|---|
| `signature_request.sent` | A signature request was sent |
| `signature_request.viewed` | A signer opened the signing link |
| `signature_request.signed` | A signer completed their signature |
| `signature_request.completed` | All signers completed — document is done |
| `signature_request.declined` | A signer declined to sign |
| `signature_request.cancelled` | The request was cancelled |

## Example Workflows

### CRM → Contract

1. **Trigger:** New deal in HubSpot / Pipedrive
2. **VisiSign → Create:** Send contract to the contact
3. **VisiSign Trigger:** Wait for completion
4. **Action:** Update CRM deal status

### Form → NDA

1. **Trigger:** New Typeform / form submission
2. **VisiSign → Create:** Send NDA to the submitter
3. **VisiSign Trigger:** Wait for signature
4. **Action:** Send confirmation email

### Payment → Agreement

1. **Trigger:** Stripe payment succeeded
2. **VisiSign → Create:** Send service agreement
3. **VisiSign Trigger:** Signed
4. **Action:** Provision account, update database

## Resources

- [VisiSign website](https://visisign.app)
- [VisiSign API documentation](https://docs.visisign.app)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
