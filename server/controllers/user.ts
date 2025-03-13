import shortid from 'shortid';
import User, { DbUserType } from '../models/user';
import { errorMessage } from '@/constants';
import emailValidator from 'email-validator';
import argon from 'argon2'

// Function to create a new user
async function createUser(payload: { email: string }) {
    try {
        const { email } = payload;

        // Validate email
        if (!email || !emailValidator.validate(email)) {
            throw new Error('Invalid email address!');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return {
                success: true,
                message: "User already exists",
                data: existingUser,
            };
        }

        // Generate a unique username
        let baseUsername = email.split("@")[0];
        let username = baseUsername;
        let usernameExists = await User.exists({ username });

        while (usernameExists) {
            username = `${baseUsername}_${shortid.generate()}`;
            usernameExists = await User.exists({ username });
        }

        // Create and save new user
        const user = new User({ email, username });
        await user.save()

        return {
            success: true,
            message: "User created successfully",
            data: user,
        };
    } catch (err: any) {
        return errorMessage(err.message);
    }
}

// Function to update user details
async function updateUser(userId: string, updates: Partial<DbUserType>) {
    try {
        // Validate updates
        if (!userId || !updates) throw new Error('Invalid request');

        // Find and update the user
        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
            lean: true, // Return plain object for better performance
        });

        if (!user) {
            return {
                success: false,
                message: "User not found",
                data: null,
            };
        }

        return {
            success: true,
            message: "User updated successfully",
            data: user,
        };
    } catch (err: any) {
        return errorMessage(err.message);
    }
}

// Function to get user details by email, username, or userId
async function getUser(identifier: string) {
    try {
        if (!identifier) throw new Error('Invalid request');

        const query = 
            identifier.includes('@') ? { email: identifier } :
            identifier.length === 24 ? { _id: identifier } : // Check for MongoDB ObjectId
            { username: identifier };

        const user = await User.findOne(query).lean();

        if (!user) {
            return {
                success: false,
                message: "User not found",
                data: null,
            };
        }

        return {
            success: true,
            message: "User retrieved successfully",
            data: user,
        };
    } catch (err: any) {
        return errorMessage(err.message);
    }
}

async function signinOrSignupUser (email: string, password: string) {
    try {
        // Validate email
        if (!email || !emailValidator.validate(email) || !password) throw new Error('Invalid request!');

        // Check if user already exists
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            const passwordMatch = await argon.verify(password, existingUser.password)
            if (!passwordMatch) throw new Error('invalid request!')
                // 
            const returnUser = await User.findOne({ email }).select("-password")
            return {
                success: true,
                message: "User already exists",
                data: returnUser,
            };
        }

        // Generate a unique username
        let baseUsername = email.split("@")[0];
        let username = baseUsername;
        let usernameExists = await User.exists({ username });

        while (usernameExists) {
            username = `${baseUsername}_${shortid.generate()}`;
            usernameExists = await User.exists({ username });
        }

        // Create and save new user
        const passwordHash = await argon.hash(password)
        const user = new User({ email, username, password: passwordHash });
        await user.save()

        return {
            success: true,
            message: "User created successfully",
            data: user,
        };
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

export { createUser, updateUser, getUser, signinOrSignupUser };
