import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getSession } from "@/lib/session";

const f = createUploadthing();

async function requireStaff() {
  const session = await getSession();
  if (!session || (session.role !== "STAFF" && session.role !== "ADMIN")) {
    throw new Error("Unauthorized: staff access required");
  }
  return { userId: session.sub };
}

async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: sign in required");
  }
  return { userId: session.sub };
}

/** Store image uploads (products, categories). Staff/admin only, 4MB max, 1 file. */
export const uploadRouter = {
  storeImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => requireStaff())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Upload complete: ${file.ufsUrl} by user ${metadata.userId}`);
      return { url: file.ufsUrl };
    }),
  /** Profile avatars. Any signed-in user, 2MB max, 1 file. */
  avatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(() => requireUser())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Avatar upload complete: ${file.ufsUrl} by user ${metadata.userId}`);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
