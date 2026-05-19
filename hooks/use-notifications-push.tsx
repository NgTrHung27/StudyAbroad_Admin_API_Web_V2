"use client";

import { GetNotificationsPush } from "@/action/notification";
import { useUser } from "@clerk/nextjs";
import { NotificationPush } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useNotificationsPush = () => {
  const router = useRouter();
  const { user } = useUser();
  const loading = useRef(false);
  const hasShownError = useRef(false);

  const [notifications, setNotifications] = useState<NotificationPush[] | undefined>(undefined);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    if (loading.current) return;

    loading.current = true;
    hasShownError.current = false;

    try {
      const res = await GetNotificationsPush(user.id);
      
      if (res.error) {
        if (!hasShownError.current) {
          toast.error(res.error);
          hasShownError.current = true;
        }
      } else if (res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      if (!hasShownError.current) {
        toast.error("Có lỗi xảy ra khi tải thông báo");
        hasShownError.current = true;
      }
    } finally {
      loading.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  return { notifications, loadNotifications };
};
