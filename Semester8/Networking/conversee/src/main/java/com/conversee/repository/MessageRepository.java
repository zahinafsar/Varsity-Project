package com.conversee.repository;

import com.conversee.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findById(Long id);
    List<Message> findAllByOrderByTimestampAsc();
    
    @Query("SELECT DISTINCT CASE WHEN LOWER(m.username) = LOWER(:username) THEN m.receiver ELSE m.username END FROM Message m WHERE LOWER(m.username) = LOWER(:username) OR LOWER(m.receiver) = LOWER(:username)")
    List<String> findDistinctReceiversByUsername(@Param("username") String username);
    
    @Query("SELECT m FROM Message m WHERE (LOWER(m.username) = LOWER(:username) AND LOWER(m.receiver) = LOWER(:receiver)) OR (LOWER(m.username) = LOWER(:receiver) AND LOWER(m.receiver) = LOWER(:username)) ORDER BY m.timestamp ASC")
    List<Message> findConversationBetweenUsers(@Param("username") String username, @Param("receiver") String receiver);

    @Query("SELECT m FROM Message m WHERE m.receiver IS NULL ORDER BY m.timestamp ASC")
    List<Message> findAllGlobalMessages();
}
