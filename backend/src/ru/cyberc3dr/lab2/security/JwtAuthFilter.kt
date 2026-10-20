package ru.cyberc3dr.lab2.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.cyberc3dr.lab2.model.UserRepository

@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header != null && header.startsWith("Bearer ")) {
            val parsed = jwtService.parse(header.removePrefix("Bearer ").trim())
            if (parsed != null) {
                val user = userRepository.findById(parsed.userId).orElse(null)
                if (user != null) {
                    val principal = AuthUser(user.id, user.username, user.role)
                    val authentication = UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        listOf(SimpleGrantedAuthority("ROLE_" + user.role.name))
                    )
                    authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                    SecurityContextHolder.getContext().authentication = authentication
                }
            }
        }
        filterChain.doFilter(request, response)
    }
}
