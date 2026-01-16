import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PrivacyAgreement: React.FC = () => {
  const router = useRouter();

  const handleAgree = async () => {
 
      
    //   const { data } = await supabase.auth.getUser();
    //   const user = data?.user;
    //   if (user?.id) {
        
    //     const { error } = await supabase
    //       .from("users")
    //       .upsert({ id: user.id });
    //     if (error) {
    //       console.warn("Failed to record acceptance:", error.message);
    //     }
    //   }
    // } catch (err) {
    //   console.warn("Error recording acceptance:", err);
    
    // }

    
    router.push('../SurveyForm/SurveyForm');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={{ color: '#0B1956' }}>glus</Text>
          <Text style={{ color: '#446CC3' }}>co</Text>
        </Text>
      </View>

      <Text style={styles.title}>Your health, Your control</Text>

      <Text style={styles.description}>
        We care about your privacy and want you to feel safe while using our app. By signing up, you agree that:
      </Text>

      <View style={styles.bulletContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.bulletText}>
          Your info helps us give you personalized health insights, and it will always stay private.
        </Text>
      </View>

      <View style={styles.bulletContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.bulletText}>You can delete your data anytime.</Text>
      </View>

      <View style={styles.bulletContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.bulletText}>
          By signing up, you agree to our{' '}
          <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy.</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAgree}>
        <Text style={styles.buttonText}>I Agree</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacyAgreement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 120,
  },
  header: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Montserrat',
    fontWeight: '700',
  },
  title: {
    color: 'rgba(16, 22, 34, 0.9)',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    color: '#717784',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
    width: 310,
    marginBottom: 30,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 310,
    marginBottom: 20,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0B1956',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 3,
  },
  bulletText: {
    color: '#717784',
    fontSize: 15,
    fontFamily: 'Inter',
    lineHeight: 22.5,
    flexShrink: 1,
  },
  linkText: {
    color: '#0B1956',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0B1956',
    borderRadius: 32,
    width: 265,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  
});
