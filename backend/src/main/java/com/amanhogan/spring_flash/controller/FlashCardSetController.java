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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amanhogan.spring_flash.dto.FlashCardSetDto;
import com.amanhogan.spring_flash.service.FlashCardSetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sets")
@RequiredArgsConstructor
public class FlashCardSetController {

    private final FlashCardSetService service;

    @GetMapping
    public List<FlashCardSetDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public FlashCardSetDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/search")
    public List<FlashCardSetDto> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/owner/{ownerId}")
    public List<FlashCardSetDto> findByOwner(@PathVariable String ownerId) {
        return service.findByOwner(ownerId);
    }

    @GetMapping("/tag/{tag}")
    public List<FlashCardSetDto> findByTag(@PathVariable String tag) {
        return service.findByTag(tag);
    }

    @PostMapping
    public FlashCardSetDto create(@RequestBody FlashCardSetDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public FlashCardSetDto update(@PathVariable Long id, @RequestBody FlashCardSetDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/study")
    public FlashCardSetDto recordStudySession(@PathVariable Long id) {
        return service.recordStudySession(id);
    }
}
