export class FavoriteJobsStorage {
    constructor(storageKey = 'favoriteJobs') {
        this.storageKey = storageKey;
    }

    addJob(job) {
        let favoriteJobs = this.getFavoriteJobs();
        favoriteJobs.push(job);
        localStorage.setItem(this.storageKey, JSON.stringify(favoriteJobs));
    }

    removeJob(job) {
        let favoriteJobs = this.getFavoriteJobs();
        favoriteJobs = favoriteJobs.filter(favJob => favJob.job_id !== job.job_id);
        localStorage.setItem(this.storageKey, JSON.stringify(favoriteJobs));
    }

    getFavoriteJobs() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    isJobFavorited(job) {
        const favoriteJobs = this.getFavoriteJobs();
        return favoriteJobs.some(favJob => favJob.job_id === job.job_id);
    }
}
