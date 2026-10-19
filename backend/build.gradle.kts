plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.kotlin)
}

group = "ru.cyberc3dr"
version = "0.1-SNAPSHOT"
description = "lab2"

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.web)
    implementation(libs.spring.validation)
    implementation(libs.spring.openapi)

    implementation(libs.jackson.kotlin)
    implementation(libs.kotlin.reflect)
}

java.toolchain.languageVersion.set(JavaLanguageVersion.of(25))

kotlin {
    jvmToolchain(25)
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<Jar> {
    destinationDirectory = file("$rootDir/build")
    archiveVersion = ""
}

sourceSets.main {
    kotlin.srcDir("src")
    resources.srcDir("resources")
}
