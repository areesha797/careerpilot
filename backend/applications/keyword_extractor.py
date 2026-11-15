import re


SKILL_CATEGORIES = {
    "programming_languages": [
        "Python",
        "JavaScript",
        "TypeScript",
        "Java",
        "C",
        "C++",
        "C#",
        "PHP",
        "Ruby",
        "Go",
        "Rust",
        "Kotlin",
        "Swift",
        "SQL",
    ],
    "frameworks_and_libraries": [
        "React",
        "Next.js",
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "FastAPI",
        "Spring Boot",
        "Angular",
        "Vue.js",
        "Tailwind CSS",
        "Bootstrap",
        "Material UI",
        "REST API",
        "GraphQL",
        "Pandas",
        "NumPy",
        "scikit-learn",
        "TensorFlow",
        "PyTorch",
        "OpenCV",
    ],
    "databases": [
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "MongoDB",
        "Redis",
        "Oracle",
        "Microsoft SQL Server",
    ],
    "tools_and_platforms": [
        "Git",
        "GitHub",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "Google Cloud",
        "Power BI",
        "Tableau",
        "Excel",
        "Linux",
        "Jira",
        "Figma",
        "Jenkins",
        "GitHub Actions",
    ],
    "concepts": [
        "Machine Learning",
        "Deep Learning",
        "Artificial Intelligence",
        "Natural Language Processing",
        "Computer Vision",
        "Data Analysis",
        "Data Visualization",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming",
        "OOP",
        "REST",
        "API Development",
        "Agile",
        "Scrum",
        "CI/CD",
        "Microservices",
    ],
}


def extract_keywords(text):
    """
    Extract known technical keywords from a job description.

    Matching is case-insensitive and only returns terms
    that are actually present in the supplied text.
    """

    extracted = {}

    for category, skills in SKILL_CATEGORIES.items():
        matches = []

        for skill in skills:
            pattern = rf"(?<!\w){re.escape(skill)}(?!\w)"

            if re.search(pattern, text, flags=re.IGNORECASE):
                matches.append(skill)

        extracted[category] = matches

    keywords = [
        skill
        for category_skills in extracted.values()
        for skill in category_skills
    ]

    return {
        "keywords": keywords,
        "categories": extracted,
        "total_keywords": len(keywords),
    }
