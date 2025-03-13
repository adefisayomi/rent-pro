"use server";



import { IncomingForm } from "formidable";
import fs from "fs/promises";

import mongoose from "mongoose";
import Grid from "gridfs-stream";

const conn = mongoose.createConnection(process.env.MONGODB_URI!);

let gfs: any = null;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});


export async function uploadImageToMongo(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) throw new Error("No file uploaded");

  const buffer = await file.arrayBuffer();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });

  const writeStream = gfs.createWriteStream({
    filename: file.name,
    contentType: file.type,
    bucketName: "uploads",
  });

  stream.pipeTo(writeStream);

  return { success: true, message: "File uploaded" };
}



