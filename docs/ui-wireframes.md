# CareerPilot - UI Wireframes

## 1. Overview

This document defines the initial user interface layout for CareerPilot, a job application tracker that helps users manage applications, monitor progress, and identify skill gaps.

The UI will be built using Next.js, React, and Material UI.

## 2. Main Navigation

The application will include the following navigation items:

- Dashboard
- My Applications
- Skill Gap Analysis
- My Skills
- Settings

## 3. Dashboard

### Purpose
Provide a quick overview of job search progress.

### Layout
- Sidebar: main navigation
- Header: page title and user profile
- Summary cards:
  - Total Applications
  - Applied
  - Interviews
  - Offers
- Application Status Chart
- Recent Applications Table

## 4. My Applications

### Purpose
Allow users to manage their job applications.

### Layout
- Page title: My Applications
- Add Application button
- Search input
- Status filter
- Applications table with:
  - Company Name
  - Job Title
  - Status
  - Applied Date
  - Actions

### Actions
- Add an application
- Edit application details
- Delete an application
- Update application status

## 5. Skill Gap Analysis

### Purpose
Compare a job's required skills with the user's existing skills.

### Layout
- Job description or required skills input
- Analyze Skills button
- Matched Skills section
- Missing Skills section
- Skill Match Summary

The initial version will use keyword-based skill matching.

## 6. My Skills

### Purpose
Allow users to maintain their existing skills.

### Layout
- List of saved skills
- Add Skill input
- Remove Skill action

## 7. Settings

### Purpose
Provide basic account management.

### Initial Scope
- View account information
- Log out

## 8. UI Design Principles

- Clean and simple interface
- Consistent spacing and typography
- Responsive layout for desktop and mobile
- Clear status labels
- Reusable UI components
- Accessible form labels and controls

## 9. Initial Scope

These wireframes describe the planned interface, not a completed implementation. Authentication, database integration, and live dashboard data will be implemented in later stages.
