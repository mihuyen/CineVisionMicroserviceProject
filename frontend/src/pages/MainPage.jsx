import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { MovieService } from '../services/movieService';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
 
    const movieService = new MovieService();

    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    async function getMovies(isComingSoon) {
        if (isComingSoon) {
            await movieService.getAllComingSoonMovies().then(result => setMovies(result.data))
        }else {
            await movieService.getAllDisplayingMovies().then(result => setMovies(result.data))
        }
    }

    useEffect(() => {
      getMovies(false);
    }, [])
    

  return (
    <div id="page-top">
    <section>
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="false">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
            <header className="masthead text-center text-white">
                <div className="masthead-content">
                    <div className="container px-5">
                        <h1 className="masthead-heading mb-0">CineVision</h1>
                        <h2 className="masthead-subheading mb-0">
                            Đừng Bỏ Lỡ Niềm Vui Điện Ảnh Cùng CineVision
                        </h2>
                        <p className="lead mb-0">
                            Những bộ phim mới nhất đang chiếu tại Rạp Chiếu Phim CineVision
                        </p>
                        <a className="btn btn-primary btn-xl rounded-pill mt-5" href="#scroll">Phim</a>
                    </div>
                </div>
                <div className="bg-circle-1 bg-circle"></div>
                <div className="bg-circle-2 bg-circle"></div>
                <div className="bg-circle-3 bg-circle"></div>
                <div className="bg-circle-4 bg-circle"></div>
            </header>
          
            </div>
        {/* Second slide */}

                <div className="topgun-bg carousel-item">

                </div>

        {/* Third slide */}
            <div className="assasin-bg carousel-item">
            
            </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
        </div>
    </section>


    {/* Section - 2 Navs & Tabs */}

    <section className='py-5'>
        <div className='d-flex justify-content-center'>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" 
                        data-bs-target="#pills-home" type="button"
                        role="tab" aria-controls="pills-home" aria-selected="true"
                        onClick={() => {
                            getMovies(false)
                        }}>Đang Chiếu</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button" role="tab" aria-controls="pills-profile" aria-selected="false"
                    onClick={() => {
                        getMovies(true)
                    }}>Sắp Chiếu</button>
                </li>
            </ul>
        </div>
    </section>

    {/* Section - 3 Movie Carrousel */}

    <section className='mb-5'>
        <Swiper
            slidesPerView={5}
            spaceBetween={0}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper movie-slider"
        >
            {movies.map(movie => (
                <SwiperSlide key={movie.movieId}>
                    <div className='slider-item' onClick={()=> navigate("/movie/" + movie.movieId)}>
                        <div className='slider-item-caption d-flex align-items-end justify-content-center h-100 w-100'>
                            <div className="d-flex align-items-center flex-column mb-3" style={{height: "20rem"}}>
                                <div className="mb-auto pt-5 text-white"><h3> {movie.movieName} </h3></div>
                                <div className="p-2 d-grid gap-2">
                                    <a className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                        onClick={()=> navigate("/movie/" + movie.movieId)}>
                                        <strong>Bình Luận </strong>
                                    </a>
                                    <a className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                        onClick={()=> navigate("/movie/" + movie.movieId)}>
                                        <strong> Mua Vé </strong>
                                    </a>
                                </div>
                            
                            </div>
                        </div>
                        <img
                            src={movie.movieImageUrl}
                            className="img-fluid mx-2 poster-img"
                            alt={movie.movieName}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/500x750?text=Poster+Unavailable'; }}
                        />
                    </div>
                </SwiperSlide>
            ))}
            

        </Swiper>

   
    </section>
    </div>
  )
}
