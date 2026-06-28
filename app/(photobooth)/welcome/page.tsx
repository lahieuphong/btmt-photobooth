import WelcomeMainScreen from '@/src/features/photobooth/components/screens/welcome/WelcomeMainScreen'
import WelcomeRouteScreen from '@/src/features/photobooth/components/screens/welcome/WelcomeRouteScreen'

export default function WelcomePage() {
  return (
    <WelcomeRouteScreen>
      <WelcomeMainScreen />
    </WelcomeRouteScreen>
  )
}
