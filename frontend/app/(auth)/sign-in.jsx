import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles'; // Adjust the path as necessary
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
  const router = useRouter()

  const {signIn,setActive,isLoaded}=useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if(!email|| !password){
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    if(!isLoaded) 
        return;

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === 'complete') {
        // Sign-in was successful
        await setActive({ session: signInAttempt.createdSessionId });
        // router.push('/home'); // Navigate to home screen after successful sign-in
      } else {
        // Handle other statuses like 'needs_action' or 'failed'
        Alert.alert('Sign-in required', 'Please complete the sign-in process.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please check your credentials and try again.');
    }
  finally {
        setLoading(false);
      }
    

  }


  return (
    <View style ={authStyles.container}>
     
        <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "android" ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0}>
          <ScrollView
            contentContainerStyle={authStyles.scrollContent}
            showsVerticalScrollIndicator={false}>            
            <View style={authStyles.imageContainer}>
              <Image
                source={require('../../assets/images/i1.png')} // Adjust the path as necessary  
                style={authStyles.image}
                containerFit='contain'/>
            </View>

              <Text style={authStyles.title}>Welcome Back</Text>

              {/* Form Container  */}
              <View style={authStyles.formContainer}>
                {/*Email Inputs*/}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Inputs */}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter Password"
                    placeholderTextColor={COLORS.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={authStyles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={COLORS.textLight}
                      />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[authStyles.authButton,loading && authStyles.
                    buttonDisabled]}
                    onPress={handleSignIn}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                  

                <Text style={authStyles.buttonText}>{loading ? "Signing In...":
                  "Sign In"}</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                  style={authStyles.linkContainer}
                  onPress={() => router.push('/(auth)/sign-up')}>

                    <Text style={authStyles.linkText}>
                      Don&apos;t have an account?
                        <Text style={authStyles.link}>Sign Up</Text> 
                    </Text>
                </TouchableOpacity>

              </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  
  )
}

export default SignIn