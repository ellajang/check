// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Config
import authConfig from 'src/configs/auth'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

import Avatar from 'src/@core/components/mui/avatar'

const avatarItems = [
  {
    name: 'English',
    src: '/images/logo/usa.png'
  },
  {
    name: 'Korean',
    src: '/images/logo/korean.png'
  }
]

const LanguageDropdown = ({ settings, saveSettings }) => {
  // ** Hook
  const { i18n } = useTranslation()

  const handleLangItemClick = lang => {
    localStorage.setItem(authConfig.selectedLanguage, lang)
    i18n.changeLanguage(lang)
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  const icon =
    i18n.language === 'en' ? (
      <Avatar sx={{ height: 20, width: 20, objectFit: 'contain', marginRight: 1 }} src={avatarItems[0].src} />
    ) : (
      <Avatar sx={{ height: 20, width: 20, objectFit: 'contain', marginRight: 1 }} src={avatarItems[1].src} />
    )

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={icon}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          icon: (
            <Avatar sx={{ height: 20, width: 20, objectFit: 'contain', marginRight: 1 }} src={avatarItems[0].src} />
          ),
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          icon: (
            <Avatar sx={{ height: 20, width: 20, objectFit: 'contain', marginRight: 1 }} src={avatarItems[1].src} />
          ),
          text: '한국어',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'ko',
            onClick: () => {
              handleLangItemClick('ko')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
