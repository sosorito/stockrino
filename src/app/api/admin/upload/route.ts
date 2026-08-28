import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { createMedia } from "@/lib/data/media";
import { slugify } from "@/lib/utils";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_WIDTH = 1920;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = String(formData.get("altText") || "");
    const title = String(formData.get("title") || "");
    const caption = String(formData.get("caption") || "");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload JPEG, PNG, WebP, GIF, or SVG." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File is too large (max 10MB)." }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    const baseName = slugify(path.parse(file.name).name) || "image";
    const id = randomUUID().slice(0, 8);
    let width: number | undefined;
    let height: number | undefined;
    let ext = path.extname(file.name).toLowerCase() || ".jpg";
    let mimeType = file.type;

    if (file.type !== "image/svg+xml" && file.type !== "image/gif") {
      try {
        const img = sharp(buffer, { failOn: "none" });
        const meta = await img.metadata();
        width = meta.width;
        height = meta.height;

        let pipeline = img;
        if (meta.width && meta.width > MAX_WIDTH) {
          pipeline = pipeline.resize({ width: MAX_WIDTH });
        }

        if (file.type === "image/png") {
          buffer = await pipeline.png({ compressionLevel: 8 }).toBuffer();
          ext = ".png";
        } else if (file.type === "image/webp") {
          buffer = await pipeline.webp({ quality: 82 }).toBuffer();
          ext = ".webp";
        } else {
          buffer = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          ext = ".jpg";
          mimeType = "image/jpeg";
        }

        const finalMeta = await sharp(buffer).metadata();
        width = finalMeta.width;
        height = finalMeta.height;
      } catch {
        // fall back to storing original buffer unmodified
      }
    }

    const filename = `${baseName}-${id}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    const media = await createMedia({
      filename,
      url,
      title: title || file.name,
      altText: altText || title || file.name,
      caption,
      width,
      height,
      size: buffer.length,
      mimeType,
    });

    return NextResponse.json({ ok: true, media });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
