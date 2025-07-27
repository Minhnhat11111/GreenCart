import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const { theme, language, themes, changeTheme, changeLanguage, t } = useSettings();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('settings')}</h1>
        
        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('theme')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(themes).map(([key, themeData]) => (
              <div
                key={key}
                onClick={() => changeTheme(key)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  theme === key 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div 
                  className="w-full h-8 rounded mb-2"
                  style={{ backgroundColor: themeData.primary }}
                ></div>
                <p className="text-sm font-medium text-center">{themeData.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">{t('language')}</h2>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="language"
                value="vi"
                checked={language === 'vi'}
                onChange={(e) => changeLanguage(e.target.value)}
                className="mr-3"
              />
              <span className="text-lg">🇻🇳 Tiếng Việt</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                className="mr-3"
              />
              <span className="text-lg">🇺🇸 English</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;