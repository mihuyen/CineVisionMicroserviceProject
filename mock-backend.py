#!/usr/bin/env python3
"""
Mock Backend Server for CineVision Frontend
Runs on port 8080 to serve mock movie data
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse as urlparse
import time

# Mock data
MOCK_MOVIES = [
    {
        "movieId": 1,
        "movieName": "Avengers: Endgame",
        "description": "The epic conclusion to the Infinity Saga that changed the Marvel Cinematic Universe forever.",
        "releaseDate": "2019-04-26",
        "duration": 181,
        "categoryName": "Action",
        "directorName": "Anthony Russo",
        "movieImageUrl": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        "movieTrailerUrl": "https://www.youtube.com/watch?v=TcMBFSGVi1c"
    },
    {
        "movieId": 2,
        "movieName": "Spider-Man: No Way Home", 
        "description": "Spider-Man's identity is revealed and he asks Doctor Strange for help.",
        "releaseDate": "2021-12-17",
        "duration": 148,
        "categoryName": "Action",
        "directorName": "Jon Watts",
        "movieImageUrl": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        "movieTrailerUrl": "https://www.youtube.com/watch?v=JfVOs4VSpmA"
    },
    {
        "movieId": 3,
        "movieName": "The Batman",
        "description": "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
        "releaseDate": "2022-03-04",
        "duration": 176,
        "categoryName": "Action",
        "directorName": "Matt Reeves",
        "movieImageUrl": "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
        "movieTrailerUrl": "https://www.youtube.com/watch?v=mqqft2x_Aa4"
    }
    ,
    {
        "movieId": 4,
        "movieName": "Parasite",
        "description": "A darkly comedic thriller about class, deception and survival, as the impoverished Kim family schemes to become employed by the wealthy Park family.",
        "releaseDate": "2019-05-30",
        "duration": 132,
        "categoryName": "Drama",
        "directorName": "Bong Joon-ho",
        "movieImageUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        "movieTrailerUrl": "https://www.youtube.com/watch?v=SEUXfv87Wpk"
    },
    {
        "movieId": 5,
        "movieName": "Train to Busan",
        "description": "During a train ride from Seoul to Busan, a father and his daughter fight to survive a sudden zombie outbreak that spreads rapidly among passengers.",
        "releaseDate": "2016-07-20",
        "duration": 118,
        "categoryName": "Horror",
        "directorName": "Yeon Sang-ho",
        "movieImageUrl": "https://upload.wikimedia.org/wikipedia/en/9/95/Train_to_Busan.jpg",
        "movieTrailerUrl": "https://www.youtube.com/watch?v=qp4N1JL0z8I"
    }
]

# Additional mock collections for admin flows
MOCK_CATEGORIES = [
    {"categoryId": 1, "categoryName": "Action"},
    {"categoryId": 2, "categoryName": "Adventure"},
    {"categoryId": 3, "categoryName": "Drama"},
]

MOCK_DIRECTORS = [
    {"directorId": 1, "directorName": "Anthony Russo"},
    {"directorId": 2, "directorName": "Jon Watts"},
    {"directorId": 3, "directorName": "Matt Reeves"},
]

MOCK_ACTORS = [
    {"actorId": 1, "actorName": "Robert Downey Jr."},
    {"actorId": 2, "actorName": "Chris Evans"},
    {"actorId": 3, "actorName": "Scarlett Johansson"},
]

NEXT_IDS = {
    "movieId": 100,
    "directorId": 100,
    "actorId": 100,
}

# In-memory store for comments added via mock API
# Map: movieId -> list of comment dicts
NEW_COMMENTS = {}
NEXT_COMMENT_ID = 1000

class MockBackendHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_path = urlparse.urlparse(self.path)
        path = parsed_path.path
        
        try:
            # Root index for quick discovery
            if path == '/' or path == '':
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                endpoints = {
                    "message": "Mock Backend is running (mock-backend.py)",
                    "try": [
                        "/health",
                        "/version",
                        "/api/movie/movies/displayingMovies",
                        "/api/movie/movies/comingSoonMovies",
                        "/api/movie/movies/{id}",
                        "/api/movie/comments/getCommentsByMovieId/{id}/{page}/{size}",
                        "/api/movie/comments/getCountOfComments/{id}",
                        "POST /api/movie/comments/add",
                        "POST /api/movie/comments/delete"
                    ]
                }
                self.wfile.write(json.dumps(endpoints).encode())
                print("✅ Served root index (mock-backend.py)")
                return

            if path == '/api/movie/movies/displayingMovies':
                try:
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    response = json.dumps(MOCK_MOVIES)
                    self.wfile.write(response.encode())
                    print("✅ Served displaying movies")
                except (ConnectionAbortedError, BrokenPipeError):
                    print("🔌 Client disconnected during response")
                    return
                
            elif path == '/api/movie/movies/comingSoonMovies':
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                # Return only first movie for coming soon
                response = json.dumps(MOCK_MOVIES[:1])
                self.wfile.write(response.encode())
                print("✅ Served coming soon movies")
                
            elif path.startswith('/api/movie/movies/'):
                # Get specific movie by ID
                movie_id_str = path.split('/')[-1]
                
                # Handle undefined case
                if movie_id_str == 'undefined' or not movie_id_str.isdigit():
                    # Return first movie as default
                    movie = MOCK_MOVIES[0] if MOCK_MOVIES else None
                    movie_id = movie['movieId'] if movie else 1
                else:
                    movie_id = int(movie_id_str)
                    movie = next((m for m in MOCK_MOVIES if m['movieId'] == movie_id), None)
                
                if movie:
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    response = json.dumps(movie)
                    self.wfile.write(response.encode())
                    print(f"✅ Served movie ID: {movie_id} (requested: {movie_id_str})")
                else:
                    self.send_response(404)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(b'{"error": "Movie not found"}')
                    print(f"❌ Movie not found: {movie_id} (requested: {movie_id_str})")
                    
            elif path.startswith('/api/movie/actors/getActorsByMovieId/'):
                # Get actors by movie ID - mock actors data
                movie_id_str = path.split('/')[-1]
                mock_actors = [
                    {"firstName": "Robert", "lastName": "Downey Jr."},
                    {"firstName": "Chris", "lastName": "Evans"},
                    {"firstName": "Scarlett", "lastName": "Johansson"}
                ]
                
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_actors)
                self.wfile.write(response.encode())
                print(f"✅ Served actors for movie: {movie_id_str}")
                
            elif path.startswith('/api/movie/cities/getCitiesByMovieId/'):
                # Get cities by movie ID - mock cities data
                mock_cities = [
                    {"cityId": 1, "cityName": "Ho Chi Minh City"},
                    {"cityId": 2, "cityName": "Ha Noi"},
                    {"cityId": 3, "cityName": "Da Nang"}
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_cities)
                self.wfile.write(response.encode())
                print("✅ Served cities")
                
            elif path.startswith('/api/movie/saloons/getSaloonsByCityId/'):
                # Get saloons by city ID - mock saloons data
                mock_saloons = [
                    {
                        "saloonId": 1,
                        "saloonName": "CGV Vincom Center",
                        "cityId": 1
                    },
                    {
                        "saloonId": 2, 
                        "saloonName": "Galaxy Cinema",
                        "cityId": 1
                    },
                    {
                        "saloonId": 3,
                        "saloonName": "Lotte Cinema",
                        "cityId": 1
                    }
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_saloons)
                self.wfile.write(response.encode())
                print("✅ Served saloons")
            
            elif path == '/api/movie/saloons/getall':
                # Get all saloons
                mock_saloons = [
                    {"saloonId": 1, "saloonName": "CGV Vincom Center", "cityId": 1},
                    {"saloonId": 2, "saloonName": "Galaxy Cinema", "cityId": 1},
                    {"saloonId": 3, "saloonName": "Lotte Cinema", "cityId": 1},
                    {"saloonId": 4, "saloonName": "CGV Landmark", "cityId": 2},
                    {"saloonId": 5, "saloonName": "BHD Star Cinema", "cityId": 2}
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_saloons)
                self.wfile.write(response.encode())
                print("✅ Served all saloons")
            
            elif path == '/api/movie/cities/getall':
                # Get all cities
                mock_cities = [
                    {"cityId": 1, "cityName": "Ho Chi Minh City"},
                    {"cityId": 2, "cityName": "Ha Noi"}, 
                    {"cityId": 3, "cityName": "Da Nang"},
                    {"cityId": 4, "cityName": "Can Tho"},
                    {"cityId": 5, "cityName": "Hai Phong"}
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_cities)
                self.wfile.write(response.encode())
                print("✅ Served all cities")

            elif path == '/api/movie/actors/getall':
                # Get all actors
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(MOCK_ACTORS)
                self.wfile.write(response.encode())
                print("✅ Served all actors")

            elif path == '/api/movie/directors/getall':
                # Get all directors
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(MOCK_DIRECTORS)
                self.wfile.write(response.encode())
                print("✅ Served all directors")

            elif path == '/api/movie/categories/getall':
                # Get all categories
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(MOCK_CATEGORIES)
                self.wfile.write(response.encode())
                print("✅ Served all categories")
                
            elif path.startswith('/api/movie/comments/getCountOfComments/'):
                # Get comment count - combine static + new ones
                try:
                    movie_id = int(path.split('/')[-1])
                except Exception:
                    movie_id = None
                static_count = 2  # matches the two static examples below
                dynamic_count = len(NEW_COMMENTS.get(movie_id, [])) if movie_id else 0
                total = static_count + dynamic_count
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                # Return plain number to fit frontend usage
                self.wfile.write(json.dumps(total).encode())
                print(f"✅ Served comment count for movie {movie_id}: {total}")
                
            elif '/api/movie/comments/getCommentsByMovieId/' in path:
                # Get comments by movie ID - mock comments (adapt to frontend expected shape)
                try:
                    parts = path.strip('/').split('/')
                    # .../getCommentsByMovieId/{movieId}/{page}/{size}
                    movie_id = int(parts[-3]) if len(parts) >= 3 else None
                except Exception:
                    movie_id = None

                static_comments = [
                    {
                        "commentId": 1,
                        "commentText": "Great movie! Highly recommend.",
                        "commentBy": "John Doe",
                        "commentByUserId": "user_john",
                        "createdAt": "2023-10-01"
                    },
                    {
                        "commentId": 2,
                        "commentText": "Amazing visual effects and storyline.",
                        "commentBy": "Jane Smith",
                        "commentByUserId": "user_jane",
                        "createdAt": "2023-10-02"
                    }
                ]

                combined = list(static_comments)
                if movie_id and movie_id in NEW_COMMENTS:
                    combined = NEW_COMMENTS[movie_id] + combined  # newest first

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(combined)
                self.wfile.write(response.encode())
                print(f"✅ Served comments for movie {movie_id}, total {len(combined)}")
            
            elif path.startswith('/api/movie/saloonTimes/getSaloonTimesByMovieId/'):
                # Get saloon times by movie ID - mock showtime data
                mock_saloon_times = [
                    {
                        "id": 1,
                        "movieBeginTime": "14:00",
                        "movieDate": "2025-10-30",
                        "saloonName": "Saloon A",
                        "movieId": 1
                    },
                    {
                        "id": 2,
                        "movieBeginTime": "17:30",
                        "movieDate": "2025-10-30", 
                        "saloonName": "Saloon B",
                        "movieId": 1
                    },
                    {
                        "id": 3,
                        "movieBeginTime": "20:00",
                        "movieDate": "2025-10-30",
                        "saloonName": "Saloon A", 
                        "movieId": 1
                    }
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_saloon_times)
                self.wfile.write(response.encode())
                print("✅ Served saloon times")
            
            elif path.startswith('/api/movie/saloonTimes/getMovieSaloonTimeSaloonAndMovieId/'):
                # Get movie saloon times by saloon ID and movie ID - return array
                mock_saloon_times = [
                    {
                        "id": 1,
                        "movieBeginTime": "14:00",
                        "movieDate": "2025-10-30",
                        "saloonName": "CGV Vincom Center",
                        "movieId": 1,
                        "saloonId": 1
                    },
                    {
                        "id": 2,
                        "movieBeginTime": "17:30",
                        "movieDate": "2025-10-30",
                        "saloonName": "CGV Vincom Center", 
                        "movieId": 1,
                        "saloonId": 1
                    },
                    {
                        "id": 3,
                        "movieBeginTime": "20:00",
                        "movieDate": "2025-10-30",
                        "saloonName": "CGV Vincom Center",
                        "movieId": 1,
                        "saloonId": 1
                    }
                ]
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps(mock_saloon_times)
                self.wfile.write(response.encode())
                print("✅ Served specific saloon times")
                    
            elif path == '/health':
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "OK", "message": "Mock Backend is running"})
                self.wfile.write(response.encode())
                print("✅ Health check")
            
            elif path == '/version':
                # Simple version info for this script
                payload = {
                    "name": "mock-backend",
                    "version": "v2",
                    "commentsBuckets": len(NEW_COMMENTS),
                    "movies": len(MOCK_MOVIES)
                }
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(payload).encode())
                print("✅ Served version info (mock-backend.py)")
                
            else:
                self.send_response(404)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "Endpoint not found"}')
                print(f"❌ Unknown endpoint: {path}")
                
        except ConnectionAbortedError:
            # Client disconnected, ignore silently
            print("🔌 Client disconnected")
            return
        except BrokenPipeError:
            # Broken pipe, ignore silently  
            print("🔧 Broken pipe")
            return
        except Exception as e:
            try:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = json.dumps({"error": str(e)})
                self.wfile.write(error_response.encode())
                print(f"💥 Error: {e}")
            except (ConnectionAbortedError, BrokenPipeError):
                print("🔌 Client disconnected during error response")
                return

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        try:
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
        except (ConnectionAbortedError, BrokenPipeError):
            print("🔌 Client disconnected during OPTIONS")
            return

    def do_POST(self):
        """Handle POST requests"""
        try:
            path = self.path
            # normalize path to avoid trailing slash mismatches
            normalized_path = path.rstrip('/') if path != '/' else path
            print(f"📥 POST request to: {path}")
            
            if normalized_path == '/api/movie/payments/sendTicketDetail':
                # Get the content length and read the request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                try:
                    # Parse the JSON data
                    ticket_data = json.loads(post_data.decode('utf-8'))
                    print(f"🎫 Received ticket data: {ticket_data}")
                    
                    # Mock successful payment response
                    payment_response = {
                        "success": True,
                        "message": "Ticket booked successfully!",
                        "ticketId": "TK" + str(int(time.time())),
                        "bookingDetails": {
                            "movieTitle": ticket_data.get("movieTitle", "Unknown Movie"),
                            "seats": ticket_data.get("chairNumbers", []),
                            "totalPrice": ticket_data.get("totalPrice", 0),
                            "bookingTime": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                    }
                    
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    response = json.dumps(payment_response)
                    self.wfile.write(response.encode())
                    print("✅ Payment processed successfully")
                    
                except json.JSONDecodeError:
                    self.send_response(400)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    error_response = json.dumps({"error": "Invalid JSON data"})
                    self.wfile.write(error_response.encode())
                    print("❌ Invalid JSON in payment request")
                    
            elif normalized_path == '/api/movie/directors/add':
                # Create a new director
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    data = {}
                NEXT_IDS["directorId"] += 1
                new_director = {
                    "directorId": NEXT_IDS["directorId"],
                    "directorName": data.get("directorName", "Unknown Director")
                }
                MOCK_DIRECTORS.append(new_director)
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"data": new_director}).encode())
                print("✅ Director added")

            elif normalized_path == '/api/movie/movies/add':
                # Create a new movie
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    data = {}
                NEXT_IDS["movieId"] += 1
                new_movie = {
                    "movieId": NEXT_IDS["movieId"],
                    "movieName": data.get("movieName", "New Movie"),
                    "description": data.get("description", ""),
                    "releaseDate": data.get("releaseDate", time.strftime("%Y-%m-%d")),
                    "duration": data.get("duration", 120),
                    "categoryName": "",
                    "directorName": "",
                    "movieImageUrl": data.get("imageUrl", ""),
                    "movieTrailerUrl": data.get("trailerUrl", "")
                }
                MOCK_MOVIES.append(new_movie)
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"data": {"movieId": new_movie["movieId"]}}).encode())
                print("✅ Movie added")

            elif normalized_path == '/api/movie/actors/add':
                # Accept actor list for a movie; just acknowledge
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
                print("✅ Actors added to movie (mock)")

            elif normalized_path == '/api/movie/cities/add':
                # Accept city list for a movie; just acknowledge
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
                print("✅ Cities added to movie (mock)")

            elif normalized_path == '/api/movie/images/add':
                # Accept movie image; just acknowledge
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
                print("✅ Movie image added (mock)")

            elif normalized_path.endswith('/comments/add'):
                # Add a new comment
                global NEXT_COMMENT_ID
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    data = {}

                movie_id = None
                try:
                    movie_id = int(data.get('movieId'))
                except Exception:
                    pass

                NEXT_COMMENT_ID += 1
                new_comment = {
                    "commentId": NEXT_COMMENT_ID,
                    "commentText": data.get("commentText", ""),
                    "commentBy": data.get("commentBy", "Ẩn danh"),
                    "commentByUserId": data.get("commentByUserId", "user_anonymous"),
                    "createdAt": time.strftime("%Y-%m-%d")
                }

                if movie_id:
                    NEW_COMMENTS.setdefault(movie_id, [])
                    # Prepend so newest first
                    NEW_COMMENTS[movie_id] = [new_comment] + NEW_COMMENTS[movie_id]

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(new_comment).encode())
                print(f"✅ Comment added for movie {movie_id}: {new_comment}")

            elif normalized_path.endswith('/comments/delete'):
                # Delete a comment by id
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    data = {}

                comment_id = data.get('commentId')
                removed = False
                if comment_id is not None:
                    for mid, lst in NEW_COMMENTS.items():
                        new_list = [c for c in lst if c.get('commentId') != comment_id]
                        if len(new_list) != len(lst):
                            NEW_COMMENTS[mid] = new_list
                            removed = True
                            break

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "removed": removed}).encode())
                print(f"🗑️ Comment delete requested, removed={removed}")

            elif normalized_path in ('/api/user/users/add', '/api/users/add', '/users/add'):
                # User registration endpoint (mock)
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"

                try:
                    user_data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    user_data = {}

                registration_response = {
                    "success": True,
                    "message": "User registered successfully!",
                    "userId": "USER" + str(int(time.time())),
                    "userDetails": {
                        "email": user_data.get("email", ""),
                        "name": user_data.get("customerName", ""),
                        "registeredAt": time.strftime("%Y-%m-%d %H:%M:%S")
                    }
                }

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(registration_response).encode())
                print("✅ User registered successfully (mock)")

            elif normalized_path.endswith('/auth/login'):
                # User login endpoint (mock)
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length else b"{}"

                try:
                    login_data = json.loads(post_data.decode('utf-8'))
                except Exception:
                    login_data = {}

                # Very simple mock: any email/password returns a token
                auth_response = {
                    "token": "mock-jwt-token-" + str(int(time.time())),
                    "email": login_data.get("email", ""),
                    "fullName": "CineVision User",
                    "roles": ["CUSTOMER"]
                }

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(auth_response).encode())
                print("✅ User login successful (mock)")

            else:
                self.send_response(404)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = json.dumps({"error": "POST endpoint not found"})
                self.wfile.write(error_response.encode())
                print(f"❌ Unknown POST endpoint: {path}")
                
        except (ConnectionAbortedError, BrokenPipeError):
            print("🔌 Client disconnected during POST")
            return
        except Exception as e:
            try:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = json.dumps({"error": str(e)})
                self.wfile.write(error_response.encode())
                print(f"💥 POST Error: {e}")
            except (ConnectionAbortedError, BrokenPipeError):
                print("🔌 Client disconnected during error response")
                return

def run_server():
    server_address = ('localhost', 8080)
    httpd = HTTPServer(server_address, MockBackendHandler)
    
    print("🚀 Mock Backend Server starting...")
    print(f"📍 Server running at http://localhost:8080")
    print("📺 Available endpoints (mock-backend.py v2):")
    print("   GET http://localhost:8080/api/movie/movies/displayingMovies")
    print("   GET http://localhost:8080/api/movie/movies/comingSoonMovies") 
    print("   GET http://localhost:8080/api/movie/movies/{id}")
    print("   GET http://localhost:8080/health")
    print("   POST http://localhost:8080/api/movie/comments/add")
    print("   POST http://localhost:8080/api/movie/comments/delete")
    print("🎬 Frontend should now work at http://localhost:3000")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopping...")
        httpd.server_close()
        print("✅ Server stopped")

if __name__ == "__main__":
    run_server()