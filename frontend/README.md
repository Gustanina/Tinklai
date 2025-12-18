# Reader Frontend

Modern React + TypeScript frontend application for Reader Project Management System.

## Features

- ✅ Responsive layout with breakpoint at 768px
- ✅ Header, Content, Footer with distinct styles
- ✅ Responsive navigation menu (desktop: horizontal, mobile: hamburger)
- ✅ Multiple input types (text, email, password, textarea, select)
- ✅ Transitions and animations throughout the UI
- ✅ Vector icons (Lucide React - SVG icons)
- ✅ Google Fonts (Poppins & Inter)
- ✅ Modal dialogs for forms and information
- ✅ Color scheme with complementary colors
- ✅ Grid layout system
- ✅ Clear and consistent forms
- ✅ Unified design matching project requirements

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Vector icons
- **CSS3** - Styling with animations

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=https://tinklai-production.up.railway.app
```

### Development

Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.tsx   # Navigation header
│   │   ├── Footer.tsx   # Footer component
│   │   └── Modal.tsx    # Modal dialog
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── Tasks.tsx
│   │   └── Comments.tsx
│   ├── services/        # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── taskService.ts
│   │   └── commentService.ts
│   ├── App.tsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json
```

## Design Features

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px
- Hamburger menu on mobile
- Horizontal menu on desktop

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Secondary: Complementary colors
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Warning: Orange (#f59e0b)

### Typography
- Headings: Poppins (Google Fonts)
- Body: Inter (Google Fonts)

### Animations
- Fade in/out
- Slide up/down
- Scale in
- Hover effects
- Loading spinners

### Icons
- Lucide React (SVG icons)
- Consistent sizing
- Color-coded by context

## API Integration

The frontend integrates with the backend API:
- JWT authentication
- Automatic token refresh
- Role-based access control
- Error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

UNLICENSED
