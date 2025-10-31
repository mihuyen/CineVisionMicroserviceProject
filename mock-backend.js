const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data
const mockMovies = [
    {
        id: 1,
        name: "Avengers: Endgame",
        description: "The epic conclusion to the Infinity Saga",
        releaseDate: "2019-04-26",
        duration: 181,
        category: { name: "Action" },
        director: { firstName: "Anthony", lastName: "Russo" },
        actors: [
            { firstName: "Robert", lastName: "Downey Jr." },
            { firstName: "Chris", lastName: "Evans" }
        ],
        movieImages: [
            { imageUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
        ]
    },
    {
        id: 2,
        name: "Spider-Man: No Way Home",
        description: "Spider-Man's identity is revealed",
        releaseDate: "2021-12-17", 
        duration: 148,
        category: { name: "Action" },
        director: { firstName: "Jon", lastName: "Watts" },
        actors: [
            { firstName: "Tom", lastName: "Holland" },
            { firstName: "Zendaya", lastName: "" }
        ],
        movieImages: [
            { imageUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" }
        ]
    }
];

// API Routes
app.get('/api/movie/movies/displayingMovies', (req, res) => {
    console.log('GET /api/movie/movies/displayingMovies');
    res.json(mockMovies);
});

app.get('/api/movie/movies/comingSoonMovies', (req, res) => {
    console.log('GET /api/movie/movies/comingSoonMovies');
    res.json(mockMovies.slice(0, 1)); // Return fewer movies for coming soon
});

app.get('/api/movie/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = mockMovies.find(m => m.id === movieId);
    
    if (movie) {
        console.log(`GET /api/movie/movies/${movieId}`);
        res.json(movie);
    } else {
        res.status(404).json({ error: 'Movie not found' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mock Backend is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
    console.log(`📺 Available endpoints:`);
    console.log(`   GET http://localhost:${PORT}/api/movie/movies/displayingMovies`);
    console.log(`   GET http://localhost:${PORT}/api/movie/movies/comingSoonMovies`);
    console.log(`   GET http://localhost:${PORT}/api/movie/movies/:id`);
    console.log(`   GET http://localhost:${PORT}/health`);
    console.log(`🎬 Frontend should now work at http://localhost:3000`);
});