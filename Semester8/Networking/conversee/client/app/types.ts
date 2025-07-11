type Message = {
  id: string;
  username: string;
  receiver: string;
  content: string;
  timestamp: string;
};

type FileMessage = {
  id: string;
  username: string;
  fileId: string;
  fileName: string;
  timestamp: string;
};
