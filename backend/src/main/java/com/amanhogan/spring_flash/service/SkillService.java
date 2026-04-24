package com.amanhogan.spring_flash.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amanhogan.spring_flash.dto.SkillDto;
import com.amanhogan.spring_flash.exception.ResourceNotFoundException;
import com.amanhogan.spring_flash.model.FlashCardSet;
import com.amanhogan.spring_flash.model.Skill;
import com.amanhogan.spring_flash.repository.FlashCardSetRepository;
import com.amanhogan.spring_flash.repository.SkillRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepo;
    private final FlashCardSetRepository setRepo;

    private SkillDto toDto(Skill s) {
        return SkillDto.builder()
                .id(s.getId())
                .name(s.getName())
                .proficiency(s.getProficiency())
                .date(s.getDate())
                .flashCardSetId(s.getFlashCardSet() != null ? s.getFlashCardSet().getId() : null)
                .flashCardSetTitle(s.getFlashCardSet() != null ? s.getFlashCardSet().getTitle() : null)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    public List<SkillDto> findAll() {
        return skillRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public SkillDto findById(Long id) {
        return toDto(skillRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", id)));
    }

    public List<SkillDto> findBySet(Long setId) {
        return skillRepo.findByFlashCardSetId(setId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public SkillDto create(SkillDto dto) {
        Skill skill = Skill.builder()
                .name(dto.getName())
                .proficiency(dto.getProficiency())
                .date(dto.getDate())
                .build();
        if (dto.getFlashCardSetId() != null) {
            FlashCardSet set = setRepo.findById(dto.getFlashCardSetId())
                    .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", dto.getFlashCardSetId()));
            skill.setFlashCardSet(set);
        }
        return toDto(skillRepo.save(skill));
    }

    public SkillDto update(Long id, SkillDto dto) {
        Skill skill = skillRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", id));
        if (dto.getName() != null) skill.setName(dto.getName());
        if (dto.getProficiency() != null) skill.setProficiency(dto.getProficiency());
        if (dto.getDate() != null) skill.setDate(dto.getDate());
        if (dto.getFlashCardSetId() != null) {
            FlashCardSet set = setRepo.findById(dto.getFlashCardSetId())
                    .orElseThrow(() -> new ResourceNotFoundException("FlashCardSet", dto.getFlashCardSetId()));
            skill.setFlashCardSet(set);
        }
        return toDto(skillRepo.save(skill));
    }

    public void delete(Long id) {
        Skill skill = skillRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", id));
        skillRepo.delete(skill);
    }
}
