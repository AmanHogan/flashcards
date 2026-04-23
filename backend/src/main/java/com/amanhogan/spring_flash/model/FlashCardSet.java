package com.amanhogan.spring_flash.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashCardSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "flashCardSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<FlashCard> flashCards = new ArrayList<>();

    /**
     * How many times the user opened study mode for this set (Quizlet-style
     * progress).
     */
    @Builder.Default
    private Integer timesStudied = 0;

    @Builder.Default
    @ElementCollection(fetch = FetchType.LAZY)
    private List<String> tags = new ArrayList<>();

    /** Broad subject or course grouping (e.g. "Biology", "Spanish 101"). */
    @Column(columnDefinition = "TEXT")
    private String topic;

    /** Who owns the set; wire to a User entity later if you add auth. */
    private String ownerId;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
