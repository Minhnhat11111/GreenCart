import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Profile = () => {
  const { user, setUser, axios, fetchUser } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.name !== (user?.name || '') ||
      formData.email !== (user?.email || '') ||
      (formData.currentPassword && formData.newPassword) ||
      avatar !== null
    )
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if there are any changes
    if (!hasChanges()) {
      toast.error('Không có gì thay đổi')
      return
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp')
      return
    }

    // If trying to change password, both current and new password are required
    if ((formData.currentPassword && !formData.newPassword) || (!formData.currentPassword && formData.newPassword)) {
      toast.error('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới')
      return
    }

    try {
      const updateData = new FormData()
      updateData.append('name', formData.name)
      updateData.append('email', formData.email)
      
      if (formData.currentPassword && formData.newPassword) {
        updateData.append('currentPassword', formData.currentPassword)
        updateData.append('newPassword', formData.newPassword)
      }
      
      if (avatar) {
        updateData.append('avatar', avatar)
      }

      const { data } = await axios.put('/api/user/update-profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success(data.message)
        // Update user in context
        setUser(data.user)
        await fetchUser()
        setIsEditing(false)
        setAvatar(null)
        setFormData({
          name: data.user.name,
          email: data.user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setAvatarPreview(data.user.avatar || '')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatar(null)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setAvatarPreview(user?.avatar || '')
  }

  return (
    <div className='mt-16 pb-16 max-w-2xl mx-auto'>
      <div className='flex flex-col items-center mb-8'>
        <h1 className='text-3xl font-medium text-gray-700 mb-2'>Hồ sơ</h1>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
        <div className='flex flex-col items-center mb-6'>
          <div className='relative'>
            <img 
              src={avatarPreview || assets.profile_icon} 
              alt='Profile' 
              className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
            />
            {isEditing && (
              <label className='absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-dull'>
                <input 
                  type='file' 
                  accept='image/*' 
                  onChange={handleAvatarChange}
                  className='hidden'
                />
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                </svg>
              </label>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tên </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100'
              />
            </div>

            {isEditing && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu hiện tại</label>
                  <input
                    type='password'
                    name='currentPassword'
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder='Enter current password to change password'
                    className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu mới</label>
                  <input
                    type='password'
                    name='newPassword'
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder='Enter new password (optional)'
                    className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Xác nhận mật khẩu mới</label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Confirm new password'
                    className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                </div>
              </>
            )}
          </div>

          <div className='flex gap-4 mt-6'>
            {!isEditing ? (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition'
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  type='submit'
                  disabled={!hasChanges()}
                  className={`px-6 py-2 text-white rounded-md transition ${
                    hasChanges() 
                      ? 'bg-primary hover:bg-primary-dull' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Lưu
                </button>
                <button
                  type='button'
                  onClick={handleCancel}
                  className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile

