import type { CapacitorConfig } from '@capacitor/cli'

// The iOS project (ios/) is created on a Mac with `npx cap add ios`; see deploy/README.md.
const config: CapacitorConfig = {
  appId: 'nl.gymbuddy.app',
  appName: 'GymBuddy',
  webDir: '.output/public',
  ios: {
    contentInset: 'never'
  }
}

export default config
