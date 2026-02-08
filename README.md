# Family Tasks (Work in Progress)

![Project Status: In Development](https://img.shields.io/badge/Status-In%20Development-orange.svg)
![Technologies: NestJS, TypeScript](https://img.shields.io/badge/Technologies-NestJS%20%7C%20TypeScript-blue.svg)
![Architecture: Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green.svg)

## Overview

This repository showcases "Family Tasks," a application designed to gamify the distribution of household chores among family members. This project is a work in progress and serves as a practical exploration of NestJS, TypeScript, and Clean Architecture principles.

## Features (Planned/In Progress)

*   **User Management:** Register and manage family members.
*   **Task Management:** Create, assign, and track household chores.
*   **Gamification Elements:** Points, levels, rewards system for completed tasks.
*   **Role-Based Access Control:** Differentiate between parents and children.
*   **Notifications:** Keep family members informed about task assignments and progress.

## Technologies Used

*   **NestJS:** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   **TypeScript:** A strongly typed superset of JavaScript that compiles to plain JavaScript.
*   **Clean Architecture:** Emphasizing separation of concerns, testability, and independence from frameworks and databases.

## Architecture

This project strictly adheres to the principles of Clean Architecture. The structure is organized into distinct layers to promote maintainability, scalability, and testability:

*   **Domain:** Contains the core business logic, entities, and use cases, entirely independent of any external frameworks or databases.
*   **Infrastructure:** Implements interfaces defined in the Domain layer, handling concerns like database persistence (e.g., `InMemoryUserRepository`), external services, and third-party integrations.
*   **Presentation:** Manages the external interfaces, such as REST APIs (e.g., `UsersController`), responsible for handling requests and returning responses.

## Getting Started

*(Instructions on how to set up and run the backend will go here once the project is more mature.)*

## Contribution

This project is currently under active development. Feedback and suggestions are welcome!