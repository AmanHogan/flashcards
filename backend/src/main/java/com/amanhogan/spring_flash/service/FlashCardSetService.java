package com.amanhogan.spring_flash.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amanhogan.spring_flash.dto.FlashCardDto;
import com.amanhogan.spring_flash.dto.FlashCardSetDto;
import com.amanhogan.spring_flash.exception.ResourceNotFoundException;
import com.amanhogan.spring_flash.model.FlashCard;
import com.amanhogan.spring_flash.model.FlashCardSet;
import com.amanhogan.spring_flash.repository.FlashCardRepository;
import com.amanhogan.spring_flash.repository.FlashCardSetRepository;
import com.amanhogan.spring_flash.repository.SkillRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FlashCardSetService {

    private final FlashCardSetRepository setRepo;
    private final FlashCardRepository cardRepo;
    private final SkillRepository skillRepo;

    public List<FlashCardSetDto> findAll() {
        return setRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public FlashCardSetDto findById(Long id) {
        return toDto(setRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", id)));
    }

    public List<FlashCardSetDto> search(String query) {
        return setRepo.search(query).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<FlashCardSetDto> findByOwner(String ownerId) {
        return setRepo.findByOwnerIdOrderByUpdatedAtDesc(ownerId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<FlashCardSetDto> findByTag(String tag) {
        return setRepo.findByTag(tag).stream().map(this::toDto).collect(Collectors.toList());
    }

    public FlashCardSetDto create(FlashCardSetDto dto) {
        FlashCardSet entity = FlashCardSet.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .topic(dto.getTopic())
                .ownerId(dto.getOwnerId())
                .tags(dto.getTags() != null ? dto.getTags() : List.of())
                .build();

        if (dto.getFlashCards() != null) {
            for (FlashCardDto cardDto : dto.getFlashCards()) {
                FlashCard card = FlashCard.builder()
                        .term(cardDto.getTerm())
                        .definition(cardDto.getDefinition())
                        .sortOrder(cardDto.getSortOrder() != null ? cardDto.getSortOrder() : 0)
                        .groupName(cardDto.getGroupName())
                        .hint(cardDto.getHint())
                        .termImageUrl(cardDto.getTermImageUrl())
                        .definitionImageUrl(cardDto.getDefinitionImageUrl())
                        .starred(cardDto.getStarred() != null ? cardDto.getStarred() : false)
                        .flashCardSet(entity)
                        .build();
                entity.getFlashCards().add(card);
            }
        }
        return toDto(setRepo.save(entity));
    }

    public FlashCardSetDto update(Long id, FlashCardSetDto dto) {
        FlashCardSet entity = setRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", id));
        if (dto.getTitle() != null) entity.setTitle(dto.getTitle());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getTopic() != null) entity.setTopic(dto.getTopic());
        if (dto.getOwnerId() != null) entity.setOwnerId(dto.getOwnerId());
        if (dto.getTags() != null) entity.setTags(dto.getTags());
        return toDto(setRepo.save(entity));
    }

    public void delete(Long id) {
        FlashCardSet entity = setRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", id));
        skillRepo.findByFlashCardSetId(id).forEach(skillRepo::delete);
        setRepo.delete(entity);
    }

    public FlashCardSetDto recordStudySession(Long id) {
        FlashCardSet entity = setRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", id));
        entity.setTimesStudied(entity.getTimesStudied() + 1);
        return toDto(setRepo.save(entity));
    }

    public FlashCardSetDto toDto(FlashCardSet entity) {
        List<FlashCardDto> cards = entity.getFlashCards().stream()
                .map(c -> FlashCardDto.builder()
                        .id(c.getId())
                        .term(c.getTerm())
                        .definition(c.getDefinition())
                        .sortOrder(c.getSortOrder())
                        .groupName(c.getGroupName())
                        .termImageUrl(c.getTermImageUrl())
                        .definitionImageUrl(c.getDefinitionImageUrl())
                        .hint(c.getHint())
                        .starred(c.getStarred())
                        .build())
                .collect(Collectors.toList());

        return FlashCardSetDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .topic(entity.getTopic())
                .ownerId(entity.getOwnerId())
                .tags(entity.getTags())
                .flashCards(cards)
                .timesStudied(entity.getTimesStudied())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .cardCount(entity.getFlashCards().size())
                .build();
    }
}
