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

Import any of these into n8n: **Settings → Import from File**, or paste the JSON into a new workflow.

### Send contracts automatically when deals close

CRM deal closes → send contract → wait for signature → update CRM status + notify team.

1. **Webhook:** Receives deal-closed event from your CRM
2. **VisiSign → Create:** Sends contract with deal name and contact info
3. **VisiSign Trigger:** Fires when all signers complete
4. **HTTP Request:** Updates CRM deal status to "contract_signed"

**[Import workflow JSON](examples/crm-to-contract.json)**

<details>
<summary>Workflow nodes</summary>

- Deal Closed Webhook (from HubSpot, Pipedrive, Salesforce, etc.)
- VisiSign: Create signature request
- VisiSign Trigger: signature_request.completed
- If: Check completion status
- HTTP Request: Update CRM deal
- Email: Notify sales team

</details>

### Automatically send NDAs from form submissions

Form submitted → send NDA → wait for signature → email signed copy + notify Slack.

1. **Webhook:** Receives form submission (Typeform, Tally, Webflow, etc.)
2. **VisiSign → Create:** Sends NDA to the submitter
3. **VisiSign Trigger:** Fires when signer completes
4. **VisiSign → Download:** Gets the signed PDF
5. **Email:** Sends signed copy back to the signer

**[Import workflow JSON](examples/form-to-nda.json)**

<details>
<summary>Workflow nodes</summary>

- Form Submitted Webhook
- VisiSign: Create signature request (NDA)
- Respond to Webhook (confirms submission)
- VisiSign Trigger: signature_request.signed
- VisiSign: Download signed file
- Email: Send confirmation with signed PDF attached
- HTTP Request: Notify Slack channel

</details>

### Send contracts after payment automatically

Stripe payment → send agreement → wait for signature → provision account + archive PDF.

1. **Webhook:** Receives Stripe checkout.session.completed
2. **VisiSign → Create:** Sends service agreement to the customer
3. **VisiSign Trigger:** Fires when agreement is signed
4. **HTTP Request:** Provisions the customer's account
5. **Email:** Sends welcome email

**[Import workflow JSON](examples/payment-to-agreement.json)**

<details>
<summary>Workflow nodes</summary>

- Stripe Payment Webhook
- If: Verify checkout.session.completed event
- VisiSign: Create signature request (agreement)
- VisiSign Trigger: signature_request.completed
- HTTP Request: Provision account in your app
- Email: Send welcome email
- VisiSign: Download signed agreement
- HTTP Request: Archive PDF to S3

</details>

## Resources

- [VisiSign website](https://visisign.app)
- [VisiSign API documentation](https://docs.visisign.app)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
