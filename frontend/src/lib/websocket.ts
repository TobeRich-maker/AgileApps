import Pusher from "pusher-js";

const pusher = new Pusher(
  process.env.REACT_APP_PUSHER_KEY || "sprintflow-key",
  {
    wsHost: process.env.REACT_APP_PUSHER_HOST || "127.0.0.1",
    wsPort: Number.parseInt(process.env.REACT_APP_PUSHER_PORT || "6001"),
    wssPort: Number.parseInt(process.env.REACT_APP_PUSHER_PORT || "6001"),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    cluster: process.env.REACT_APP_PUSHER_CLUSTER || "mt1",
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    },
  }
);

export default pusher;

export const subscribeToProject = (
  projectId: string,
  callback: (data: any) => void
) => {
  const channel = pusher.subscribe(`private-project.${projectId}`);

  channel.bind("task.updated", callback);
  channel.bind("sprint.updated", callback);

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`private-project.${projectId}`);
  };
};

export const subscribeToNotifications = (
  userId: string,
  callback: (data: any) => void
) => {
  const channel = pusher.subscribe(`private-user.${userId}`);

  channel.bind("notification.new", callback);

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`private-user.${userId}`);
  };
};
