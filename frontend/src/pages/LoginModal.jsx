import { Form, Formik } from 'formik';
import React from 'react'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { UserService } from '../services/userService'
import { addUserToState, removeUserFromState } from '../store/actions/userActions';
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput';

export default function LoginModal() {

    const userService = new UserService();

    const dispatch = useDispatch();

    function login(loginDto) {
        dispatch(removeUserFromState())

        userService.login(loginDto).then(result => {

            if (result.status == 200) {
                dispatch(addUserToState(result.data))
    
                let closeButton = document.getElementById("close-button");
                closeButton.click();

                toast("Chào mừng bạn!", {
                    theme: "colored",
                    position: "top-center"
                })
            }
        }).catch(e => {
            toast.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại", {
                theme: "colored",
                position: "top-center"
            })
        })
    }


  return (
    <div>
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header login-modal-header">
                    <h5 className="modal-title" id="loginModalLabel">Đăng Nhập</h5>
                    <button id='close-button' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        onSubmit={(value) => {
                            login(value);
                        }}>
                        <Form>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <KaanKaplanTextInput id="loginEmail" type="email" name="email" className="form-control" placeholder="Email" required />
                                    <label htmlFor="loginEmail">Email</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <KaanKaplanTextInput id="loginPassword" type="password" name="password" className="form-control" placeholder="Mật khẩu" required />
                                    <label htmlFor="loginPassword">Mật khẩu</label>
                                </div>
                                <p className='ps-2 text-start'>
                                    Bạn chưa có tài khoản CineVision?
                                    <a href='!#' style={{color:"black"}}
                                        data-bs-toggle="modal" data-bs-target="#registerModal"> Đăng ký ngay </a>
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary login-modal-btn">Đăng Nhập</button>
                            </div>
                        </Form>
                    </Formik>

                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}
