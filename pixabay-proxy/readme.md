# Pixabay Proxy Deployment Guide

This guide explains how to set up and deploy the Pixabay Proxy function on
Google Cloud Functions, as well as how to run it locally for development.

---

## 1. Setup

1. **Copy Environment File**  
   Duplicate the example environment file:

   ```bash
   cp .env.example .env
   ```

2. **Configure API Key**  
   Open `.env` and set your `PRIVATE_API_KEY` value.

---

## 2. Prerequisites

- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install)
  installed
- An existing Google Cloud project
- Billing enabled for your project
- Authenticated with gcloud and project set:

  ```bash
  gcloud auth login
  ```

---

## 3. Deploying to Google Cloud

Deploy the Cloud Function (replace `your_actual_api_key` with your real API
key):

```bash
gcloud functions deploy secureProxy \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point secureProxy \
  --set-env-vars PIXABAY_KEY=your_actual_api_key
```

---

## 4. Additional Notes

- Keep your API key secure and do not share it publicly.
- For more details, see the
  [Google Cloud Functions documentation](https://cloud.google.com/functions/docs).

---

## Local Development

To run the proxy locally:

```bash
npm install
npm run proxy-dev
```
