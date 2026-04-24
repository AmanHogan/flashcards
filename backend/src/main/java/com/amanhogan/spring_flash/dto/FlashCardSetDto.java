package com.amanhogan.spring_flash.dto;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashCardSetDto {
    private Long id;
    private String title;
    private String description;
    private String topic;
    private String ownerId;
    private List<String> tags;
    private List<FlashCardDto> flashCards;
    private Integer timesStudied;
    private Instant createdAt;
    private Instant updatedAt;
    private Integer cardCount;
}
