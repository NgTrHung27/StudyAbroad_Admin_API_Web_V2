import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";

interface UserWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    public_metadata?: { role?: string };
  };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set in environment");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: UserWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as UserWebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    const userId = data.id;
    const email = data.email_addresses[0]?.email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const name = [firstName, lastName].filter(Boolean).join(" ") || "User";

    console.log(`New user created via Clerk: ${email} (${userId})`);

    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: "ADMIN",
        },
      });
      console.log(`Role set to ADMIN for user: ${email}`);
    } catch (error) {
      console.error("Error setting role:", error);
    }
  }

  if (type === "user.updated") {
    console.log(`User updated: ${data.email_addresses[0]?.email_address}`);
  }

  return NextResponse.json({ success: true });
}
