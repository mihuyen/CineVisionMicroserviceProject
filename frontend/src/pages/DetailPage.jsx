import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { ActorService } from '../services/actorService';
import { CityService } from '../services/cityService';
import { MovieService } from '../services/movieService';
import dateConvert from '../utils/dateConverter';
import dateConvertForTicket from '../utils/dateConvertForTicket';
import { SaloonTimeService } from '../services/saloonTimeService';
import { SaloonService } from '../services/saloonService';
import { useDispatch, useSelector } from 'react-redux';
import { addMovieToState, cleanState } from '../store/actions/movieActions';
import { CommentService } from '../services/commentService';
import { toast, ToastContainer } from 'react-toastify';


export default function DetailPage() {
    let {movieId} = useParams();
    console.log("DetailPage - movieId from useParams:", movieId);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userFromRedux = useSelector(state => state.user.payload);

    let date = new Date();

    const movieService = new MovieService()
    const cityService = new CityService()
    const actorService = new ActorService()
    const saloonTimeService = new SaloonTimeService();
    const saloonService = new SaloonService();
    const commentService = new CommentService();

    const [movie, setMovie] = useState({})
    const [actors, setActors] = useState([])
    const [otherMovies, setOtherMovies] = useState([])
    const [cinemaSaloons, setCinemaSaloons] = useState([])
    const [selectedCity, setSelectedCity] = useState({})
    const [selectedSaloon, setSelectedSaloon] = useState(null)
    const [saloonTimes, setSaloonTimes] = useState([])
    const [selectedDay, setSelectedDay] = useState(dateConvert(date))
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [countOfComments, setCountOfComments] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (movieId) {
            getNewVisionMovie(movieId);
        }
    }, [movieId])
    
    function getNewVisionMovie(movieId) {
        if (!movieId) {
            console.error("movieId is undefined!");
            return;
        }
        console.log("Fetching movie with ID:", movieId);
        movieService.getMovieById(movieId).then(result => setMovie(result.data));
        actorService.getActorsByMovieId(movieId).then(result => setActors(result.data))
        
        // Load cities with saloons
        cityService.getCitiesByMovieId(movieId).then(result => {
            const cities = result.data;
            // For each city, load saloons
            const citiesWithSaloons = [];
            cities.forEach(city => {
                saloonService.getSaloonsByCityId(city.cityId).then(saloonResult => {
                    citiesWithSaloons.push({
                        ...city,
                        saloon: saloonResult.data
                    });
                    if (citiesWithSaloons.length === cities.length) {
                        setCinemaSaloons(citiesWithSaloons);
                    }
                });
            });
        });
        
        movieService.getAllDisplayingMovies().then(result => {
            const films = result.data.filter(m => m.movieId != movieId);
            setOtherMovies(films);
        })
        commentService.getCountOfComments(movieId).then(result => setCountOfComments(result.data));
        getComments(movieId, 1, 5);
    }

    function getSaloonTimes(saloonId, movieId) {
        saloonTimeService.getMovieSaloonTimeSaloonAndMovieId(saloonId, movieId).then(result => {
            setSaloonTimes(result.data);
        })
    }

    function getComments(movieId, pageNo, pageSize=5) {
        commentService.getCommentsByMovieId(movieId, pageNo, pageSize).then(result => {
            // Some backends return array directly; others wrap in { value: [...], Count: n }
            const payload = result?.data;
            const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.value) ? payload.value : []);
            if (comments.length > 0 && pageNo > 1) {
                setComments([...comments, ...items])
            } else {
                setComments(items)
            }
        }).catch(() => {
            // Soft-fail to avoid crashing UI when network issues occur
            toast.error("Không thể tải bình luận. Vui lòng thử lại.", { theme: "light", position: "top-center" });
        })
    }

    function addState(movieTime) {
        dispatch(cleanState());

        let movieDto = {
            id: movie.movieId,
            movieName: movie.movieName,
            imageUrl: movie.movieImageUrl,
            saloonId: selectedSaloon.saloonId,
            saloonName: selectedSaloon.saloonName,
            movieDay: selectedDay,
            movieTime: movieTime
        }
        dispatch(addMovieToState(movieDto));
        navigate(`/movie/${movieId}/buyTicket`)
    }

    function sendCommentText() {

        if(userFromRedux) {
            if(commentText.trim().length > 0) {
                let commentDto = {
                    commentByUserId: userFromRedux.userId || userFromRedux.user?.userId || 'unknown_user',
                    commentText: commentText,
                    commentBy: userFromRedux.fullName || userFromRedux.name || userFromRedux.user?.name || 'Anonim Kullanıcı',
                    token: userFromRedux.token || 'mock_token',
                    movieId: movieId
                }
                
                commentService.addComment(commentDto).then(result => {
                    if(result.status == 200) {
                        document.querySelector("#commentArea").value = "";
                        setCommentText(""); // Clear the comment text state
                        setComments([result.data, ...comments]) // Add new comment to the beginning
                        setCountOfComments(countOfComments + 1); // Update comment count
                        toast.success("Bình luận của bạn đã được thêm!", {
                            theme: "colored",
                            position: "top-center"
                        })
                    }
                })

            } else {
                toast.warning("Bình luận không thể để trống!", {
                    theme: "light",
                    position: "top-center"
                });
            }
        } else {
            toast.error("Để bình luận, vui lòng đăng nhập!", {
                theme: "light",
                position: "top-center"
            });
        }
    }

    function deleteComment(commentId) {
        let deleteCommentDto = {
            commentId: commentId,
            token: userFromRedux.token
        }
        commentService.deleteComment(deleteCommentDto).then(result => {
            if(result.status == 200){
                let newComments = comments.filter(c => c.commentId != commentId);
                setComments(newComments);
            }
        })
    }

  return (
    <div>
        <section id="entry-section" className='detail-bg pt-5'>
            <div className=' container mt-5'>
                <div className='row gx-0 pt-2 justify-content-center align-items-start'>
                                        <div className='col-sm-12 col-md-6 text-center mb-4' >
                                                <img
                                                    className='img-thumbnail w-50 poster-img'
                                                    src={movie?.movieImageUrl}
                                                    alt={movie?.movieName || 'poster'}
                                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/500x750?text=Poster+Unavailable'; }}
                                                />
                    </div>
                    <div className='col-sm-12 col-md-6 text-start text-light'>
                        <h3>{movie?.movieName}</h3>
                        <hr/>
                        <h5>Đạo diễn: {movie?.directorName}</h5>
                        <h5>Diễn viên: {actors?.map((actor, index) => (
                            <span key={actor.id || index}>{actor.actorName + " ,"}</span>
                        ))}
                        </h5>
                        <div class="row gy-1 justify-content-start align-items-end mt-5">
                        
                            <div className='col-sm-4'>
                                <button class="detail-page-btn btn btn-light btn-lg col-12" type="button"
                                    onClick={() => {
                                        document.querySelector("#ticketBuy").scrollIntoView({
                                            behavior: "smooth"
                                        })
                                    }}><strong>Mua Vé </strong></button>
                                
                            </div>
                            <div className='col-sm-4'>
                                <button class="detail-page-btn btn btn-light btn-lg col-12" type="button"
                                    onClick={() => {
                                        document.querySelector("#commentSection").scrollIntoView({
                                            behavior: "smooth"
                                        })
                                    }}><strong>Bình Luận</strong></button>

                            </div>
                            <div className='col-sm-4'>
                                <button class="detail-page-btn btn btn-light btn-lg col-12" type="button"
                                    data-bs-toggle="modal" data-bs-target="#movieTrailerModal"><strong>Trailer</strong></button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* for css ::after property */}
        <style dangerouslySetInnerHTML={{
            __html: [
                '.detail-bg:after {',
                '  content: "Hello";',
                '  position: absolute;',                
                'z-index: -1;',
                'inset: 0;',
                `background-image: url(${movie?.movieImageUrl});`, 
                'background-repeat: no-repeat;',
                'background-size: cover;',
                'background-position: top center;',
                'opacity: 0.8;',
                '-webkit-filter: blur(8px) saturate(1);',
                '}'
                ].join('\n')
            }}>
        </style>

        <section className='p-5'>
            <div className='container'>
                <div className='row justify-content-between ms-0 ms-md-5 ps-0 ps-md-5'>
                    <div className='col-sm-4 text-start'>
                        <p> <strong>Ngày phát hành: </strong> {dateConvert( movie.releaseDate) }</p>
                        <p> <strong>Thời gian: </strong>{movie.duration} Phút</p>
                        <p><strong>Thể loại: </strong>{movie.categoryName}</p>
                    </div>
                    <div className='col-sm-8 text-start'>
                        <p><strong>Nội dung: </strong>{movie.description}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Ticket Buy Section */}
        <section id="ticketBuy" className='pt-1 pb-3'>
            <div className='container bg-primary rounded'>
                <div className='row p-5'>
                    <div className='col-sm-4 mt-2 text-sm-start text-md-end text-light'>
                        <h2>Mua Vé</h2>
                    </div>
                    <div className='col-sm-8 ps-3 mt-2'>
                        <button type="button" class="select-saloon-button btn btn-primary col-12"
                         data-bs-toggle="modal" data-bs-target="#saloonModal">
                            <strong>Chọn Rạp Phim</strong> <i class="fa-solid fa-caret-down"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Ticket Detail Section */}
        {selectedSaloon ? (
            <section id="ticketDetailSection" className='px-5 py-1 pb-5'>
                <hr />
                <div className='container py-2'>
                    <ul className="nav justify-content-center">
                        {
                            [0,1,2,3,4,5,6].map((i) => (
                                <li key={i} className="nav-item">
                                    <a className="nav-link active date-converter-ticket" aria-current="page"
                                         href="#!" onClick={() => setSelectedDay( dateConvert(new Date().setDate(date.getDate() + i)) )}>
                                        {dateConvertForTicket(new Date().setDate(date.getDate() + i))}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                    
                </div>
                <hr />

                <div className='container bg-primary rounded'>
                    <h3 className='text-light p-3'>{selectedSaloon?.saloonName}</h3>
                </div>
                <div className='container pb-4'>
                    {saloonTimes?.map(time => (
                        <button className='saloonTime-btn btn btn-outline-dark mx-2 mt-3'
                            onClick={() => addState(time.movieBeginTime)}>
                            <strong>{time.movieBeginTime} </strong>
                        </button>
                    ))}
                </div>
                <hr />

            </section>
        ): null}


        {/* Comment Modal */}
        <section id="commentSection" className='pt-5 pb-5 px-2'>
            <div className='container'>
                <div className='row gy-2 justify-content-start align-items-start'>
                    <div className='col-sm-12 col-md-6 text-start'>
                       <h3>Bình Luận</h3>
                       {/* Yorumları listele */}
                       <div style={{height: "200px", overflow:"scroll",overflowX: "hidden"}}>
                            {comments.length == 0 ? (
                                <p className='lead mt-4'>Hãy là người đầu tiên bình luận</p>
                            ): null}

                            {comments.map(comment => (
                                <div className='row align-items-center'>
                                    <div className='col-sm-10'>
                                        <p className='lead mt-4'>{comment.commentText}</p>
                                        <p className='small mt-0'>{comment.commentBy}</p>
                                    </div>
                                    {userFromRedux && comment.commentByUserId == (userFromRedux.userId || userFromRedux.user?.userId) ? 
                                        <div className='col-sm-2'>
                                            <p className='small mb-0' onClick={() => {deleteComment(comment.commentId)}}> 
                                                <i class="fa-solid fa-xmark" ></i>
                                            </p>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            ))}
                            <hr />
                            <div className='text-center'>
                                {currentPage < Math.ceil(countOfComments / 5) && countOfComments > 5 ?
                                    <a href='#!' className='a-pagination lead mt-4'
                                        onClick={() => {
                                            getComments(movieId, currentPage + 1)
                                            setCurrentPage(currentPage+1)
                                        }}>Xem Thêm</a>
                                : null}
                            </div> 
                       </div>


                    </div>
                    <div className='col-sm-12 col-md-6 text-start'>
                        <h3>Viết Bình Luận</h3>
                            <textarea id="commentArea" className='text-dark mb-3' placeholder='Nhập bình luận của bạn' onChange={(e) => setCommentText(e.target.value)} ></textarea>
                            <button class="comment-btn btn btn-dark btn-lg col-12" type="button" onClick={() => sendCommentText()}><strong>Gửi</strong></button>
                    </div>
                </div>
            </div>
        </section>

        {/* Other Movies */}
        <section className='p-5'>

            <h3 className='text-center mb-4'>Các Phim Khác</h3>
            <Swiper
                slidesPerView={5}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper movie-slider"
            >
                {otherMovies.map(movie => (
                    <SwiperSlide key={movie.movieId} >
                            <div className='slider-item' onClick={()=> {
                                navigate("/movie/" + movie.movieId)
                                getNewVisionMovie(movie.movieId);
                                document.querySelector("#entry-section").scrollIntoView({
                                    behavior: "smooth"
                                })
                            }}>
                            <div className='slider-item-caption d-flex align-items-end justify-content-center h-100 w-100'>
                                <div class="d-flex align-items-center flex-column mb-3" style={{height: "20rem"}}>
                                    <div class="mb-auto pt-5 text-white"><h3> {movie.movieName} </h3></div>
                                    <div class="p-2 d-grid gap-2">
                                        <a className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                            onClick={()=> {
                                                navigate("/movie/" + movie.movieId)
                                                getNewVisionMovie(movie.movieId);
                                            }}>
                                            <strong>Bình Luận </strong>
                                        </a>
                                        <a class="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                            onClick={()=> {
                                                navigate("/movie/" + movie.movieId)
                                                getNewVisionMovie(movie.movieId);
                                            }}>
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


        {/* MovieTrailer Modal */}

        <div className="modal fade" id="movieTrailerModal" tabIndex="-1" aria-labelledby="movieTrailerLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="movieTrailerLabel">Trailer</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                        let player = document.getElementById("videoPlayer").getAttribute("src");
                        document.getElementById("videoPlayer").setAttribute("src", player);
                    }}></button>
                </div>
                <div id='modalBody' className="modal-body">
                    <iframe id='videoPlayer' width="100%" height="500rem" frameBorder="0" 
                        src={movie.movieTrailerUrl + "?autoplay=0"}>
                    </iframe>
                </div>
                
                </div>
            </div>
        </div>

        {/* Saloon Modal */}
        <div className="modal fade" id="saloonModal" tabIndex="-1" aria-labelledby="saloonModalLabel" aria-hidden="true" style={{height:"50%", overflow:'auto'}}>
            <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable" >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="saloonModalLabel">Chọn Thành Phố</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {cinemaSaloons.map(saloon => (
                            <a className='text-start text-dark' href='#!'
                            data-bs-target="#saloonModal2" data-bs-toggle="modal" data-bs-dismiss="modal" 
                            style={{textDecoration:"none"}} onClick={() => setSelectedCity(saloon)}>
                                <h6 className='ps-1'>{saloon.cityName}</h6>
                                <hr/>
                            </a>
                        ))}
                    
                    </div>
            
                </div>
            </div>
        </div>

        {/* Second Saloon Modal */}
        <div className="modal fade" id="saloonModal2" aria-hidden="true" aria-labelledby="saloonModal2ToggleLabel2" tabIndex="-1" style={{height:"50%", overflow:'auto'}}>
            <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                    <a href='!#' className='text-dark' data-bs-target="#saloonModal" data-bs-toggle="modal" data-bs-dismiss="modal" style={{textDecoration:"none"}}>
                        <h5 className="modal-title" id="saloonModal2ToggleLabel2"> 
                            <i className="fa-sharp fa-solid fa-chevron-left"></i>
                            {selectedCity.cityName}
                        </h5>
                    </a>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {selectedCity?.saloon?.map(s => (
                            <a className='text-start text-dark' href='#!' onClick={() =>  {
                                setSelectedSaloon(s)
                                getSaloonTimes(s.saloonId, movieId)
                            }}
                            data-bs-target="#saloonModal2" data-bs-toggle="modal" data-bs-dismiss="modal" 
                            style={{textDecoration:"none"}}>
                                <h6 className='ps-1'>{s.saloonName}</h6>
                                <hr/>
                            </a> 
                        ))}
                        {/* Bilet Alma sayfasına gönder */}
                    </div>
                    
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}
