package com.amanhogan.spring_flash.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amanhogan.spring_flash.dto.FlashCardDto;
import com.amanhogan.spring_flash.exception.ResourceNotFoundException;
import com.amanhogan.spring_flash.model.FlashCard;
import com.amanhogan.spring_flash.model.FlashCardSet;
import com.amanhogan.spring_flash.repository.FlashCardRepository;
import com.amanhogan.spring_flash.repository.FlashCardSetRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FlashCardService {

    private final FlashCardRepository cardRepo;
    private final FlashCardSetRepository setRepo;

    private FlashCardSet getSet(Long setId) {
        return setRepo.findById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", setId));
    }

    private FlashCardDto toDto(FlashCard c) {
        return FlashCardDto.builder()
                .id(c.getId())
                .term(c.getTerm())
                .definition(c.getDefinition())
                .sortOrder(c.getSortOrder())
                .groupName(c.getGroupName())
                .termImageUrl(c.getTermImageUrl())
                .definitionImageUrl(c.getDefinitionImageUrl())
                .hint(c.getHint())
                .starred(c.getStarred())
                .build();
    }

    public List<FlashCardDto> findBySet(Long setId) {
        return cardRepo.findByFlashCardSetIdOrderBySortOrder(setId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public FlashCardDto findById(Long setId, Long cardId) {
        FlashCard card = cardRepo.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", cardId));
        return toDto(card);
    }

    public List<FlashCardDto> starred(Long setId) {
        return cardRepo.findByFlashCardSetIdAndStarredTrue(setId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<FlashCardDto> byGroup(Long setId, String group) {
        return cardRepo.findByFlashCardSetIdAndGroupName(setId, group)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<String> groups(Long setId) {
        return cardRepo.findByFlashCardSetIdOrderBySortOrder(setId).stream()
                .map(FlashCard::getGroupName)
                .filter(g -> g != null && !g.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    public FlashCardDto create(Long setId, FlashCardDto dto) {
        FlashCardSet set = getSet(setId);
        FlashCard card = FlashCard.builder()
                .flashCardSet(set)
                .term(dto.getTerm())
                .definition(dto.getDefinition())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .groupName(dto.getGroupName())
                .hint(dto.getHint())
                .termImageUrl(dto.getTermImageUrl())
                .definitionImageUrl(dto.getDefinitionImageUrl())
                .starred(dto.getStarred() != null ? dto.getStarred() : false)
                .build();
        return toDto(cardRepo.save(card));
    }

    public List<FlashCardDto> createBulk(Long setId, List<FlashCardDto> dtos) {
        return dtos.stream().map(dto -> create(setId, dto)).collect(Collectors.toList());
    }

    public FlashCardDto update(Long setId, Long cardId, FlashCardDto dto) {
        FlashCard card = cardRepo.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", cardId));
        if (dto.getTerm() != null) card.setTerm(dto.getTerm());
        if (dto.getDefinition() != null) card.setDefinition(dto.getDefinition());
        if (dto.getSortOrder() != null) card.setSortOrder(dto.getSortOrder());
        if (dto.getGroupName() != null) card.setGroupName(dto.getGroupName());
        if (dto.getHint() != null) card.setHint(dto.getHint());
        if (dto.getTermImageUrl() != null) card.setTermImageUrl(dto.getTermImageUrl());
        if (dto.getDefinitionImageUrl() != null) card.setDefinitionImageUrl(dto.getDefinitionImageUrl());
        if (dto.getStarred() != null) card.setStarred(dto.getStarred());
        return toDto(cardRepo.save(card));
    }

    public FlashCardDto toggleStar(Long setId, Long cardId) {
        FlashCard card = cardRepo.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", cardId));
        card.setStarred(!Boolean.TRUE.equals(card.getStarred()));
        return toDto(cardRepo.save(card));
    }

    public void delete(Long setId, Long cardId) {
        FlashCard card = cardRepo.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", cardId));
        cardRepo.delete(card);
    }
}
