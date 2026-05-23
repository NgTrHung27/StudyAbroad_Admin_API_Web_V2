"use server";

import { db } from "@/lib/db";

let adminInitialized = false;
let firebaseAdmin: typeof import("firebase-admin") | null = null;

async function getFirebaseAdmin() {
  if (adminInitialized && firebaseAdmin) {
    return firebaseAdmin;
  }

  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
    let serviceAccountStr: string;

    if (serviceAccountBase64) {
      serviceAccountStr = Buffer.from(serviceAccountBase64, "base64").toString("utf-8");
    } else {
      serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "";
    }

    if (!serviceAccountStr) {
      console.warn("Firebase service account is not set");
      return null;
    }

    const serviceAccount = JSON.parse(serviceAccountStr);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    
    const { default: admin } = await import("firebase-admin");
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    
    adminInitialized = true;
    firebaseAdmin = admin;
    return admin;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    adminInitialized = true;
    return null;
  }
}

export const UpsertNotificationToken = async (
  token: string,
  userId: string
) => {
  try {
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
      await db.notificationToken.create({
        data: {
          token,
          userId,
        },
      });
    }

    return {
      success:
        "Cập nhật mã token thông báo thành công. Bắt đầu nhận thông báo!",
    };
  } catch (error) {
    console.error("Error upserting notification token", error);

    return { error: "Có lỗi xảy ra khi cập nhật token thông báo" };
  }
};

// Gửi thông báo đến tất cả người dùng
export const SendGeneralNotifications = async (
  title: string,
  body: string,
  link?: string
) => {
  try {
    const tokens = await db.notificationToken.findMany({
      select: {
        token: true,
        userId: true,
      },
    });

    const admin = await getFirebaseAdmin();
    
    if (admin) {
      const messaging = admin.messaging();
      await Promise.all(
        tokens.map((token) => {
          const payload = {
            token: token.token,
            notification: {
              title,
              body,
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
            webpush: {
              fcmOptions: {
                link,
              },
            },
          };

          return admin.messaging().send(payload);
        })
      );
    }

    await db.notificationPush.createMany({
      data: tokens.map((token) => ({
        receiverId: token.userId,
        title,
        body,
        type: "ANNOUNCEMENT",
        senderName: "CEMC Co,. Ltd",
      })),
    });
    return { success: "Gửi thông báo thành công" };
  } catch (error) {
    console.error("Error sending notification", error);

    return { error: "Có lỗi xảy ra khi gửi thông báo" };
  }
};

export const GetNotificationsPush = async (userId: string) => {
  try {
    const notifications = await db.notificationPush.findMany({
      where: {
        receiverId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { notifications };
  } catch (error) {
    console.error("Error fetching notifications", error);

    return { error: "Có lỗi xảy ra khi lấy thông báo" };
  }
};

export const MarkNotificationAsRead = async (notificationId: string) => {
  try {
    await db.notificationPush.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return { success: "Đánh dấu thông báo thành công" };
  } catch (error) {
    console.error("Error marking notification as read", error);

    return { error: "Có lỗi xảy ra khi đánh dấu thông báo" };
  }
};
