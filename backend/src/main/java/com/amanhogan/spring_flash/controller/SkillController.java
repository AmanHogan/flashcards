package com.amanhogan.spring_flash.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amanhogan.spring_flash.dto.SkillDto;
import com.amanhogan.spring_flash.service.SkillService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService service;

    @GetMapping
    public List<SkillDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SkillDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/set/{setId}")
    public List<SkillDto> findBySet(@PathVariable Long setId) {
        return service.findBySet(setId);
    }

    @PostMapping
    public SkillDto create(@RequestBody SkillDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public SkillDto update(@PathVariable Long id, @RequestBody SkillDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
