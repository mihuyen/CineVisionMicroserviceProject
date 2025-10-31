import Cleave from 'cleave.js/react'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { PaymentService } from '../services/paymentService'
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput'

export default function BuyTicketPage() {

    const navigate = useNavigate()

    const paymentService = new PaymentService();

    const [ticketItem, setTicketItem] = useState("ticketSection")
    const [adultTicketNumber, setAdultTicketNumber] = useState(0)
    const [studentTicketNumber, setStudentTicketNumber] = useState(0)
    const [chairNumber, setChairNumber] = useState(studentTicketNumber + adultTicketNumber)
    const [chairNumberList, setChairNumberList] = useState([])

    const movieState = useSelector(state => state.movie.payload)

    function checkChairIsEmpty(elementId) {
        let classname = document.getElementById(elementId).className;
        return classname.includes("empty");
    }

    function selectChair(elementId) {
        let item = document.getElementById(elementId);
        console.log('Selecting chair:', elementId, 'Current chairNumber:', chairNumber, 'isEmpty:', checkChairIsEmpty(elementId));
        
        if(checkChairIsEmpty(elementId) && chairNumber > 0) {
            item.className = "taken";
            setChairNumberList([...chairNumberList, elementId]);
            setChairNumber(chairNumber-1)
            console.log('Chair selected:', elementId, 'Remaining chairs:', chairNumber-1);
        } else {
            if(item.className === "taken"){
                item.className = "empty";
                let list = chairNumberList.filter(chair => chair !== elementId);
                setChairNumberList(list);
                setChairNumber(chairNumber+1)
                console.log('Chair deselected:', elementId, 'Remaining chairs:', chairNumber+1);
            } else {
                console.log('Cannot select chair - chairNumber:', chairNumber, 'isEmpty:', checkChairIsEmpty(elementId));
            }
        }
    }

    // function markChairsWithChairId(chairIdList) {
    //     for(let i=0; i < chairIdList.length; i++) {
    //         let chair = document.getElementById("E4");
    //         console.log(chair)
    //         chair.style.background = "#ff6a00";
    //         chair.className = "taken";
    //     }
    // }

  return (
    <div className='ticket-page'>

        <div className='row justify-content-center align-items-start'>

            <div className='ticket-page-bg-img  col-sm-12 col-md-4 text-light'>
                <div className='mt-5 pt-5'>
                    <h3 className='mt-2'> {movieState?.movieName} </h3>
                    <img className='img-thumbnail w-50 mx-auto mt-5' src={movieState?.imageUrl} />
                    <h5 className='pt-5'><i className="fa-solid fa-location-dot"></i>{movieState?.saloonName}</h5>
                    <h5 className='py-2'><i class="fa-solid fa-calendar-days"></i>{movieState?.movieDay}</h5>
                    <h5><i class="fa-regular fa-clock"></i>{movieState?.movieTime}</h5>
                </div>
               
            </div>
            {/* for css ::after property */}
            <style dangerouslySetInnerHTML={{
                    __html: [
                        '.ticket-page-bg-img:after {',
                        '  content: " ";',
                        '  position: absolute;',                
                        'z-index: -1;',
                        'inset: 0;',
                        `background-image: url(${movieState?.imageUrl});`, 
                        'background-repeat: no-repeat;',
                        'background-size: cover;',
                        'background-position: top center;',
                        'opacity: 0.8;',
                        'min-height: 100vh;',
                        '-webkit-filter: blur(8px) saturate(1);',
                        '}'
                        ].join('\n')
                }}>
                </style>
                <style dangerouslySetInnerHTML={{
                    __html: [
                        '.empty { background-color: #f8f9fa !important; color: #6c757d !important; border: 2px solid #dee2e6 !important; border-radius: 8px; transition: all 0.3s ease; }',
                        '.empty:hover { background-color: #e9ecef !important; border-color: #007bff !important; }',
                        '.taken { background-color: #28a745 !important; color: white !important; border: 2px solid #1e7e34 !important; border-radius: 8px; }',
                        '.taken:hover { background-color: #218838 !important; }',
                        '.seat-table td { padding: 12px; text-align: center; }',
                        '.seat-table .fa-chair { font-size: 20px; }'
                    ].join('\n')
                }}>
                </style>
            <div className='col-sm-12 col-md-8 pt-5'>
                <div className='container pt-5'>
                    
                    <div class="accordion accordion-flush" id="accordionPanelsStayOpenExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                                <div className='row pt-3 pb-1 px-4 align-items-center'>
                                        <div className='col-sm-6 text-start'>
                                            <h3>Chọn Vé</h3>
                                        </div>
                                            {/* Ticket Type Section */}
                                         
                                            <div className='col-sm-6 mb-2 text-end'>
                                                {ticketItem === "ticketSection" ?
                                                    <button className='btn btn-dark'
                                                        data-bs-toggle="collapse" 
                                                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo"
                                                        onClick={() => {
                                                            if(studentTicketNumber === 0 && adultTicketNumber === 0) {
                                                                toast.warning("Để tiếp tục, vui lòng chọn vé", {
                                                                    theme: "dark",
                                                                    position: "top-center"
                                                                })
                                                            } else {
                                                                setTicketItem("placeSection")
                                                                setChairNumber(studentTicketNumber + adultTicketNumber)
                                                            }
                                                        }}>Tiếp Tục</button>
                                                :  
                                                    <button className='btn btn-outline-dark'
                                                        data-bs-toggle="collapse" 
                                                        data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne"
                                                        onClick={() => setTicketItem("ticketSection")}>Thay Đổi</button>}
                                            </div>
                                        
                                </div>
                            </h2>

                            {ticketItem === 'ticketSection' ? (
                                <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                    <div class="accordion-body">
                                        <section>
                                                <div className='row '>
                                                    <div className='col-sm-6 text-start'>
                                                        <p>Sau khi chọn phim và suất chiếu, bạn phải chọn loại vé.
                                                            Nếu là sinh viên, đừng quên mang thẻ sinh viên.</p>                        
                                                    </div>
                                                </div>

                                            <div className='row mt-3 px-2 border border-2 align-items-center'>
                                                <div className='col-sm-6 text-uppercase border-end'>
                                                    Người Lớn
                                                </div>
                                                <div className='col-sm-3 border-end'>
                                                    Giá 25₺
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='row justify-content-center align-items-center'>
                                                        <div className='col-sm-4'>
                                                            <button className='btn btn-dark'
                                                                onClick={() => {
                                                                    if(adultTicketNumber > 0){
                                                                        setAdultTicketNumber(adultTicketNumber-1)}
                                                                    }
                                                                    }>
                                                                        <i class="fa-solid fa-minus"></i></button>
                                                        </div>
                                                        <div className='col-sm-4'>
                                                            {adultTicketNumber}
                                                        </div>
                                                        <div className='col-sm-4 py-2'>
                                                            <button className='btn btn-dark'
                                                                onClick={() => setAdultTicketNumber(adultTicketNumber+1)}> <i class="fa-solid fa-plus"></i> </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row mt-1 px-2 border border-2 align-items-center'>
                                                <div className='col-sm-6 text-uppercase border-end'>
                                                    Sinh Viên
                                                </div>
                                                <div className='col-sm-3 border-end'>
                                                    Giá 15₺
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='row justify-content-center align-items-center'>
                                                        <div className='col-sm-4'>
                                                            <button className='btn btn-dark'
                                                             onClick={() => {
                                                                if(studentTicketNumber > 0){
                                                                    setStudentTicketNumber(studentTicketNumber-1)}
                                                                }
                                                                }>
                                                                    <i class="fa-solid fa-minus"></i></button>
                                                               
                                                        </div>
                                                        <div className='col-sm-4'>
                                                            {studentTicketNumber}
                                                        </div>
                                                        <div className='col-sm-4 py-2'>
                                                            <button className='btn btn-dark'
                                                                onClick={() => setStudentTicketNumber(studentTicketNumber+1)}> <i class="fa-solid fa-plus"></i> </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className='lead text-end mt-3 me-5'>Tổng Tiền: <strong>{(studentTicketNumber * 15.00 + adultTicketNumber * 25.00).toFixed(2)} ₺ </strong></p>
                                        </section>

                                    </div>
                                </div>
                            ): null}
                        </div>
                        
                        {/* Place Section */}
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                                <div className='row pt-3 pb-1 px-4 align-items-center'>
                                        <div className='col-sm-6 text-start'>
                                            <h3>Chọn Ghế</h3>
                                            {chairNumber > 0 && (
                                                <p className='text-muted'>Còn {chairNumber} ghế cần chọn</p>
                                            )}
                                        </div>
                                        <div className='col-sm-6 mb-2 text-end'>
                                            {ticketItem === "placeSection" ?
                                                <button className='btn btn-dark' data-bs-toggle="collapse" 
                                                    data-bs-target="#panelsStayOpen-collapseThree"
                                                    aria-expanded="false" aria-controls="panelsStayOpen-collapseThree"
                                                    onClick={() => {
                                                        if (chairNumber !== 0) {
                                                            toast.warning("Vui lòng chọn số ghế bằng số vé!", {
                                                                theme: "dark",
                                                                position: "top-center"
                                                            })
                                                        } else {
                                                            setTicketItem("paySection")
                                                        }
                                                    }}>Tiếp Tục</button>
                                            :
                                                <button className='btn btn-outline-dark' data-bs-toggle="collapse" 
                                                    data-bs-target="#panelsStayOpen-collapseTwo"
                                                    aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo"
                                                    onClick={() => {
                                                        setTicketItem("placeSection")
                                                        // markChairsWithChairId(chairNumberList)
                                                    }}>
                                                        Thay Đổi
                                                </button>
                                            }
                                        </div>
                                </div>
                            </h2>

                                <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                    <div class="accordion-body">
                                    {ticketItem === "placeSection" ? 
                                        <div>
                                            <div className='row mb-3'>
                                                <div className='col-12'>
                                                    <div className='d-flex justify-content-center gap-4'>
                                                        <div className='d-flex align-items-center'>
                                                            <span className='empty me-2' style={{padding: '8px 12px', borderRadius: '8px'}}>
                                                                <i className="fa-solid fa-chair"></i>
                                                            </span>
                                                            <small>Ghế trống</small>
                                                        </div>
                                                        <div className='d-flex align-items-center'>
                                                            <span className='taken me-2' style={{padding: '8px 12px', borderRadius: '8px'}}>
                                                                <i className="fa-solid fa-chair"></i>
                                                            </span>
                                                            <small>Đã chọn</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <table class="table seat-table">
                                                <tbody>
                                                <tr>
                                                    <th scope="row">F</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="F1" className="empty" onClick={() => selectChair("F1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F2" className="empty" onClick={() => selectChair("F2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F3" className="empty" onClick={() => selectChair("F3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F4" className="empty" onClick={() => selectChair("F4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F5" className="empty" onClick={() => selectChair("F5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F6" className="empty" onClick={() => selectChair("F6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="F7" className="empty" onClick={() => selectChair("F7")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                                <tr>
                                                <th >E</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="E1" className="empty" onClick={() => selectChair("E1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="E2" className="empty" onClick={() => selectChair("E2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="E3" className="empty" onClick={() => selectChair("E3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="E4" className="empty" onClick={() => selectChair("E4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="E5" className="empty" onClick={() => selectChair("E5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="E6" className="empty" onClick={() => selectChair("E6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                                <tr>
                                                    <th>D</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="D1" className="empty" onClick={() => selectChair("D1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="D2" className="empty" onClick={() => selectChair("D2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="D3" className="empty" onClick={() => selectChair("D3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="D4" className="empty" onClick={() => selectChair("D4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="D5" className="empty" onClick={() => selectChair("D5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="D6" className="empty" onClick={() => selectChair("D6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                                <tr>
                                                    <th>C</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="C1" className="empty" onClick={() => selectChair("C1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="C2" className="empty" onClick={() => selectChair("C2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="C3" className="empty" onClick={() => selectChair("C3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="C4" className="empty" onClick={() => selectChair("C4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="C5" className="empty" onClick={() => selectChair("C5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="C6" className="empty" onClick={() => selectChair("C6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">B</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="B1" className="empty" onClick={() => selectChair("B1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B2" className="empty" onClick={() => selectChair("B2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B3" className="empty" onClick={() => selectChair("B3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B4" className="empty" onClick={() => selectChair("B4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B5" className="empty" onClick={() => selectChair("B5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B6" className="empty" onClick={() => selectChair("B6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B7" className="empty" onClick={() => selectChair("B7")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="B8" className="empty" onClick={() => selectChair("B8")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">A</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="A1" className="empty" onClick={() => selectChair("A1")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A2" className="empty" onClick={() => selectChair("A2")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A3" className="empty" onClick={() => selectChair("A3")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A4" className="empty" onClick={() => selectChair("A4")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A5" className="empty" onClick={() => selectChair("A5")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A6" className="empty" onClick={() => selectChair("A6")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A7" className="empty" onClick={() => selectChair("A7")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                    <td id="A8" className="empty" onClick={() => selectChair("A8")} style={{cursor: 'pointer'}}> <i class="fa-solid fa-chair"></i> </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                            : null}
                                            {ticketItem === "placeSection" ? (
                                                <div>
                                                    <p className='pt-2'>Màn hình</p>
                                                    <hr style={{height:"4px", color:"black"}}/>
                                                </div>
                                            )
                                            : null}
                                    </div>
                                </div>
                                
                                </div>

                        {/* Pay Section */}
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                                <div className='row pt-3 pb-1 px-4 align-items-center'>
                                        <div className='col-sm-6 text-start'>
                                            <h3>Thanh Toán</h3>
                                        </div>
                                        <div className='col-sm-6 mb-2 text-end'>
                                            {ticketItem === "paySection" ?
                                                <h3>Tổng Cộng : {(studentTicketNumber * 15.00 + adultTicketNumber * 25.00).toFixed(2)} ₺</h3>
                                            : null}
                                        </div>
                                      
                                </div>
                            </h2>
                            
                            <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                            {ticketItem == "paySection" ? 
                            <div class="accordion-body">
                                <Formik
                                    initialValues={{}}
                                    onSubmit={(values) => {
                                        let  result = ""
                                        chairNumberList.map(item => result = result + " " + item);

                                        values.chairNumbers = result;
                                        values.movieName = movieState?.movieName;
                                        values.saloonName= movieState?.saloonName;
                                        values.movieDay= movieState?.movieDay;
                                        values.movieStartTime= movieState?.movieTime;

                                        paymentService.sendTicketDetail(values).then(result => {
                                            navigate("/paymentSuccess")
                                        })
                                    }}>
                                    <Form className='row justify-content-center align-items-start'>
                                        <div className='col-sm-12 col-md-6'>
                                            <div className="imput-group form-floating has-validation mb-3">
                                                <KaanKaplanTextInput name="fullName" type="text" className="form-control" id="fullName" placeholder="Họ Tên" required/>
                                                <label htmlFor="fullName">Họ Tên</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <KaanKaplanTextInput name="email" type="email" className="form-control" id="email" placeholder="Email" required/>
                                                <label htmlFor="email">Email</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <KaanKaplanTextInput name="phone" type="tel" pattern="[0]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" className="form-control" id="phone" placeholder="Số Điện Thoại" required/>
                                                <label htmlFor="phone">Số Điện Thoại</label>
                                            </div>
                                            
                                           
                                        </div>

                                        <div className='col-sm-12 col-md-6 mb-3'>
                                            <div className="form-floating mb-3">
                                                <Cleave className="form-control" id="floatingCardNumber" placeholder='Số Thẻ Tín Dụng' required
                                                options={{creditCard:true}} />
                                                <label htmlFor="floatingCardNumber">Số Thẻ Tín Dụng</label>
                                            </div>
                                            <div className='row'>
                                                <div className='col-sm-6'>
                                                    <div className="form-floating mb-3">
                                                        <Cleave type="text" className="form-control" id="floatingCardLastDate" placeholder='Ngày Hết Hạn' required
                                                        options={{date:true, datePattern: ['m','y']}} />
                                                        <label htmlFor="floatingCardLastDate">Ngày Hết Hạn</label>
                                                    </div>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control"  maxLength="3" size="3"  id="floatingSecurityNumber" placeholder="Mã Bảo Mật" required/>
                                                        <label htmlFor="floatingSecurityNumber">CCV</label>
                                                    </div>
                                                </div>
                                                <p className='text-start'> <input className="form-check-input me-3" type="checkbox" value="" aria-label="Checkbox for following text input" required/>Tôi đã đọc và đồng ý với Điều khoản Dịch vụ và
                                                Chính sách Bảo mật.
                                            </p>
                                            </div>
                                        </div>

                                        <hr />
                                        <div className='text-end mt-1'>
                                            <button type='submit' className='btn btn-dark col-3'>Thanh Toán</button>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                            : null}
                            </div>
                        </div>
                    </div>



                </div>
            </div>


        </div>
     
        <ToastContainer />
    </div>
  )
}
