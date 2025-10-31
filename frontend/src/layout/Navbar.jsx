import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from '../pages/LoginModal';
import RegisterModal from '../pages/RegisterModal';
import { MovieService } from '../services/movieService';
import LoggedOut from './LoggedOut';
import LoggedIn from './LoggedIn';

export default function Navbar() {

    const navigate = useNavigate()

    const movieService = new MovieService();

    const [moviesInVision, setMoviesInVision] = useState([])
    const [comingSoonMovies, setComingSoonMovies] = useState([])

    const userFromRedux = useSelector(state => state.user.payload);

    useEffect(() => {
      
        movieService.getAllDisplayingMovies().then(result => setMoviesInVision(result.data))
        movieService.getAllComingSoonMovies().then(result => setComingSoonMovies(result.data))

    }, [])
    

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
            <div className="container px-5">
            <Link to={"/"} style={{textDecoration:"none"}} className="navbar-brand">
                CineVision
            </Link> 
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {userFromRedux?.roles && userFromRedux.roles.length > 0 && userFromRedux.roles[0] === "ADMIN" ? 
                            <li className="nav-item"><a className="nav-link" href="#!" onClick={() => navigate("/addMovie")}>Thêm Phim</a></li>
                        : null}

                        <li className="nav-item"><a className="nav-link" href="#!"
                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                            Phim</a></li>
                        
                        { userFromRedux ? <LoggedIn /> : <LoggedOut /> }
                    </ul>
                </div>
            </div>
        </nav>

        {/* Login Modal */}
        <LoginModal />
        <RegisterModal />

        {/* Movies OffCanvas */}
        <div className="offcanvas offcanvas offcanvas-top off-canvas-movie" tabIndex={-1} id="offcanvasTop" 
            aria-labelledby="offcanvasTopLabel" style={{offcanvasHeight:"100%"}}>
       
       
            <div className="offcanvas-body mt-5">
                <div className='container mb-5'>
                    <div className='row justify-content-between align-items-center'>
                        <div className='col-sm-12 col-md-6 text-white text-start'>
                            <div className='row justify-content-center align-items-center'>
                                <div className='col-sm-6'>
                                    <img
                                    src={moviesInVision && moviesInVision.length > 0 ? moviesInVision[0]?.movieImageUrl : ''}
                                    className="img-fluid poster-img" alt={moviesInVision && moviesInVision.length > 0 ? moviesInVision[0]?.movieName : 'poster'}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/500x750?text=Poster+Unavailable'; }}
                                    />
                                </div>
                                <div className='col-sm-6'>
                                    <h3>{moviesInVision && moviesInVision.length > 0 ? moviesInVision[0]?.movieName : 'Loading...'}</h3>
                                    <p className='last-movie-p'>{moviesInVision && moviesInVision.length > 0 ? moviesInVision[0]?.description : ''}</p>
                             <button className="slider-button btn btn-light btn-md rounded" data-bs-dismiss="offcanvasTop" aria-label="Close"
                                 onClick={()=> navigate("/movie/" + (moviesInVision && moviesInVision.length > 0 ? moviesInVision[0]?.movieId : '1'))}>
                                 <strong>Mua Vé</strong>
                             </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-12 col-md-6'>
                            <div className='row justify-content-center align-items-start'>
                                <div className='col-sm-7'>
                                    <h3 className='text-start ms-3'>Phim Đang Chiếu</h3>
                                    {/* For loop sadece 5 tanesi*/}
                                    <div className='ms-3 mt-2'>
                                        {moviesInVision.map(movie => (
                                            <button key={movie.movieId} className='nav-movie-p text-start text-decoration-none btn btn-link p-0 d-block text-white'
                                                onClick={() => navigate("/movie/"+ movie.movieId)}>
                                                {movie.movieName}
                                            </button>

                                        ))}

                                    </div>
                                    
                                    <a href='#!' className='text-decoration-none'><strong> Tất Cả </strong> </a>
                                </div>
                                <div className='col-sm-5'>
                                    <h3 className='text-start ms-3'>Phim Sắp Chiếu</h3>
                                    {/* For loop */}
                                    <div className='ms-3 mt-2'>
                                        {comingSoonMovies.map(movie => (
                                             <button key={movie.movieId} className='nav-movie-p text-start text-decoration-none btn btn-link p-0 d-block text-white'
                                                onClick={() => navigate("/movie/"+ movie.movieId)}>
                                                {movie.movieName}
                                            </button>
                                        ))}

                                    </div>
                                    <a href='#!' className='text-decoration-none'><strong> Tất Cả </strong> </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}
