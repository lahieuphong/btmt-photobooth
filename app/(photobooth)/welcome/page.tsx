import WelcomeLoadingScreen from '@/src/features/photobooth/components/screens/welcome/WelcomeLoadingScreen'
import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'

export default function WelcomePage() {
  return <WelcomeLoadingScreen redirectTo={PHOTOBOOTH_ROUTES.WELCOME} />
}
