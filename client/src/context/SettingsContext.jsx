import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'green';
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'vi';
  });

  // Theme colors
  const themes = {
    green: {
      primary: '#4fbf8b',
      primaryDull: '#44ae7c',
      name: 'Xanh lá'
    },
    blue: {
      primary: '#3b82f6',
      primaryDull: '#2563eb',
      name: 'Xanh dương'
    },
    purple: {
      primary: '#8b5cf6',
      primaryDull: '#7c3aed',
      name: 'Tím'
    },
    orange: {
      primary: '#f97316',
      primaryDull: '#ea580c',
      name: 'Cam'
    }
  };

  // Language translations
  const translations = {
    vi: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      contact: 'Liên hệ',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      profile: 'Hồ sơ',
      orders: 'Đơn hàng',
      settings: 'Cài đặt',
      theme: 'Giao diện',
      language: 'Ngôn ngữ',
      cart: 'Giỏ hàng',
      searchPlaceholder: 'Tìm kiếm sản phẩm',
      buyNow: 'MUA NGAY',
      exploreDeals: 'Khám phá deal hời',
      continueShopping: 'Tiếp tục mua sắm',
      categories: 'Danh mục sản phẩm',
      address: 'Địa chỉ',
      paymentMethod: 'Phương thức thanh toán',
      couponCode: 'Mã giảm giá',
      total: 'Tổng tiền',
      placeOrder: 'Đặt hàng',
      addAddress: 'Thêm địa chỉ',
      change: 'Thay đổi',
      delete: 'Xóa',
      apply: 'Áp dụng',
      cancel: 'Hủy',
      save: 'Lưu',
      edit: 'Chỉnh sửa'
    },
    en: {
      home: 'Home',
      products: 'Products',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      orders: 'Orders',
      settings: 'Settings',
      theme: 'Theme',
      language: 'Language',
      cart: 'Cart',
      searchPlaceholder: 'Search products',
      buyNow: 'BUY NOW',
      exploreDeals: 'Explore deals',
      continueShopping: 'Continue shopping',
      categories: 'Product Categories',
      address: 'Address',
      paymentMethod: 'Payment Method',
      couponCode: 'Coupon Code',
      total: 'Total',
      placeOrder: 'Place Order',
      addAddress: 'Add Address',
      change: 'Change',
      delete: 'Delete',
      apply: 'Apply',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit'
    }
  };

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-primary-dull', currentTheme.primaryDull);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    theme,
    language,
    themes,
    changeTheme,
    changeLanguage,
    t
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};