import { API } from './api.js';
import { FavoriteJobsStorage } from './storage.js';



const exampleResponseFromServer = [
    {
        apply_options: [
            {
                publisher: "Clearance Jobs",
                apply_link:
                    "https://www.clearancejobs.com/jobs/7577219/python-software-engineer",
                is_direct: false,
            },
            {
                publisher: "ZipRecruiter",
                apply_link:
                    "https://www.ziprecruiter.com/c/Base-2-Solutions/Jo…e-Engineer/-in-Charleston,SC?jid=f646835362aad78f",
                is_direct: false,
            },
            {
                publisher: "LinkedIn",
                apply_link:
                    "https://www.linkedin.com/jobs/view/software-engine…th-security-clearance-at-clearancejobs-3910596117",
                is_direct: false,
            },
            {
                publisher: "Talent.com",
                apply_link: "https://www.talent.com/view?id=ff0e0e270eb4",
                is_direct: false,
            },
            {
                publisher: "Indeed",
                apply_link:
                    "https://www.indeed.com/viewjob?jk=9a5eea7e6b5ace28",
                is_direct: false,
            },
            {
                publisher: "BeBee",
                apply_link:
                    "https://us.bebee.com/job/470547a3a594dfa8d59cc0b82f6893fc",
                is_direct: false,
            },
            {
                publisher: "SimplyHired",
                apply_link:
                    "https://www.simplyhired.com/job/Yzw1S3SEYXuvI_-Bsj6YZxJKKMEHlCTvyi0pLwwzV2byknxvWKUa1A",
                is_direct: false,
            },
            {
                publisher: "Learn4Good",
                apply_link:
                    "https://www.learn4good.com/jobs/charleston/south-carolina/info_technology/3018008778/e/",
                is_direct: false,
            },
        ],
        employer_logo: "",
        employer_name: "",
        job_apply_link: "",
        job_apply_quality_score: 0.6667,
        job_benefits: [
            "retirement_savings",
            "health_insurance",
            "dental_coverage",
            "paid_time_off",
        ],
        job_city: "",
        job_country: "",
        job_description: "",
        job_employment_type: "",
        job_google_link: "",
        job_highlights: {
            Benefits: ["", "", ""],
            Qualifications: ["", "", ""],
            Responsibilities: ["", "", ""],
        },
        job_id: "",
        job_job_title: "",
        job_offer_expiration_datetime_utc: "2024-07-20T00:00:03.000Z",
        job_offer_expiration_timestamp: 1721433603,
        job_onet_job_zone: "4",
        job_onet_soc: "15113200",
        job_posted_at_datetime_utc: "2024-05-21T15:06:03.000Z",
        job_posted_at_timestamp: 1716303963,
        job_state: "SC",
        job_title: "",
    },
];

const searchJobButton = document.querySelector("#search-job-button");
const jobSearchInput = document.querySelector("#job-search");
const welcomeUsers = document.querySelector(".welcome-users");

export class Jobs {
    constructor(apiInstance, storageInstance) {
        this.api = apiInstance;
        this.storage = storageInstance;
    }

    renderJobs(parent) {

        const toggleInputDisplay = () => {
            if (window.innerWidth <= 400) {
                if (jobSearchInput.style.display === "none" || !jobSearchInput.style.display) {
                    jobSearchInput.style.display = "block";
                    searchJobButton.classList.remove("custom-search-button")
                } else {
                    jobSearchInput.style.display = "none";
                }
            }
        };

        searchJobButton.classList.add("custom-search-button");

        searchJobButton.onclick = async () => {
            if (window.innerWidth <= 400 && (jobSearchInput.style.display === "none" || !jobSearchInput.style.display)) {
                toggleInputDisplay();
                return;
            }

            const inputValue = jobSearchInput.value;
            const jobs = await this.api.searchJobs(inputValue);
            this.displayJobs(parent, jobs);

            jobSearchInput.value = "";
            
            welcomeUsers.classList.toggle("hidden");
        };

        // Initial input display setup for small screens
        if (window.innerWidth <= 400) {
            jobSearchInput.style.display = "none";
        } else {
            jobSearchInput.style.display = "block";
        }

        // Загрузить и отобразить сохраненные вакансии при инициализации
        this.loadFavoriteJobs(parent);
    }

    displayJobs(drawingLocation, jobs) {
        drawingLocation.innerHTML = ""; // Очищаем предыдущие результаты
        jobs.forEach((job) => {
            const jobElement = document.createElement("div");
            jobElement.classList.add("card");
            jobElement.innerHTML = `            
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="${job.employer_logo}" alt="Company Logo"/>
                    <svg class="favorite-job" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#1C274C"/>
                    </svg>
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4" id="job-card-title">
                        <h4>${job.employer_name}</h4>
                        <h6>Job title: ${job.job_title}</h6>
                        <span>Employment type: ${job.job_employment_type}</span>
                        <i class="material-icons right">more_vert</i>
                    </span>
                    <p><a href="${job.job_apply_link}">link to vacancy</a></p>
                    <p class="google-job-link-box"><a href="${job.job_google_link}" class="google-job-link"><img src="./img/google.svg" alt="google"></a></p>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <h6>Job title: ${job.job_title}</h6>
                        <i class="material-icons right">close</i>
                    </span>
                    <p>
                        ${job.job_description}
                    </p>
                </div>          
            `;

            const favoriteJob = jobElement.querySelector(".favorite-job");
            const path = favoriteJob.querySelector("path");

            // Проверяем, сохранена ли вакансия
            if (this.storage.isJobFavorited(job)) {
                path.style.fill = "red";
            }

            favoriteJob.addEventListener("click", () => {
                if (path.style.fill === "red") {
                    path.style.fill = "#1C274C";
                    this.storage.removeJob(job);
                } else {
                    path.style.fill = "red";
                    this.storage.addJob(job);
                }
            });

            drawingLocation.appendChild(jobElement);
        });
    }

    loadFavoriteJobs(drawingLocation) {
        const favoriteJobs = this.storage.getFavoriteJobs();
        
        if (favoriteJobs.length !== 0) {
            welcomeUsers.classList.toggle("favorite-vacancies");
            const favoriteVacancies = document.querySelector(".welcome-to-the-site");
            favoriteVacancies.classList.toggle("favorite-vacancies-title");
            favoriteVacancies.textContent = "Favorite Vacancies"
        } else {
            welcomeUsers.classList.remove("favorite-vacancies")
        }



        this.displayJobs(drawingLocation, favoriteJobs);
    }
}
