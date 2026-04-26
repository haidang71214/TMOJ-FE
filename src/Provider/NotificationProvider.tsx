import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "@/constants";
import { NotificationEndpoint } from "@/constants/endpoints";

import { NotificationDto } from "@/types/notification";

type NotificationContextType = {
  notifications: NotificationDto[];
  connection: signalR.HubConnection | null;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
};

type NotificationProviderProps = {
  children: ReactNode;
  userId: string | null;
};

export const NotificationProvider = ({
  children,
  userId
}: NotificationProviderProps) => {

  const [connection, set_connection] = useState<signalR.HubConnection | null>(null);
    const [notifications, set_notifications] = useState<NotificationDto[]>([]);

  useEffect(() => {
    if (!userId) return;

    // connect SignalR hub
    const hub_connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notificationHub`)
      .withAutomaticReconnect()
      .build();

    hub_connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        hub_connection.invoke("JoinUserGroup", userId);
      })
      .catch((err) => console.log(err));

    // realtime notification
    hub_connection.on("ReceiveNotification", (notification: NotificationDto) => {
      console.log("New notification:", notification);

      set_notifications((prev) => [notification, ...prev]);
    });

    set_connection(hub_connection);

    // load notification ban đầu
    fetch(`${BASE_URL}${NotificationEndpoint.GET_NOTIFICATION_BY_USER.replace("{userId}", userId)}`)
      .then(res => res.json())
      .then(data => set_notifications(data));

    return () => {
      hub_connection.stop();
    };

  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        connection
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};