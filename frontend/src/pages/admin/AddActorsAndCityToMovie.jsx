import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActorService } from '../../services/actorService';
import { CityService } from '../../services/cityService';
import KaanKaplanSelect from '../../utils/customFormItems/KaanKaplanSelect'
import KaanKaplanTextInput from '../../utils/customFormItems/KaanKaplanTextInput'
import * as yup from "yup";
import { MovieImageService } from '../../services/movieImageService';
import { useSelector } from 'react-redux';

export default function AddActorsAndCityToMovie() {

    let {movieId} = useParams();
    const navigate = useNavigate()

    const userFromRedux = useSelector(state => state.user.payload)

    const cityService = new CityService();
    const actorService = new ActorService();
    const movieImageService = new MovieImageService();

    const [cities, setCities] = useState([])
    const [actors, setActors] = useState([])

    useEffect(() => {
        cityService.getall().then(result => {
            let arr = [];
            const cityData = result.data?.data || result.data || [];
            if (Array.isArray(cityData)) {
                cityData.forEach(element => {
                    if(!arr.includes(element?.cityName)){
                        arr.push(element?.cityName)
                    }
                });
            }
            setCities(arr)
        }).catch(error => {
            console.error("Error loading cities:", error);
            setCities([]);
        })
        
        actorService.getall().then(result => {
            let arr = [];
            const actorData = result.data?.data || result.data || [];
            if (Array.isArray(actorData)) {
                actorData.forEach(element => {
                    if(!arr.includes(element?.actorName)){
                        arr.push(element?.actorName)
                    }
                });
            }
            setActors(arr)
        }).catch(error => {
            console.error("Error loading actors:", error);
            setActors([]);
        })
      }, [])

    const initValues = {
     
    }

    const validationSchema = yup.object({

   
    })

  return (
    <div>
        <div className='mt-5 p-5 container-fluid' style={{minHeight: "100vh", maxWidth: "900px"}}>
            <div className="text-center mb-4">
                <h2 className='text-primary'>Thêm Diễn Viên & Thành Phố</h2>
                <hr className="mx-auto" style={{width: "50%"}} />
                <div className='alert alert-info'>
                    <i className="fas fa-users me-2"></i>
                    Thêm thông tin diễn viên và thành phố chiếu cho phim bạn đã tạo.
                </div>
            </div>

            <Formik 
                initialValues={initValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    // Build actor list from selected multi-select and/or free-text input
                    let actorNameList = [];
                    if (Array.isArray(values.actors)) {
                        actorNameList = [...values.actors];
                    }
                    if (values.actorName && typeof values.actorName === 'string' && values.actorName.trim() !== "") {
                        actorNameList.push(
                            ...values.actorName
                              .split(",")
                              .map(s => s.trim())
                              .filter(Boolean)
                        );
                    }
                    let actorDto = {
                        movieId: movieId,
                        actorNameList: actorNameList,
                        token: userFromRedux.token
                    }
                    let cityDto = {
                        movieId: movieId,
                        cityNameList: values.cities,
                        token: userFromRedux.token
                    }
                    let movieImageDto = {
                        movieId: movieId,
                        imageUrl: values.imageUrl,
                        token: userFromRedux.token
                    }
                    
                    actorService.addActor(actorDto);
                    movieImageService.addMovieImage(movieImageDto);
                    cityService.addCity(cityDto).then(result => navigate("/addMovie"));
                }}>

                <Form>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Chọn Diễn Viên:</label>
                        <KaanKaplanSelect
                            className="form-select form-select-lg mb-3"
                            name="actors"
                            multiple
                            size={3}
                            options={actors.map(actor => (
                                {key: actor, text:actor, value: actor}
                            ))}
                        />
                    </div>
                    <p className="text-muted">Nếu không có trong danh sách, vui lòng viết tên diễn viên cách nhau bằng dấu phẩy ở ô bên dưới.</p>
                    <div className="form-floating mb-3">
                        <KaanKaplanTextInput  type="text" name='actorName' className="form-control" id="floatingInput" placeholder="Tên Diễn Viên" />
                        <label htmlFor="floatingInput">Tên Diễn Viên</label>
                    </div>

                    <div className="form-floating mb-3">
                        <KaanKaplanTextInput name='imageUrl' type="text" className="form-control" id="imageUrl" placeholder="URL Poster Phim" />
                        <label htmlFor="imageUrl">URL Poster Phim</label>
                    </div>

                     <div className="mb-3">
                        <label className="form-label fw-bold">Chọn Thành Phố Chiếu:</label>
                        <KaanKaplanSelect 
                            className="form-select form-select-lg mb-3"
                            name="cities"
                            multiple
                            size={3}
                            options= {cities.map(city => (
                                {key: city, text:city, value: city}
                            ))}
                            placeholder="Thành Phố"
                        />
                    </div>

                    <div className="d-grid gap-2 my-4 col-6 mx-auto">
                      <input
                        type="submit"
                        value="Thêm"
                        className="btn btn-block btn-primary"
                      />
                    </div>
                </Form>
            </Formik>
        </div>
    </div>
  )
}
