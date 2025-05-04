export interface FirebaseConfig {
  port: number;
  host: string;
  environment: string;
  storagePath: string;
  adminMail: string;
  firebase: {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    clientX509CertUrl: string;
  };
}
