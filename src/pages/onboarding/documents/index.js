import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

// ** Styled Components
import toast from 'react-hot-toast'
import ActivationCard from 'src/layouts/components/card/activation-card'
import ActivationCardProgress from 'src/layouts/components/card/activation-card-progress'
import Notice from 'src/views/onboard-documents/notice'
import { getOnboardingStatus, resetOnboardingStatus } from 'src/store/apps/onboarding'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const OnboardingDashboard = () => {
  const dispatch = useDispatch()
  const auth = useAuth()
  const { t } = useTranslation()

  const { onboardingStatus, onboardLoading, error, responseStatus, message, messageCode } = useSelector(
    state => state.onboarding
  )

  useEffect(() => {
    dispatch(
      getOnboardingStatus({
        function: 'GETSTATUS',
        scope: 'BYID',
        data: {
          query_params: {
            value: auth.user?.source_id
          }
        }
      })
    )
  }, [dispatch, auth.user.source_id])

  useEffect(() => {
    if (responseStatus === 'SUCCESS' && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY') {
      toast.success(message)
      dispatch(resetOnboardingStatus())
    } else if (message && messageCode !== 'DATA_RETRIEVED_SUCCESSFULLY' && messageCode !== 'NO_RESULT_FOUND') {
      toast.error(message)
      dispatch(resetOnboardingStatus())
    } else {
      dispatch(resetOnboardingStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus])

  const totalKeys = onboardingStatus && Object?.keys(onboardingStatus)?.length;

  const count =
    onboardingStatus && Object.values(onboardingStatus).length > 0
      ? Object.values(onboardingStatus).filter(stat => stat === 'APPROVED').length
      : 0

  const progress = ((count / totalKeys) * 75) + 25; // default 25% progress added for all onboarding status

  const onboardingData = [
    {
      title: 'Personal Info',
      avatarIcon: 'mdi:user',
      subTitle: 'This data helps us to confirm your individual legal details Involvement in the business',
      status: onboardingStatus?.personal_info_status,
      secLink: 'personal-info'
    },
    {
      title: 'Business Info',
      avatarIcon: 'mdi:bag-suitcase',
      subTitle: 'We are required by law to gather information regarding your business information',
      status: onboardingStatus?.business_info_status,
      secLink: 'business-info'
    },
    {
      title: 'Business Address',
      avatarIcon: 'mdi:map-marker',
      subTitle: 'This data helps us to navigate to your place of business in future',
      status: onboardingStatus?.business_address_status,
      secLink: 'business-address'
    },
    {
      title: 'Representatives Info',
      avatarIcon: 'mdi:account-group-outline',
      subTitle: 'List of Representatives',
      status: onboardingStatus?.representatives_info_status,
      secLink: 'representatives-info'
    },
    {
      title: 'Stockholders Info',
      avatarIcon: 'mdi:account-group-outline',
      subTitle: 'List of Stockholders',
      status: onboardingStatus?.stockholders_info_status,
      secLink: 'stockholders-info'
    },
    // {
    //   title: 'Directors Info',
    //   avatarIcon: 'mdi:account-group-outline',
    //   subTitle: 'List of Directors',
    //   status: onboardingStatus?.directors_info_status,
    //   secLink: 'directors-info'
    // },
    {
      title: 'Bank Info',
      avatarIcon: 'mdi:bank',
      subTitle: 'This data helps us to transfer your funds to and from your business account',
      status: onboardingStatus?.bank_info_status,
      secLink: 'bank-info'
    }
  ]

  const renderData = () => {
    return onboardingData.map((item, index) => {
      return (
        <Grid item xs={6} key={index}>
          <ActivationCard
            title={t(item.title)}
            subTitle={t(item.subTitle)}
            avatarIcon={item.avatarIcon}
            status={item.status}
            secLink={item.secLink}
          />
        </Grid>
      )
    })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={6} sx={{ maxWidth: '100%', pb: 10, px: 60 }}>
        <Grid item xs={12}>
            <ActivationCardProgress progress={progress} />
        </Grid>
        {renderData()}
      </Grid>
    </Box>
  )
}

//OnboardingDashboard.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>
//OnboardingDashboard.guestGuard = true

export default OnboardingDashboard
