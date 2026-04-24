package com.amanhogan.spring_flash.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amanhogan.spring_flash.dto.FlashCardDto;
import com.amanhogan.spring_flash.service.FlashCardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sets/{setId}/cards")
@RequiredArgsConstructor
public class FlashCardController {

    private final FlashCardService service;

    @GetMapping
    public List<FlashCardDto> findBySet(@PathVariable Long setId) {
        return service.findBySet(setId);
    }

    @GetMapping("/{cardId}")
    public FlashCardDto findById(@PathVariable Long setId, @PathVariable Long cardId) {
        return service.findById(setId, cardId);
    }

    @GetMapping("/starred")
    public List<FlashCardDto> starred(@PathVariable Long setId) {
        return service.starred(setId);
    }

    @GetMapping("/group")
    public List<FlashCardDto> byGroup(@PathVariable Long setId, @RequestParam String name) {
        return service.byGroup(setId, name);
    }

    @GetMapping("/groups")
    public List<String> groups(@PathVariable Long setId) {
        return service.groups(setId);
    }

    @PostMapping
    public FlashCardDto create(@PathVariable Long setId, @RequestBody FlashCardDto dto) {
        return service.create(setId, dto);
    }

    @PostMapping("/bulk")
    public List<FlashCardDto> createBulk(@PathVariable Long setId, @RequestBody List<FlashCardDto> dtos) {
        return service.createBulk(setId, dtos);
    }

    @PutMapping("/{cardId}")
    public FlashCardDto update(@PathVariable Long setId, @PathVariable Long cardId, @RequestBody FlashCardDto dto) {
        return service.update(setId, cardId, dto);
    }

    @PatchMapping("/{cardId}/star")
    public FlashCardDto toggleStar(@PathVariable Long setId, @PathVariable Long cardId) {
        return service.toggleStar(setId, cardId);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> delete(@PathVariable Long setId, @PathVariable Long cardId) {
        service.delete(setId, cardId);
        return ResponseEntity.noContent().build();
    }
}
