# MultIris - Secure Multisig Wallet with World ID Authentication

MultIris is a secure and user-friendly multisignature wallet application that leverages World ID verification to ensure that only real humans can create and manage wallets. The application combines the security benefits of multisignature wallets with the uniqueness guarantees of World ID's biometric verification.

## Key Features

- **World ID Authentication**: Verify users are unique humans through iris-based biometric verification
- **Multisignature Security**: Require multiple approvals for any transaction, preventing single points of failure
- **Customizable Governance**: Set personalized threshold requirements for transaction approvals
- **Mobile-First Design**: Optimized for smartphones with an intuitive and accessible interface
- **Testnet Integration**: Test the application safely with Sepolia testnet before using real assets

## Screenshots

### Authentication Screen
![Authentication Screen with World ID](screenshot-placeholder-1.png)

### Wallet Creation
![Creating a new multisig wallet](screenshot-placeholder-2.png)

### Dashboard
![Wallet dashboard overview](screenshot-placeholder-3.png)

### Transaction Details
![Transaction approval interface](screenshot-placeholder-4.png)

### Members Management
![Adding and managing wallet members](screenshot-placeholder-5.png)

## How It Works

MultIris provides a simple yet powerful solution for managing digital assets securely:

1. **Authentication**: Users verify their identity through World ID, ensuring one person can't create multiple accounts
2. **Wallet Creation**: Create a multisignature wallet and add trusted co-signers
3. **Threshold Setting**: Choose how many approvals are needed for each transaction
4. **Transaction Management**: Initiate, review, and approve transactions with multiple verifications
5. **Activity Monitoring**: Track all pending and completed transactions in one place

## Technology Stack

MultIris is built with modern web technologies:

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Tailwind CSS, Radix UI
- **Blockchain Interaction**: Viem
- **Authentication**: World ID (via MiniKit integration)

## Getting Started

To run the application locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/multiris.git
cd multiris

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

## World ID Integration

The application uses World ID for unique human verification. This prevents Sybil attacks where one person could create multiple accounts to manipulate transaction approvals. Key components of our World ID integration:

- `MiniKitProvider`: Manages connection with the World App
- `VerifyWithWorld`: Handles the verification flow
- Authentication data is stored securely and associated with each user's wallet

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Deploying to Vercel

This project is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Set required environment variables in the Vercel dashboard
3. Deploy the application

## Project Structure

```
multiris/
├── app/                   # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── create-wallet/     # Wallet creation flow
│   └── transaction/       # Transaction handling
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

## Contributing

We welcome contributions to MultIris! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.

---

*MultIris: Securing digital assets through human verification and collective decisions.* 