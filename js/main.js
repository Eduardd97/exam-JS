

// Функціональні вимоги:

// - Користувач може вказати бажану спеціальність у спеціальному полі (input)
// - За спеціальністю користувача йому пропонується список вакансій з відповідними результатами
// - Пошук відбувається, користувач отримує представлення вакансій у вигляді карток
// - Вакансії можна вподобати (для цього кожна картка кожної вакансії має відповідну кнопку)
// - Вакансії можна видалити зі списку вподобаних
// - Вподобані вакансії зберігаються у LocalStorage


import { API } from './api.js';
import { FavoriteJobsStorage } from './storage.js';
import { Jobs} from './jobs.js';

const apiInstance = new API("https://jsearch.p.rapidapi.com/search");
const storageInstance = new FavoriteJobsStorage();
const jobsInstance = new Jobs(apiInstance, storageInstance);

const renderJobs = document.querySelector("#render-jobs");
jobsInstance.renderJobs(renderJobs);
