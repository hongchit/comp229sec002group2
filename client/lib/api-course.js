const getCourse = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      "/api/user/" + params.userId + "/courses/" + params.courseId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { getCourse };
