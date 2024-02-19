import { getCollection } from "astro:content";

export async function isHtmxRequest(request) {
  return request.headers.get("HX-Request") === "true";
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
    const chapterA = chapters.find(
      (chapter) => chapter.id === a.data.chapter.id,
    );
    const chapterB = chapters.find(
      (chapter) => chapter.id === b.data.chapter.id,
    );

    if (chapterA.data.index === chapterB.data.index) {
      return a.data.index - b.data.index;
    }
    return chapterA.data.index - chapterB.data.index;
  });
}

export async function getLatestEntry(collection) {
  // Gets the latest entry collection based on the pubDate field
  const entries = await getCollection(collection);
  return entries.sort((a, b) => {
    return new Date(b.data.pubDate) - new Date(a.data.pubDate);
  })[0];
}

export async function getLatestContentCollectionEntry() {
  // Logic to retrieve and compare the latest blog and course lesson entries
  const latestBlog = await getLatestEntry("blogs");
  const latestLesson = await getLatestEntry("course_lessons");

  // Determine which is the latest entry
  const isBlogLatest =
    new Date(latestBlog.data.pubDate) > new Date(latestLesson.data.pubDate);

  return {
    entry: isBlogLatest ? latestBlog : latestLesson,
    type: isBlogLatest ? "blog" : "lesson",
    url: isBlogLatest
      ? `/blogs/${latestBlog.slug}/`
      : `/course/${latestLesson.slug}/`,
  };
}

export async function getNextLesson(lesson) {
  const sortedLessons = await getSortedLessons();
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
  return sortedLessons[currentIndex + 1];
}

export async function getPreviousLesson(lesson) {
  const sortedLessons = await getSortedLessons();
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
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
    I: 1,
  };
  let str = "";

  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
}

export function redirectWithHtmx(url: string) {
  return new Response(null, { status: 302, headers: { "HX-Redirect": url } });
}
