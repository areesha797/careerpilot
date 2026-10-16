# CareerPilot — Database Design

## 1. Overview

CareerPilot is a job application tracking system that helps users manage job applications, monitor application statuses, and identify skill gaps between their existing skills and job requirements.

The initial database will use PostgreSQL. Django's built-in User model will handle user accounts and authentication.

## 2. Database Tables

### A. User

Use Django's built-in `User` model instead of creating a custom user table in the initial version.

Purpose:

- Store user account information.
- Support authentication and login.
- Connect each user's job applications and skills to their account.

### B. JobApplication

Stores the job applications created by each user.

| Field           | Type                | Required | Description                        |
| --------------- | ------------------- | -------- | ---------------------------------- |
| id              | Auto-generated ID   | Yes      | Unique application identifier      |
| user            | Foreign Key to User | Yes      | Owner of the application           |
| company_name    | String              | Yes      | Company name                       |
| job_title       | String              | Yes      | Position title                     |
| job_url         | URL                 | No       | Link to the job posting            |
| status          | Choice field        | Yes      | Current application status         |
| applied_date    | Date                | No       | Date the user applied              |
| location        | String              | No       | Job location or work arrangement   |
| job_description | Text                | No       | Job description for skill matching |
| notes           | Text                | No       | Personal notes and reminders       |
| created_at      | DateTime            | Yes      | Record creation timestamp          |
| updated_at      | DateTime            | Yes      | Last update timestamp              |

Application status choices:

- Wishlist
- Applied
- Assessment
- Interview
- Offer
- Rejected

Default status: Wishlist.

### C. UserSkill

Stores the skills associated with each user.

| Field      | Type                | Required | Description               |
| ---------- | ------------------- | -------- | ------------------------- |
| id         | Auto-generated ID   | Yes      | Unique skill identifier   |
| user       | Foreign Key to User | Yes      | Owner of the skill        |
| skill_name | String              | Yes      | Name of the skill         |
| created_at | DateTime            | Yes      | Record creation timestamp |

A user should not have duplicate skill names after normalization.

## 3. Relationships

- One User can have many JobApplication records.
- One User can have many UserSkill records.
- Every JobApplication belongs to one User.
- Every UserSkill belongs to one User.

These relationships will use foreign keys.

## 4. Data Privacy

Users must only be able to access and modify their own job applications and skills.

The backend API must enforce user-specific access permissions. Hiding another user's data in the frontend alone is not sufficient.

## 5. Skill Matching

The initial skill matcher will use Python-based keyword matching without a paid AI API.

It will:

1. Extract relevant keywords from a job description.
2. Compare them with the user's saved skills.
3. Identify matched skills.
4. Identify missing skills.

The matching results can be calculated when requested rather than stored as permanent database fields in the initial version.

## 6. Planned Technology Stack

- Frontend: Next.js, React, and Material UI
- Backend: Python and Django REST Framework
- Database: PostgreSQL
- Charts: Recharts
- Testing: Django tests
- Version control: Git and GitHub

## 7. Initial Scope

The first version will prioritize job application CRUD operations, user authentication, user-specific data access, dashboard analytics, and skill matching.

The schema may evolve as implementation and testing reveal additional requirements.
