import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const useLogout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove JWT token from storage
      await AsyncStorage.removeItem('jwtToken');

      // Optionally clear other user data if needed
      // await AsyncStorage.removeItem('userData');

      // Navigate back to login screen (replace stack so they can't go back
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return handleLogout;
};

export default useLogout;
