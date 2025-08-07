import { Amplify } from 'aws-amplify';

console.log('✅ Amplify import successful');

// Simple static configuration for now
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_vD1EVDicv',
      userPoolClientId: '420frvbskrgums2et91q6so0oj',
      identityPoolId: 'us-east-1:ecd35830-ad3d-41a4-8dcf-5d1f51091aca',
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://y63hscsqanfelkwcjewpvrzttq.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  }
};

try {
  Amplify.configure(amplifyConfig);
  console.log('✅ Amplify configured successfully');
} catch (error) {
  console.error('❌ Failed to configure Amplify:', error);
}