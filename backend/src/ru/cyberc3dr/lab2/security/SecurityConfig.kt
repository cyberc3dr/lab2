package ru.cyberc3dr.lab2.security

import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import ru.cyberc3dr.lab2.util.ErrorResponse
import java.time.Instant

@Configuration
@EnableWebSecurity
class SecurityConfig(private val jwtAuthFilter: JwtAuthFilter) {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                // Просмотр ссылок доступен анонимно: уровень сервиса решает, что именно видно
                auth
                    .requestMatchers(HttpMethod.GET, "/api/links", "/api/links/**").permitAll()
                    .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                    .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                    .anyRequest().authenticated()
            }
            .exceptionHandling { handling ->
                handling.authenticationEntryPoint { _, response, _ ->
                    writeError(response, 401, "Unauthorized", "Требуется аутентификация")
                }
                handling.accessDeniedHandler { _, response, _ ->
                    writeError(response, 403, "Forbidden", "Доступ запрещён")
                }
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    private fun writeError(response: HttpServletResponse, status: Int, error: String, message: String) {
        response.status = status
        response.contentType = "application/json;charset=UTF-8"
        val body = ErrorResponse(status = status, error = error, message = message, timestamp = Instant.now().toString())
        response.writer.write(
            """{"status":${body.status},"error":"${body.error}","message":"${body.message}","timestamp":"${body.timestamp}"}"""
        )
    }
}
