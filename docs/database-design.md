# CareerPilot — Database Design

## 1. User

Purpose: Store account information using Django's built-in user model.

CareerPilot will use Django authentication for registration, login, and password management.

## 2. JobApplication

Purpose: Store each user's job application details.

| Field | Type | Purpose |
|---|---|---|
| id | Primary key | Unique application identifier |
| user | Foreign key to User | Application owner |
| company_name | String | Company name |
| job_title | String | Role being applied for |
| job_url | URL, optional | Link to the job posting |
| status | String / choice | Current application status |
| applied_date | Date, optional | Date of application |
| location | String, optional | Job location or work model |
| job_description | Text, optional | Description used for skill matching |
| notes | Text, optional | Personal notes |
| created_at | DateTime | Record creation time |
| updated_at | DateTime | Last update time |

### Application Status Choices

- Wishlist
- Applied
- Assessment
- Interview
- Offer
- Rejected

## 3. UserSkill

Purpose: Store the skills a user wants to compare with job requirements.

| Field | Type | Purpose |
|---|---|---|
| id | Primary key | Unique skill identifier |
| user | Foreign key to User | Skill owner |
| skill_name | String | Example: Python, React, SQL |

## Relationships

- One User can have many JobApplication records.
- One User can have many UserSkill records.
- Every application and skill belongs to one user.
- Users must only be able to access their own records.

## Skill Matching

The initial matching feature will compare normalized skill keywords from a job description with the user's saved skills.

The result will show:
- Matched skills
- Missing keywords
- A simple match percentage, when meaningful

This is keyword-based guidance, not a guarantee of job suitability.

## Initial Design Decisions

- Use Django's built-in User model.
- Use PostgreSQL as the planned database.
- Enforce user-specific data access in the backend.
- Make job URL, application date, location, job description, and notes optional.
- Add validation and tests during implementation.
