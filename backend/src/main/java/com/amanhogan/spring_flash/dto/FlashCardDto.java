package com.amanhogan.spring_flash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashCardDto {
    private Long id;
    private String term;
    private String definition;
    private Integer sortOrder;
    private String groupName;
    private String termImageUrl;
    private String definitionImageUrl;
    private String hint;
    private Boolean starred;
}
