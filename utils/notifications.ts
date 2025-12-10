import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Set default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,        
    shouldPlaySound: true,         
    shouldSetBadge: false,         
    shouldShowBanner: true,        
    shouldShowNotification: true, 
    shouldShowList: true,         
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

// Show a generic notification
export const showNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    console.log("Notification permission not granted");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Show immediately
  });
};

// Task limit reached notification
export const notifyMaxTasksReached = async () => {
  await showNotification(
    "Task Limit Reached!",
    "You've added the maximum allowed tasks. Delete some to add more.",
    { type: "max_tasks" }
  );
};

// Task added notification
export const notifyTaskAdded = async (taskTitle: string) => {
  await showNotification(
    "Task Added!",
    `"${taskTitle}" has been successfully added to your tasks.`,
    { type: "task_added" }
  );
};

// Task deleted notification
export const notifyTaskDeleted = async (taskTitle: string) => {
  await showNotification(
    "Task Deleted",
    `"${taskTitle}" has been removed from your tasks.`,
    { type: "task_deleted" }
  );
};

// Task completed notification
export const notifyTaskCompleted = async (taskTitle: string) => {
  await showNotification(
    "Task Completed!",
    `"${taskTitle}" has been marked as completed.`,
    { type: "task_completed" }
  );
};
