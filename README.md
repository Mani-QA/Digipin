# DIGIPIN Generator

A modern web application for generating and managing DIGIPINs - unique location identifiers developed by India Post. This application allows users to generate DIGIPINs from coordinates, create custom named locations, and share them easily.

## Features

- Generate DIGIPINs from latitude and longitude coordinates
- Get current location coordinates automatically
- Create custom named DIGIPINs for easy sharing
- View location details including Google Maps link
- Share locations via WhatsApp
- Responsive and modern UI
- SEO optimized pages
- Fast and lightweight

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Cloudflare KV for storage
- React Hot Toast for notifications
- Headless UI for accessible components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Cloudflare account (for KV storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/digipin-app.git
cd digipin-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application is designed to be deployed on Cloudflare Pages with KV storage. Follow these steps:

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set up the following environment variables in Cloudflare:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
4. Deploy the application

## Usage

1. Enter latitude and longitude coordinates or use the "Use My Location" button
2. Optionally provide a custom name for your DIGIPIN
3. Click "Generate DIGIPIN" to create your DIGIPIN
4. Share the generated DIGIPIN or custom URL with others

## Architecture

The application follows a modern architecture pattern:

- Frontend: Next.js with TypeScript and Tailwind CSS
- API Routes: Next.js API routes for DIGIPIN generation and retrieval
- Storage: Cloudflare KV for storing custom named DIGIPINs
- Routing: Dynamic routes for custom named DIGIPINs

## Security

- All API keys and sensitive information are stored server-side
- Input validation and sanitization
- HTTPS enforced
- Rate limiting on API routes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- India Post for developing the DIGIPIN system
- Next.js team for the amazing framework
- Cloudflare for the infrastructure
