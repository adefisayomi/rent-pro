import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
 
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();
 
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {    
        enabled: true
    },
    socialProviders: { 
        google: { 
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!, 
        } 
    }, 
});