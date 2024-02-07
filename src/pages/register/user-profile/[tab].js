// ** Demo Components Imports
import AccountSettings from 'src/views/register/user-profile/AccountSettings'

// ** Configs
import LayoutWithAppBar from 'src/layouts/LayoutWithAppBar'

const AccountSettingsTab = ({ tab, apiPricingPlanData }) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

export const getStaticPaths = () => {
  return {
    paths: [{ params: { tab: 'profile' } },
      { params: { tab: 'password' } },
      { params: { tab: 'transaction' },},
      { params: { tab: 'notifications'}}
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

//AccountSettingsTab.getLayout = page => <LayoutWithAppBar>{page}</LayoutWithAppBar>

//AccountSettingsTab.guestGuard = true

export default AccountSettingsTab
