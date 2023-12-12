import {getCollection} from "astro:content";

/**
 * isUserWithinRateLimit: Cookie-Based Request Rate Checker
 *
 * This function checks if a user has exceeded the allowed number of requests within a set time frame.
 *
 * How it works:
 * - Uses cookies to track requests from each user.
 * - Has a limit ('count') on how many requests are allowed in a certain period ('timeFrame').
 * - If the user exceeds the limit, the function blocks further requests until the time frame resets.
 * - Time frame and count reset after the set period or when the user closes the browser.
 * - Returns `true` if the user is within the limit, otherwise returns `false`.
 *
 * Note:
 * This method is not highly secure as cookies can be manipulated by users. It's a basic deterrent,
 * not a strong defense. For stronger security, use server-side rate limiting.
 */
export function isUserWithinRateLimit(cookies: any) {
    const rateLimit = { count: 10, timeFrame: 60000 }; // 10 requests per minute
    let rateLimiter = cookies.has('rate-limiter') ? JSON.parse(cookies.get('rate-limiter').value) : null;

    if (rateLimiter) {
        const timePassed = Date.now() - rateLimiter.timestamp;
        if (timePassed < rateLimit.timeFrame) {
            if (rateLimiter.count >= rateLimit.count) {
                return false; // Block the request
            }
            rateLimiter.count += 1; // Increment the count
        } else {
            rateLimiter = { count: 1, timestamp: Date.now() }; // Reset after time frame
        }
    } else {
        rateLimiter = { count: 1, timestamp: Date.now() }; // Initialize if not present
    }

    // Update the cookie
    cookies.set("rate-limiter", JSON.stringify(rateLimiter));
    return true;
}

/**
 * isHtmxRequest: HTMX Request Detector
 *
 * This function checks if a request is made using HTMX by examining the request headers.
 *
 * How it works:
 * - Checks the 'HX-Request' HTMX-specific header of the incoming request.
 * - Returns `true` if the header indicates an HTMX request, otherwise returns `false`.
 */
export function isHtmxRequest(request: any) {
    return request.headers.get('HX-Request') === 'true';
}


/**
 * Retrieves and sorts lessons from a course.
 *
 * This function first fetches lessons and chapters from their respective collections.
 * It then sorts these lessons first by the index of their chapters, and then by their own index.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of sorted lesson objects.
 */
export async function getSortedLessons() {
    const lessons = await getCollection("course_lessons");
    const chapters = await getCollection("course_chapters");

    return lessons.sort((a, b) => {
        const chapterA = chapters.find(chapter => chapter.id === a.data.chapter.id);
        const chapterB = chapters.find(chapter => chapter.id === b.data.chapter.id);

        if (chapterA.data.index === chapterB.data.index) {
            return a.data.index - b.data.index;
        }
        return chapterA.data.index - chapterB.data.index;
    });
}


export async function getFirstLesson() {
    const lessons = await getSortedLessons();
    return lessons[0];
}

export async function isLastLessonOfChapter(lesson) {
    const sortedLessons = await getSortedLessons();
    const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = sortedLessons[currentIndex + 1];
    if (!nextLesson) {
        return true;
    }
    return nextLesson.data.chapter.id !== lesson.data.chapter.id;
}

export async function getNextLesson(lesson) {
    const sortedLessons = await getSortedLessons();
    const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
    return sortedLessons[currentIndex + 1]
}


export async function getPreviousLesson(lesson) {
    const sortedLessons = await getSortedLessons();
    const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
    return sortedLessons[currentIndex - 1];
}

export function convertToRoman(num: number) {
  let roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let str = '';

  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
}
