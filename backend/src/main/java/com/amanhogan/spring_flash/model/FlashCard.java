package com.amanhogan.spring_flash.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private FlashCardSet flashCardSet;

    /** Front of the card (Quizlet "term"). */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String term;

    /** Back of the card (Quizlet "definition"). */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    /** Display order within the set. */
    @Builder.Default
    private Integer sortOrder = 0;

    /**
     * Optional subdivision label (chapter, unit, theme, etc.) so study sessions can
     * filter to a subset of cards in the set.
     */
    @Column(columnDefinition = "TEXT")
    private String groupName;

    /** Optional image for the term side (URL or app-relative path). */
    private String termImageUrl;

    /** Optional image for the definition side. */
    private String definitionImageUrl;

    /** Optional short hint shown before revealing the definition. */
    @Column(columnDefinition = "TEXT")
    private String hint;

    /** User-marked "starred" card for focused study; {@code false} when unset. */
    @Builder.Default
    private Boolean starred = false;
}
