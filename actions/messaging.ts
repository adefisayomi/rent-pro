"use server"

import { messageKey } from "@/constants";
import admin, { adminDB } from "@/utils/firebaseAdmin";
import { currUser } from "./auth";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";


// Type for a single message
export type SingleMessage = {
  message: string;
  createdAt: string;
  images?: string[];
  fromSender: boolean;
};

// Full message thread
export type MessageProps = {
  threadId: string;
  senderId: string;
  receiverId: string;
  receiverName: string;
  senderName: string;
  senderImage?: string;
  createdAt: string;
  updatedAt?: string;
  message: SingleMessage[];
};

// Send a message or continue a thread
export const sendMessage = async (
  threadId: string | null,
  payload: Omit<SingleMessage, "fromSender" | "createdAt"> & { receiverId: string }
): Promise<{ success: boolean; data?: { threadId: string }; message?: string }> => {
  try {
    const { data: user, success, message } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized request");

    const messageRef = adminDB.collection(messageKey);
    const { message: text, images, receiverId } = payload;

    let fromSender = true;

    if (threadId) {
      // Existing thread: fetch and update
      const threadSnapshot = await messageRef.doc(threadId).get();
      const threadData = threadSnapshot.data();

      if (!threadData) throw new Error("Thread not found");

      fromSender = threadData.senderId === user.uid;

      const newMessage: SingleMessage = {
        message: text,
        images,
        createdAt: new Date().toISOString(),
        fromSender,
      };

      await threadSnapshot.ref.update({
        message: admin.firestore.FieldValue.arrayUnion(newMessage),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, data: { threadId } };
    } else {
      // New thread: get receiver's name
      const receiverSnapshot = await adminDB.collection("users").doc(receiverId).get();
      const receiverData = receiverSnapshot.data();

      const receiverName =
        receiverData?.displayName || receiverData?.email?.split("@").shift() || "Unnamed Receiver";

      const newMessage: SingleMessage = {
        message: text,
        images,
        createdAt: new Date().toISOString(),
        fromSender: true,
      };

      const docRef = await messageRef.add({
        senderId: user.uid,
        receiverId,
        senderName: user.displayName || user.email?.split("@").shift() || "Unnamed Sender",
        receiverName,
        senderImage: user.photoURL || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        message: [newMessage],
      });

      return { success: true, data: { threadId: docRef.id } };
    }
  } catch (err: any) {
    console.error("sendMessage error:", err.message);
    return { success: false, message: err.message };
  }
  finally{
    revalidatePath(Routes.dashboard.engagement.message);
  }
};



// Fetch all message threads for current user
export const getUserMessages = async (): Promise<{ success: boolean; data: MessageProps[] }> => {
  try {
    const { data: user, success, message } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized");

    const sentMessagesSnapshot = await adminDB
      .collection(messageKey)
      .where("senderId", "==", user.uid)
      .get();

    const receivedMessagesSnapshot = await adminDB
      .collection(messageKey)
      .where("receiverId", "==", user.uid)
      .get();

    const combinedDocs = [...sentMessagesSnapshot.docs, ...receivedMessagesSnapshot.docs];

    // Deduplicate threads by threadId (doc.id)
    const uniqueThreads = new Map<string, MessageProps>();
    for (const doc of combinedDocs) {
      const data = doc.data();

      const thread: MessageProps = {
        threadId: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        senderName: data.senderName,
        receiverName: data.receiverName || "", // fallback in case old data doesn't have it
        senderImage: data.senderImage,
        createdAt: data.createdAt?.toDate?.().toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() || data.updatedAt,
        message: data.message || [],
      };

      uniqueThreads.set(doc.id, thread);
    }

    return {
      success: true,
      data: Array.from(uniqueThreads.values()),
    };
  } catch (err: any) {
    console.error("getUserMessages error:", err.message);
    return { success: false, data: [] };
  }
};

// Delete an entire message thread
export const deleteMessageThread = async (
  threadId: string
): Promise<{ success: boolean }> => {
  try {
    const { data: user, success, message } = await currUser();
    if (!success || !user?.uid) throw new Error(message || "Unauthorized");

    const docRef = adminDB.collection(messageKey).doc(threadId);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Thread not found");

    const data = doc.data();
    if (data?.senderId !== user.uid && data?.receiverId !== user.uid) {
      throw new Error("Not authorized to delete this thread");
    }

    await docRef.delete();

    revalidatePath(Routes.dashboard.engagement.message);

    return { success: true };
  } catch (err: any) {
    console.error("deleteMessageThread error:", err.message);
    return { success: false };
  }
};

