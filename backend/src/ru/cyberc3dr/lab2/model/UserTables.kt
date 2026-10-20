package ru.cyberc3dr.lab2.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant

enum class Role {
    ADMIN,
    USER
}

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(name = "username", nullable = false, unique = true, length = 100)
    var username: String,

    @Column(name = "password", nullable = false, length = 100)
    var password: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    var role: Role = Role.USER,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
)

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
    fun existsByUsername(username: String): Boolean
}
