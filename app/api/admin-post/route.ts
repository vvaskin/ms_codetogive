import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeFilename(file: File, index: number) {
  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "MAKE_WEBHOOK_URL is not configured." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the uploaded form." },
      { status: 400 },
    );
  }

  const description = String(formData.get("description") ?? "").trim();
  if (!description) {
    return NextResponse.json(
      { error: "A description is required." },
      { status: 400 },
    );
  }

  const photos = formData.getAll("photos").filter((entry): entry is File => entry instanceof File);
  if (photos.length === 0) {
    return NextResponse.json(
      { error: "At least one photo is required." },
      { status: 400 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const origin =
    process.env.PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    new URL(request.url).origin;
  const imageUrls: string[] = [];

  try {
    for (const [index, photo] of photos.entries()) {
      if (!ALLOWED_TYPES.has(photo.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${photo.type || photo.name}` },
          { status: 400 },
        );
      }
      const filename = safeFilename(photo, index);
      await writeFile(
        path.join(uploadDir, filename),
        Buffer.from(await photo.arrayBuffer()),
      );
      imageUrls.push(`${origin}/uploads/${filename}`);
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to save the uploaded photos." },
      { status: 500 },
    );
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.MAKE_WEBHOOK_API_KEY) {
      headers["x-make-apikey"] = process.env.MAKE_WEBHOOK_API_KEY;
    }
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ description, imageUrls }),
    });
    const responseText = await response.text();
    return NextResponse.json({
      ok: true,
      webhookStatus: response.status,
      webhookResponse: responseText,
      description,
      imageUrls,
    });
  } catch {
    return NextResponse.json(
      { error: "The webhook could not be triggered." },
      { status: 502 },
    );
  }
}
