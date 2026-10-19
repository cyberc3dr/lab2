package ru.cyberc3dr.lab2.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Entity
@Table(name = "links")
data class Link(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(name = "title", nullable = false, length = 500)
    var title: String,

    @Column(name = "url", nullable = false, length = 2048)
    var url: String,

    @Column(name = "description", columnDefinition = "text")
    var description: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
)

@Repository
interface LinkRepository : JpaRepository<Link, Long> {

}