import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import SafeScreen from "../components/SafeScreen"; // Adjust the path as necessary

export default function RootLayout() {
  const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey;
  return (
    
    <ClerkProvider publishableKey={publishableKey}>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor:COLORS?.background }}>
          <Slot/>
      </SafeAreaView> */}
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider >
  )
}
