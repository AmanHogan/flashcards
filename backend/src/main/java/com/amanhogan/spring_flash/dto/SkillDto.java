package com.amanhogan.spring_flash.dto;

import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private Long id;
    private String name;
    private Integer proficiency;
    private LocalDate date;
    private Long flashCardSetId;
    private String flashCardSetTitle;
    private Instant createdAt;
    private Instant updatedAt;
}
