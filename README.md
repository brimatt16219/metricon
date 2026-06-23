# metricon

AI-powered comparison tool for anything — products, brands, universities, services, and more.

Built with Next.js, FastAPI, and Claude.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Python, FastAPI, Uvicorn
- **AI:** Claude API (Anthropic)
- **Search:** Tavily (coming soon)

## Project Structure

```
metricon/
├── frontend/   # Next.js app
└── backend/    # FastAPI server
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file in `backend/` using `.env.example` as a template:

```
ANTHROPIC_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

Start the server:

```bash
uvicorn main:app --reload
```

Server runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Features

- Compare any items across any category
- AI-generated attribute breakdown powered by Claude
- Grid view, card view, and 9 chart types (bar, grouped bar, radar, line, scatter, bubble, heatmap, treemap, lollipop)
- AI recommendation summary

## License

MIT
