import React, { useState } from 'react'
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { ActorService } from '../../services/actorService';
import { useEffect } from 'react';
import { CityService } from '../../services/cityService';
import KaanKaplanSelect from '../../utils/customFormItems/KaanKaplanSelect';
import { CategoryService } from '../../services/categoryService';
import { DirectorService } from '../../services/directorService';
import KaanKaplanTextInput from '../../utils/customFormItems/KaanKaplanTextInput';
import KaanKaplanTextArea from '../../utils/customFormItems/KaanKaplanTextArea';
import { MovieService } from '../../services/movieService';
import { useNavigate } from 'react-router-dom';
import KaanKaplanCheckBox from '../../utils/customFormItems/KaanKaplanCheckBox';
import { useSelector } from 'react-redux';

export default function AddMoviePage() {

    const userFromRedux = useSelector(state => state.user.payload)

    const navigate = useNavigate()

    const actorService = new ActorService();
    const cityService = new CityService();
    const categoryService = new CategoryService();
    const directorService = new DirectorService();
    const movieService = new MovieService();

    const [actors, setActors] = useState([])
    const [cities, setCities] = useState([])
    const [categories, setCategories] = useState([])
    const [directors, setDirectors] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
      actorService.getall().then(result => {
        const actorData = result.data?.data || result.data || [];
        setActors(Array.isArray(actorData) ? actorData : []);
      }).catch(error => {
        console.error("Error loading actors:", error);
        setActors([]);
      });
      
      cityService.getall().then(result => {
        const cityData = result.data?.data || result.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      }).catch(error => {
        console.error("Error loading cities:", error);
        setCities([]);
      });
      
      categoryService.getall().then(result => {
        const categoryData = result.data?.data || result.data || [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      }).catch(error => {
        console.error("Error loading categories:", error);
        setCategories([]);
      });
      
      directorService.getall().then(result => {
        const directorData = result.data?.data || result.data || [];
        setDirectors(Array.isArray(directorData) ? directorData : []);
      }).catch(error => {
        console.error("Error loading directors:", error);
        setDirectors([]);
      });
    }, [])
    
    const initValues = {
        movieName: "",
        description: "",
        duration: "",
        releaseDate: "",
        trailerUrl: "",
        categoryId: "",
        directorId: "",
        directorName: "",
        isInVision: false
    }

    const validationSchema = yup.object({
        movieName: yup.string().required("Tên phim là bắt buộc"),
        description: yup.string().required("Tóm tắt phim là bắt buộc"),
        duration: yup.number().required("Thời lượng phim là bắt buộc").min(1, "Thời lượng phải lớn hơn 0"),
        releaseDate: yup.string().required("Ngày khởi chiếu là bắt buộc"),
        trailerUrl: yup.string().url("Link trailer phải hợp lệ").nullable()
    })


  return (
    <div>
        <div className='mt-5 p-5 container-fluid' style={{minHeight: "100vh", maxWidth: "1200px"}}>
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <h2 className='text-center mb-4'>Thêm Phim</h2>
                    <hr className="mb-4" />

                    <div className='alert alert-info mb-4'>
                        <i className="fas fa-info-circle me-2"></i>
                        Điền đầy đủ thông tin phim và tiến hành chọn diễn viên cho phim.
                    </div>

            <Formik 
                initialValues={initValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log("🎬 Form submitted with values:", values);
                    console.log("👤 User from Redux:", userFromRedux);
                    values.userAccessToken = userFromRedux?.token;
                    setIsSubmitting(true);
                    
                    console.log("🔄 Starting form submission process...");

                    // If no director selected but director name provided
                    if((!values.directorId || values.directorId === "") && values.directorName && values.directorName.trim()){
                        let director={
                            directorName: values.directorName,
                            token: userFromRedux?.token
                        }
                        console.log("🎭 Adding new director:", director);
                        
                        directorService.add(director).then(result => {
                            console.log("✅ Director add result:", result.data);
                            // Handle different response structures
                            const directorId = result.data?.data?.directorId || result.data?.directorId || result.data?.data?.id;
                            values.directorId = directorId;
                            console.log("🆔 Using director ID:", directorId);
                            
                            // Now add the movie
                            console.log("🎬 Adding movie with director:", values);
                            movieService.addMovie(values).then(movieResult => {
                                console.log("✅ Movie add result:", movieResult.data);
                                const movieId = movieResult.data?.data?.movieId || movieResult.data?.movieId || movieResult.data?.data?.id || 1;
                                setIsSubmitting(false);
                                alert("🎉 Phim đã được thêm thành công!");
                                // Navigate to add actors page with movieId
                                navigate(`/addMovie/${movieId}`);
                            }).catch(error => {
                                console.error("❌ Error adding movie:", error);
                                setIsSubmitting(false);
                                alert("❌ Có lỗi khi thêm phim: " + (error.response?.data?.message || error.message));
                            });
                        }).catch(error => {
                            console.error("❌ Error adding director:", error);
                            setIsSubmitting(false);
                            alert("❌ Có lỗi khi thêm đạo diễn: " + (error.response?.data?.message || error.message));
                        });
                    } else {
                        // Direct movie addition
                        console.log("🎬 Adding movie directly:", values);
                        movieService.addMovie(values).then(result => {
                            console.log("✅ Movie add result:", result.data);
                            const movieId = result.data?.data?.movieId || result.data?.movieId || result.data?.data?.id || 1;
                            setIsSubmitting(false);
                            alert("🎉 Phim đã được thêm thành công!");
                            navigate(`/addMovie/${movieId}`);
                        }).catch(error => {
                            console.error("❌ Error adding movie:", error);
                            setIsSubmitting(false);
                            alert("❌ Có lỗi khi thêm phim: " + (error.response?.data?.message || error.message));
                        });
                    }
                }}>

                <Form>
                <div className="form-floating mb-3">
                    <KaanKaplanTextInput  type="text" name='movieName' className="form-control" id="floatingInput" placeholder="Tên Phim" />
                    <label htmlFor="floatingInput">Tên Phim</label>
                </div>
                <div className="form-floating mb-3">
                    <KaanKaplanTextArea name='description' className="form-control" id="floatingPassword" placeholder="Tóm Tắt Phim" />
                    <label htmlFor="floatingPassword">Tóm Tắt Phim</label>
                </div>
                <div className="form-floating mb-3">
                    <KaanKaplanTextInput  name='duration' type="number" className="form-control" id="duration" placeholder="Thời Lượng Phim" />
                    <label htmlFor="duration">Thời Lượng Phim</label>
                </div>
                <div className="form-floating mb-3">
                    <KaanKaplanTextInput name='releaseDate' type="date" className="form-control" id="releaseDate" placeholder="Ngày Khởi Chiếu" />
                    <label htmlFor="releaseDate">Ngày Khởi Chiếu</label>
                </div>
                
                <div className="form-floating mb-3">
                    <KaanKaplanTextInput name='trailerUrl' type="text" className="form-control" id="trailerUrl" placeholder="Link Trailer" />
                    <label htmlFor="trailerUrl">Link Trailer</label>
                </div>

                <div className="form-floating mb-3">
                    <KaanKaplanSelect
                        id="categoryId"
                        className="form-select form-select-lg mb-3"
                        name="categoryId"
                        options={[
                            {key: '', text: 'Chọn thể loại...', value: ''},
                            ...(categories || []).map(category => (
                                {key: category?.id || category?.categoryId, text: category?.name || category?.categoryName, value: category?.id || category?.categoryId}
                            ))
                        ]}
                    />
                    <label htmlFor="categoryId">Thể Loại</label>
                </div>  
                <div className="form-floating mb-3">
                    <KaanKaplanSelect
                        id="directorId"
                        className="form-select form-select-lg mb-3"
                        name="directorId"
                        options={[
                            {key: '', text: 'Chọn đạo diễn...', value: ''},
                            ...(directors || []).map(director => (
                                {key: director?.id || director?.directorId, text: director?.name || director?.directorName, value: director?.id || director?.directorId}
                            ))
                        ]}
                    />
                    
                    <label htmlFor="directorId">Đạo Diễn</label>
                </div>

                <p>Nếu đạo diễn không có trong danh sách trên, vui lòng nhập tên.</p>
                <div className="form-floating mb-3">
                    <KaanKaplanTextInput name='directorName' type="text" className="form-control" id="directorName" placeholder="Tên Đạo Diễn" />
                    <label htmlFor="directorName">Tên Đạo Diễn</label>
                </div>

                <div className="form-check mb-3 text-start">
                    <KaanKaplanCheckBox name="isInVision" className="form-check-input" type="checkbox" id="isInVision" />
                    <label className="form-check-label" htmlFor="isInVision">
                        Phim Có Đang Chiếu Không?
                    </label>
                </div>
              
{/* Daha sonra file ile ekle */}
                {/* <div className="input-group mb-3">
                    <input type="file" className="form-control" id="image" />
                </div> */}

                    <div className="d-grid gap-2 my-4 col-6 mx-auto">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-block ${isSubmitting ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          'Tiếp Theo'
                        )}
                      </button>
                    </div>
                </Form>

              </Formik>
                </div>
            </div>
        </div>
    </div>
  )
}
