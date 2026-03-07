# Restaurant POS System - Frontend

A modern, responsive frontend for the Restaurant POS (Point of Sale) System. Built with React 19, this application provides an intuitive interface for cashiers, highly visible Kitchen Display System (KDS) for cooks, and comprehensive management dashboards for administrators.

## Features

- **Role-Based Access Control**: Tailored interfaces for `admin`, `cashier`, and `kitchen` staff.
- **Real-Time Kitchen Display System (KDS)**: Instant order updates via Socket.IO.
- **Order & Table Management**: Streamlined order intake and table status tracking.
- **Payment Processing**: Immutable payment records and billing management.
- **Modern UI/UX**: Clean, accessible, and responsive design powered by shadcn/ui and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running backend server (see `../backend/README.md`)

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Framework**: [React 19](https://react.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

### Available Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Runs TypeScript checks and builds the app for production.
- `npm run type-check` - Validates TypeScript.

## Documentation & Support

- Refer to the project's technical instructions in `.github/copilot-instructions.md`.
- For component guidelines, see the `.github/instructions/frontend.instructions.md`.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Please ensure your code follows the established ESLint and TypeScript configurations.
