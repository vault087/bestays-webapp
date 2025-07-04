# GitHub Copilot Instructions for Next.js 15 + TypeScript + Tailwind CSS

## Purpose
This document outlines the default instructions for using GitHub Copilot in this project. The goal is to ensure clean, efficient, and context-aware code suggestions that align with the project's best practices and requirements.

---

## General Guidelines
1. **Project Context Awareness**:
    - Always validate suggestions against the current project context.
    - Do not assume or introduce changes that deviate from the established stack (Next.js 15, TypeScript, Tailwind CSS).

2. **Best Practices**:
    - Follow modern and clean coding practices.
    - Avoid redundancy and unnecessary complexity.
    - Ensure suggestions are optimized for performance and maintainability.

3. **Communication**:
    - Always ask for clarifications when the requirements are ambiguous.
    - Warn about potential pitfalls or incorrect approaches.
    - Provide step-by-step guidance when implementing complex features.

4. **Validation**:
    - Validate all suggestions before providing them.
    - Include a validation score or reasoning to explain the suggestion's relevance.
    - Reference official documentation or trusted sources when applicable.

5. **Collaboration**:
    - Act as an assistant, not an independent decision-maker.
    - Avoid conflicting with the user's work or introducing assumptions.
    - Accompany the user in their workflow, ensuring alignment with their goals.

---

## Specific Instructions for This Project
1. **Next.js**:
    - Use the latest features of Next.js 15, such as the App Router and Server Components.
    - Ensure compatibility with TypeScript and Tailwind CSS.

2. **TypeScript**:
    - Enforce strict typing and avoid using `any` unless absolutely necessary.
    - Suggest type-safe solutions and interfaces.

3. **Tailwind CSS**:
    - Follow a utility-first approach for styling.
    - Avoid inline styles unless Tailwind cannot achieve the desired result.
    - Suggest reusable class patterns and avoid unnecessary custom CSS.

---

## Workflow Expectations
1. **Step-by-Step Guidance**:
    - Break down complex tasks into smaller, manageable steps.
    - Provide clear explanations for each step.

2. **Sources and References**:
    - Link to official documentation or trusted resources for validation.
    - Include examples or snippets to illustrate concepts.

3. **Warnings and Suggestions**:
    - Highlight potential issues or anti-patterns in the user's approach.
    - Suggest alternatives when a better solution exists.

4. **Feedback and Iteration**:
    - Encourage feedback to refine suggestions.
    - Adapt to the user's preferences and project-specific requirements.

---

## Example Validation Score
- **Relevance**: 9/10 (Fits the project context and requirements)
- **Performance**: 8/10 (Optimized for speed and scalability)
- **Maintainability**: 10/10 (Clean and easy to understand)
- **Source**: [Next.js Documentation](https://nextjs.org/docs), [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

By following these instructions, GitHub Copilot will act as a powerful and reliable assistant, ensuring high-quality code suggestions tailored to this project's needs.
## Additional Instructions

### Notifications for Outdated Approaches
- Regularly check for updates in Next.js, TypeScript, and Tailwind CSS.
- Notify the user if their approach or implementation goes against the latest standards or best practices.
- Provide links to updated documentation or changelogs to help the user stay informed.

### Documentation and Reusability
- Maintain a `docs/` folder in the project root to document the project's tech stack and chosen approaches.
- Create a `docs/project-tech-stack.md` file to outline the technologies, patterns, and conventions used in the project.
- When implementing reusable patterns (e.g., Notifications, Messages), document the structure and rationale in the `docs/` folder.
- Encourage consistency by referencing documented patterns when implementing similar features elsewhere in the app.

### Example Workflow for Reusability
1. **Implementation**:
    - When implementing a new feature, evaluate if it introduces a reusable pattern.
    - Document the pattern in the `docs/` folder with clear examples and explanations.

2. **Reference**:
    - Before implementing a similar feature, check the `docs/` folder for existing patterns.
    - Adapt the new feature to align with the documented approach.

3. **Updates**:
    - If a documented pattern is updated, ensure all related features are reviewed and updated for consistency.
    - Notify the user of any inconsistencies or outdated implementations.

By following these additional instructions, the project will maintain consistency, adaptability, and alignment with the latest standards.