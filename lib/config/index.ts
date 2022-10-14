/**
 * AWS Account
 */
 export const awsAccount = {
  id: "052052871007",
  accountName: "Example" // keep it without spaces
};

/**
 * App Config
 */
 export const appConfig = {
  appName: "Example", // keep it without spaces
  frontend: {
    sourceCodeOwner: "CodeExitos",
    sourceCodeRepository: "example",
    ghTokenSecret: "example-gh-token", // this is the name of the Secret in AWS Secrets Manager
    environment: {}
  }
};