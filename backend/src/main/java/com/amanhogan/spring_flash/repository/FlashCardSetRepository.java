package com.amanhogan.spring_flash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.amanhogan.spring_flash.model.FlashCardSet;

public interface FlashCardSetRepository extends JpaRepository<FlashCardSet, Long> {

    List<FlashCardSet> findByOwnerIdOrderByUpdatedAtDesc(String ownerId);

    @Query("SELECT s FROM FlashCardSet s WHERE " +
           "LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.topic) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<FlashCardSet> search(@Param("q") String query);

    @Query("SELECT s FROM FlashCardSet s JOIN s.tags t WHERE t = :tag")
    List<FlashCardSet> findByTag(@Param("tag") String tag);
}
