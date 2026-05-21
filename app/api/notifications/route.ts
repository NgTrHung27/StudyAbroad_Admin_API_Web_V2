import { db } from "@/lib/db";
import admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
      ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, "base64").toString("utf-8")
      : process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    const serviceAccount = JSON.parse(serviceAccountJson as string);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.warn("Firebase Admin SDK initialization failed:", error);
  }
}

export async function POST(request: NextRequest) {
  const { userId, token } = await request.json();

  try {
    if (userId) {
      const existingToken = await db.notificationToken.findFirst({
        where: {
          userId,
        },
      });

      if (existingToken) {
        await db.notificationToken.update({
          where: {
            id: existingToken.id,
          },
          data: {
            token,
          },
        });
      } else {
        const payload = {
          token,
          notification: {
            title: "Welcome to CEMC",
            body: "You will now receive notifications from CEMC",
          },
          android: {
            notification: {
              clickAction: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
          apns: {
            payload: {
              aps: {
                category: "CEMC",
              },
            },
          },
        };

        try {
          await admin.messaging().send(payload);
        } catch (fcmError) {
          console.warn("FCM send failed:", fcmError);
        }

        await db.notificationToken.create({
          data: {
            token,
            userId,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Cập nhật token thông báo thành công",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng đăng nhập để nhận được thông báo",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("ERROR UPDATE TOKEN", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Định dạng JSON không hợp lệ" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Lỗi cập nhật token thông báo" },
      { status: 500 }
    );
  }
}
