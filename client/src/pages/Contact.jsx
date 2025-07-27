import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useSettings } from '../context/SettingsContext'
import toast from 'react-hot-toast'

const Contact = () => {
  const { t } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className='mt-16 pb-16'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-16 mb-16'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-3xl md:text-5xl font-bold text-gray-800 mb-4'>
            Liên hệ với chúng tôi
          </h1>
          <p className='text-lg md:text-xl text-gray-600 mb-8'>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
          </p>
          <div className='flex justify-center'>
            <div className='w-24 h-1 bg-primary rounded-full'></div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16'>
        {/* Thông tin liên hệ */}
        <div className='space-y-8'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
              Thông tin liên hệ
            </h2>
            <p className='text-gray-600 text-lg leading-relaxed'>
              Hãy liên hệ với chúng tôi qua các kênh dưới đây hoặc điền form bên cạnh. 
              Đội ngũ hỗ trợ khách hàng của chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </p>
          </div>

          {/* Contact Cards */}
          <div className='space-y-6'>
            <div className='flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg mb-1'>Địa chỉ</h3>
                <p className='text-gray-600'>128 Đường Sư Vạn Hạnh, Quận 10, TP.HCM</p>
                <p className='text-gray-600'>Việt Nam</p>
              </div>
            </div>

            <div className='flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg mb-1'>Điện thoại</h3>
                <p className='text-gray-600'>+84 355 855 155</p>
                <p className='text-gray-600'>+84 988 899 899</p>
              </div>
            </div>

            <div className='flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg mb-1'>Email</h3>
                <p className='text-gray-600'>nguyenminhtri@greencart.vn</p>
                <p className='text-gray-600'>info@greencart.vn</p>
              </div>
            </div>

            <div className='flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg mb-1'>Giờ làm việc</h3>
                <p className='text-gray-600'>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p className='text-gray-600'>Thứ 7 - CN: 9:00 - 17:00</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className='font-semibold text-gray-800 text-lg mb-4'>Theo dõi chúng tôi</h3>
            <div className='flex gap-4'>
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a key={social} href='#' className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors'>
                  <span className='text-sm font-medium uppercase'>{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
            Gửi tin nhắn
          </h2>
          
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
                  placeholder='Nhập họ và tên'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
                  placeholder='Nhập số điện thoại'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email *
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
                placeholder='Nhập địa chỉ email'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Chủ đề
              </label>
              <select
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
              >
                <option value=''>Chọn chủ đề</option>
                <option value='support'>Hỗ trợ kỹ thuật</option>
                <option value='order'>Vấn đề đơn hàng</option>
                <option value='product'>Thông tin sản phẩm</option>
                <option value='partnership'>Hợp tác kinh doanh</option>
                <option value='other'>Khác</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tin nhắn *
              </label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none'
                placeholder='Nhập nội dung tin nhắn...'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-primary text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-dull transition-colors text-lg'
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className='mt-16'>
        <div className='bg-primary-dull/10 rounded-2xl p-8 text-center'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>Vị trí cửa hàng</h3>
          <p className='text-gray-600 mb-6'>Ghé thăm cửa hàng của chúng tôi để trải nghiệm sản phẩm trực tiếp</p>
          <div className='bg-gray-200 rounded-lg h-64 overflow-hidden'>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=128+Sư+Vạn+Hạnh,+Quận+10,+TP.HCM&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
</div>
        </div>
      </div>
    </div>
  )
}

export default Contact