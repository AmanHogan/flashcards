package com.amanhogan.spring_flash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.amanhogan.spring_flash.model.FlashCard;

public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {

    List<FlashCard> findByFlashCardSetIdOrderBySortOrder(Long setId);

    List<FlashCard> findByFlashCardSetIdAndStarredTrue(Long setId);

    List<FlashCard> findByFlashCardSetIdAndGroupName(Long setId, String groupName);
}
