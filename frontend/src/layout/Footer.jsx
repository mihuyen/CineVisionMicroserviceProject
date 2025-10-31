import React from 'react'

export default function Footer() {
  return (
    <div>

        <footer className="py-5 bg-black">
            <div className="container px-5">
              <div className='row justify-content-evenly align-items-center'>
                <div className='col'>
                  <p className='m-1 lead text-center text-white'>Phim Đang Chiếu</p>
                  <p className='m-1 lead text-center text-white'>Phim Sắp Chiếu</p>
                  <p className='m-1 lead text-center text-white'>Rạp Chiếu Phim</p>
                </div>
                <div className='col'>
                  <p className='m-1 lead text-center text-white'>Vé Điện Tử</p>
                  <p className='m-1 lead text-center text-white'>Chính Sách Hoàn Tiền</p>
                  <p className='m-1 lead text-center text-white'>Điều Khoản Dịch Vụ</p>
                </div>
              </div>
              <p className="mt-5 text-center text-white small">
                <strong>
                   Bản quyền &copy; CineVision 2025
                </strong> 
              </p>
            </div>
        </footer>

    </div>
  )
}
