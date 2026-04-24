package com.amanhogan.spring_flash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.amanhogan.spring_flash.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByFlashCardSetId(Long flashCardSetId);

    List<Skill> findByNameContainingIgnoreCase(String name);

    List<Skill> findAllByOrderByProficiencyDesc();
}
