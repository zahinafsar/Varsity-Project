package com.conversee.controller;

import java.util.List;
import java.util.Date;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.conversee.entity.Message;
import com.conversee.repository.MessageRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.conversee.entity.FileMessage;
import java.io.IOException;

import com.conversee.repository.FileMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class ChatController {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FileMessageRepository fileMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/app")
    @ResponseBody
    public String getAppInfo() {
        return "Conversee Chat Application v1.0";
    }

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        message.setId(UUID.randomUUID().toString());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return message;
    }

    @GetMapping("/messages")
    @ResponseBody
    public List<Message> getMessages() {
        return messageRepository.findAllGlobalMessages();
    }

    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public Message notifyTyping(Message message) {
        return message;
    }

    @PostMapping("/app/file")
    @ResponseBody
    public FileMessage handleFileUpload(@RequestParam("file") MultipartFile file,
            @RequestParam("username") String username,
            @RequestParam(value = "receiver", required = false) String receiver) throws IOException {
        FileMessage fileMessage = new FileMessage();
        fileMessage.setId(UUID.randomUUID().toString());
        fileMessage.setFileName(file.getOriginalFilename());
        fileMessage.setFileType(file.getContentType());
        fileMessage.setData(file.getBytes());
        fileMessage.setUsername(username);
        fileMessage.setTimestamp(new Date().toInstant().toString());

        FileMessage savedFileMessage = fileMessageRepository.save(fileMessage);
        savedFileMessage.setFileId(savedFileMessage.getId().toString());

        // Create a message record for the file
        Message fileUploadMessage = new Message();
        fileUploadMessage.setId(UUID.randomUUID().toString());
        fileUploadMessage.setUsername(username);
        fileUploadMessage.setReceiver(receiver);
        fileUploadMessage.setTimestamp(LocalDateTime.now());
        fileUploadMessage.setContent("files/" + savedFileMessage.getId());
        messageRepository.save(fileUploadMessage);

        // Broadcast the message to all clients
        messagingTemplate.convertAndSend("/topic/messages", fileUploadMessage);

        return savedFileMessage;
    }

    @GetMapping("/files/{id}")
    @ResponseBody
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        FileMessage fileMessage = fileMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        return ResponseEntity.ok()
                .header("Content-Type", fileMessage.getFileType())
                .header("Content-Disposition", "attachment; filename=\"" + fileMessage.getFileName() + "\"")
                .body(fileMessage.getData());
    }

    @GetMapping("/conversations/{username}")
    @ResponseBody
    public List<String> getUserConversations(@PathVariable String username) {
        return messageRepository.findDistinctReceiversByUsername(username);
    }

    @GetMapping("/messages/{username}/{receiver}")
    @ResponseBody
    public List<Message> getConversationWithUser(
            @PathVariable String username,
            @PathVariable String receiver) {
        return messageRepository.findConversationBetweenUsers(username, receiver);
    }
}
