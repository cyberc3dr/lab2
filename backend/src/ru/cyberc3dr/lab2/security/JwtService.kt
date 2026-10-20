package ru.cyberc3dr.lab2.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import ru.cyberc3dr.lab2.model.Role
import ru.cyberc3dr.lab2.model.User
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import javax.crypto.SecretKey

data class ParsedToken(
    val userId: Long,
    val username: String,
    val role: Role
)

@Service
class JwtService(
    @Value("\${app.jwt.secret}") secret: String,
    @Value("\${app.jwt.ttl-minutes}") private val ttlMinutes: Long
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))

    fun issue(user: User): String {
        val now = Instant.now()
        return Jwts.builder()
            .subject(user.username)
            .claim("uid", user.id)
            .claim("role", user.role.name)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(ttlMinutes, ChronoUnit.MINUTES)))
            .signWith(key)
            .compact()
    }

    fun parse(token: String): ParsedToken? = try {
        val claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
        val uid = claims["uid", Number::class.java]?.toLong()
        val roleName = claims["role", String::class.java]
        val role = Role.entries.firstOrNull { it.name == roleName }
        if (uid == null || role == null || claims.subject == null) null
        else ParsedToken(userId = uid, username = claims.subject, role = role)
    } catch (ex: JwtException) {
        null
    } catch (ex: IllegalArgumentException) {
        null
    }
}
