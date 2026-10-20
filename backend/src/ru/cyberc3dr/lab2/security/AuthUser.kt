package ru.cyberc3dr.lab2.security

import org.springframework.security.core.Authentication
import ru.cyberc3dr.lab2.model.Role

data class AuthUser(
    val id: Long,
    val username: String,
    val role: Role
) {
    val isAdmin: Boolean
        get() = role == Role.ADMIN
}

fun Authentication?.authUser(): AuthUser? = this?.principal as? AuthUser
