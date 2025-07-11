package com.conversee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.conversee.entity.FileMessage;

public interface FileMessageRepository extends JpaRepository<FileMessage, String> {}
