export async function refreshSubjectMetadata(uuid) {
  return await fetch(`/admin/subjects/${uuid}/refresh_metadata.json`, {
    credentials: "include",
    method: "POST"
  });
}

export async function refreshTweets(uuid) {
  return await fetch(`/admin/subjects/${uuid}/refresh_tweets.json`, {
    credentials: "include",
    method: "POST"
  });
}

export async function getSubject(subject) {
  return await fetch(`/admin/subjects/${subject.uuid}.json`, {
    credentials: "include",
    method: "GET"
  });
}
